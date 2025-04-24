import express from "express";
import Product from "../model/product.js";
import dotenv from "dotenv"
import catchAsyncError from "../middleware/cacheAsyncError.js";
import { upload, handleUploadAndCompress } from "../multer.js";
import { v2 as cloudinary } from "cloudinary"
import Seller from "../model/seller.js";
import { isAuthenticated, isSellerAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// Create Product
router.post(
  "/create-product",
  isSellerAuthenticated,
  upload.array("images"),
  handleUploadAndCompress,
  catchAsyncError(async (req, res, next) => {
    const shopId = req.body.shopId;
    const shop = await Seller.findById(shopId);

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // Parse and sanitize the incoming data
    const imageUrls = req.files.map((file) => file.url);
    const tags = Array.isArray(req.body.tags)
      ? req.body.tags
      : req.body.tags?.split(",") || [];

    // Validate price fields
    const originalPrice = parseFloat(req.body.price);
    const salePrice = parseFloat(req.body.salePrice);

    if (isNaN(originalPrice)) {
      return res.status(400).json({ message: "Invalid original price" });
    }

    // Prepare product data
    const productData = {
      name: req.body.name,
      originalPrice,
      description: req.body.description,
      stock: parseInt(req.body.stock),
      category: req.body.category,
      isCustomizable: req.body.isCustomizable === "true",
      tags: tags,
      images: imageUrls,
      shopId: shop._id.toString(),
      shop: shop,
    };

    // Only add salePrice if it's a valid number
    if (!isNaN(salePrice)) {
      productData.salePrice = salePrice;
    }

    try {
      const product = await Product.create(productData);
      return res.status(201).json({ success: true, product });
    } catch (error) {
      console.error("Error creating product:", error);
      return res.status(500).json({
        success: false,
        message:
          error.message || "Something went wrong while creating the product",
      });
    }
  })
);

// Get all product of a seller
router.get(
  "/get-seller-all-products/:id",
  isSellerAuthenticated,
  catchAsyncError(async (req, res, next) => {
    try {
      const products = await Product.find({ shopId: req.params.id }).select(
        "-shop"
      ).sort({
        createdAt: -1,
      });

      if (!products) {
        return res.status(404).json({ message: "No Products Found" });
      } else {
        return res.status(201).json({ success: true, products });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  })
);

// Get all products
router.get(
  "/get-all-products",
  catchAsyncError(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await Product.countDocuments();
    const products = await Product.find()
      .select("-shop")
      .skip(skip)
      .limit(limit).sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  })
);

// Update a products
function getPublicIdFromUrl(url) {
  try {
    const parts = url.split("/");
    const fileWithExtension = parts.pop(); // abc123.jpg
    const folder = parts.slice(parts.indexOf("upload") + 1).join("/"); // everything after 'upload'
    const publicId = `${folder}/${fileWithExtension.split(".")[0]}`;
    return publicId;
  } catch (err) {
    return null;
  }
}

router.put(
  "/update-product/:id",
  isSellerAuthenticated,
  upload.array("images"),
  handleUploadAndCompress,
  catchAsyncError(async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product Not Found" });
      }

      // ✅ Ensure the current seller is the owner of this product
      if (product.shopId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "You are not authorized to update this product." });
      }

      // ✅ Handle removed images
      const removedImages = req.body.removedImages;
      if (removedImages) {
        const toDelete = Array.isArray(removedImages) ? removedImages : [removedImages];
        await Promise.all(
          toDelete.map(async (url) => {
            const publicId = getPublicIdFromUrl(url);
            await cloudinary.uploader.destroy(publicId);
          })
        );

        product.images = product.images.filter((url) => !toDelete.includes(url));
      }

      // ✅ Update fields (excluding restricted ones like `shopId`)
      const allowedUpdates = [
        "name",
        "description",
        "category",
        "tags",
        "originalPrice",
        "salePrice",
        "stock",
        "isCustomizable"
      ];
      allowedUpdates.forEach((key) => {
        if (req.body[key] !== undefined) {
          product[key] = req.body[key];
        }
      });

      // ✅ Add new images
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map((file) => file.url);
        product.images = [...product.images, ...newImages];
      }

      await product.save();

      res.status(200).json({ success: true, product });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  })
);


// get a specific product
router.get("/get-product/:id", catchAsyncError(async (req, res, next) => {
  try {
    const product = await Product.find({ _id: req.params.id }).select(
      "-shop"
    );
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      })
    }
    return res.status(200).json({ success: true, product });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}));


// Delete a Product

router.delete(
  "/delete-product/:id",
  isSellerAuthenticated,
  catchAsyncError(async (req, res, next) => {
    try {
      // console.log(req.params.id);
      const id = req.params.id
      const dbProduct = await Product.findById(id);
      // console.log(dbProduct);
      // const id = req.params.id

      if (!dbProduct) {
        return res.status(404).json({
          success: false,
          message: "Product Not Found",
        });
      }

      // Check if the seller owns the product
      if (dbProduct.shopId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to delete this product",
        });
      }


      // Delete images from Cloudinary
      if (dbProduct.images && dbProduct.images.length > 0) {
        await Promise.all(
          dbProduct.images.map(async (imgUrl) => {
            const publicId = getPublicIdFromUrl(imgUrl);
            console.log(publicId)
            await cloudinary.uploader.destroy(publicId);
          })
        );
      }

      await Product.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  })
);


export default router;
