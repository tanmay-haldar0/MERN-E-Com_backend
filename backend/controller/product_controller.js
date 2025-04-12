import express from "express";
import Product from "../model/product.js";
import catchAsyncError from "../middleware/cacheAsyncError.js";
import { upload, handleUploadAndCompress } from "../multer.js";
import Seller from "../model/seller.js";

const router = express.Router();

// Create Product
router.post(
  "/create-product",
  upload.array("images"),
  handleUploadAndCompress,
  catchAsyncError(async (req, res, next) => {
    const shopId = req.body.shopId;
    const shop = await Seller.findById(shopId);

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // Parse and sanitize the incoming data
    const imageUrls = req.files.map((file) => file.filename);
    const tags = Array.isArray(req.body.tags)
      ? req.body.tags
      : req.body.tags?.split(",") || [];

    const productData = {
      name: req.body.name,
      originalPrice: parseFloat(req.body.price),
      salePrice: parseFloat(req.body.salePrice),
      description: req.body.description,
      stock: parseInt(req.body.stock),
      category: req.body.category,
      isCustomizable: req.body.isCustomizable === "true",
      tags: tags,
      images: imageUrls,
      shopId: shop._id.toString(),
      shop: {
        _id: shop._id,
        shopName: shop.shopName,
        avatar: shop.avatar,
        name: shop.name,
        email: shop.email,
        phoneNumber: shop.phoneNumber,
      },
    };

    try {
      const product = await Product.create(productData);
      res.status(200).json({ success: true, product });
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(400).json({ success: false, message: error.message });
    }
  })
);

export default router;
