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
      shop: shop
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
        message: error.message || "Something went wrong while creating the product",
      });
    }
  })
); 

// Get all product of a seller
router.get("/get-seller-all-products/:id", catchAsyncError( async (req, res, next) => {
  try {
    const products = await Product.find({shopId: req.params.id}).select("-shop");

    if (!products){
      return res.status(404).json({message:"No Products Found"});
    }else{
      return res.status(201).json({success: true, products});
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}))

export default router;
