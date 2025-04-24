import { isAuthenticated } from "../middleware/auth.js";
import catchAsyncError from "../middleware/cacheAsyncError.js";
import Cart from "../model/cart.js";
import Product from "../model/product.js";
import User from "../model/user.js";
import express from "express";
const router = express.Router();

// Get Cart (Auto-create if doesn't exist)
router.get("/", isAuthenticated, catchAsyncError(async (req, res, next) => {
  try {
    // Find the user's cart, populate the products with product details
    let cart = await Cart.findOne({ userId: req.user.id })
      .populate("products.productId");  // Populate productId with product details

    if (!cart) {
      // If the cart doesn't exist, create a new one
      const userExists = await User.findById(req.user.id);
      if (!userExists) {
        return res.status(404).json({ message: "User not found" });
      }

      // Create a new cart if not found
      cart = new Cart({
        userId: req.user.id,
        products: [],
        totalQuantity: 0,
        totalPrice: 0,
      });

      await cart.save();
    }

    // Return the cart with populated product details
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}));


// Add Product to Cart
router.post("/add", isAuthenticated, catchAsyncError(async (req, res, next) => {
  const { productId, quantity, variant } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      const userExists = await User.findById(req.user.id);
      if (!userExists) return res.status(404).json({ message: "User not found" });

      cart = new Cart({
        userId: req.user.id,
        products: [],
        totalQuantity: 0,
        totalPrice: 0,
      });
    }

    const item = {
      productId,
      quantity,
      priceAtAddTime: product.salePrice || product.originalPrice,
      variant: variant || "",
    };

    const index = cart.products.findIndex(
      p => p.productId.equals(productId) && p.variant === item.variant
    );

    if (index > -1) {
      cart.products[index].quantity += quantity;
    } else {
      cart.products.push(item);
    }

    cart.totalQuantity = cart.products.reduce((acc, item) => acc + item.quantity, 0);
    cart.totalPrice = cart.products.reduce((acc, item) => acc + item.quantity * item.priceAtAddTime, 0);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}));

// Remove Product from Cart
router.delete("remove/:id", isAuthenticated, catchAsyncError(async (req, res, next) => {
  const { productId, variant } = req.body;

  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = cart.products.filter(
      item => !(item.productId.equals(productId) && item.variant === variant)
    );

    cart.totalQuantity = cart.products.reduce((acc, item) => acc + item.quantity, 0);
    cart.totalPrice = cart.products.reduce((acc, item) => acc + item.quantity * item.priceAtAddTime, 0);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}));

// Clear Cart
router.delete("/clear", isAuthenticated, catchAsyncError(async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = [];
    cart.totalQuantity = 0;
    cart.totalPrice = 0;

    await cart.save();
    res.status(200).json({ message: "Cart cleared", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}));

export default router;