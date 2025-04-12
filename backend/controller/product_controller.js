import express from "express";
// import { Router } from "express";
import Product from "../model/product.js";
import catchAsyncError from "../middleware/cacheAsyncError.js";
import upload from "../multer.js";
import Seller from "../model/seller.js";


const router = express.Router();


// Create Product

router.post("/create-product", upload.array(images),catchAsyncError(async(req, res, next) => {
    try {
        
        const shopId = req.body.shopId;
        const shop = await Seller.findById(shopId);
        if (!shop){
            return res.status(404).json({ message: "Shop not found" });
        }else{
            const files =req.files;
            const imageUrls = files.map((file) => `${file.filename}`);
            const productData = req.body;
            productData.images = imageUrls;
            productData.shop = shop;

            const product = await Product.create(productData);

            res.status(200).json({
                success: true,
                product,
            });
        }

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}));

export default router;