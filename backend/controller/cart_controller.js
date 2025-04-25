import { isAuthenticated } from "../middleware/auth.js";
import catchAsyncError from "../middleware/cacheAsyncError.js";
import Cart from "../model/cart.js";
import Product from "../model/product.js";
import User from "../model/user.js";
import express from "express";
import mongoose from "mongoose";
const router = express.Router();

// Get Cart (Auto-create if doesn't exist)
router.get(
  "/",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    try {
      // Find the user's cart, populate the products with product details
      let cart = await Cart.findOne({ userId: req.user.id }).populate(
        "products.productId"
      ); // Populate productId with product details

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
  })
);

// Add Product to Cart
router.post(
  "/add",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    const { productId, quantity, variant } = req.body;

    try {
      const product = await Product.findById(productId);
      if (!product)
        return res.status(404).json({ message: "Product not found" });

      let cart = await Cart.findOne({ userId: req.user.id });

      if (!cart) {
        const userExists = await User.findById(req.user.id);
        if (!userExists)
          return res.status(404).json({ message: "User not found" });

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
        (p) => p.productId.equals(productId) && p.variant === item.variant
      );

      if (index > -1) {
        cart.products[index].quantity += quantity;
      } else {
        cart.products.push(item);
      }

      cart.totalQuantity = cart.products.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.quantity * item.priceAtAddTime,
        0
      );

      await cart.save();
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })
);

// Remove Product from Cart
router.delete(
  "/remove/:id",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    const productId = new mongoose.Types.ObjectId(req.params.id); // Get the actual productId from the request param
    const variant = req.query.variant || ""; // Get the variant from query params

    try {
      const cart = await Cart.findOne({ userId: req.user.id });
      if (!cart) return res.status(404).json({ message: "Cart not found" });

      // Log the productId being removed
      // console.log(`Removing product with ID: ${productId}`);

      // Loop through the cart products and remove the correct one by matching productId
      cart.products = cart.products.filter((item) => {
        // Compare actual productId in the cart's products array
        const sameProduct = item.productId.toString() === productId.toString(); // Ensure to compare ObjectIds as strings
        const sameVariant = variant ? item.variant === variant : true;

        return !(sameProduct && sameVariant); // Remove the product if both match
      });

      // Recalculate totalQuantity and totalPrice after removal
      cart.totalQuantity = cart.products.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.quantity * item.priceAtAddTime,
        0
      );

      await cart.save(); // Save the updated cart
      res.status(200).json({ cart }); // Return the updated cart to the client
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  })
);

// Clear Cart
router.delete(
  "/clear",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
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
  })
);

// Update Quantity
router.put("/update-quantity", isAuthenticated, catchAsyncError(async (req, res, next) => {
  try {
    const { productId, quantity, variant } = req.body;
    const userId = req.user.id; // Assuming you're using auth middleware
    // console.log(req.body);
    if (!productId || typeof quantity !== "number") {
      return res
        .status(400)
        .json({ message: "Product ID and valid quantity are required" });
    }

    // Fetch user's cart
    let cart = await Cart.findOne({ userId }).populate("products.productId");

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Find the item in cart, check with or without variant
    const item = cart.products.find(
      (p) =>
        p.productId._id.toString() === productId &&
        (variant ? p.variant === variant : !p.variant) // match by variant only if provided
    );

    if (!item) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    item.quantity = quantity;

    // Optionally recalculate total quantity and price
    cart.totalQuantity = cart.products.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
    cart.totalPrice = cart.products.reduce((acc, item) => {
      const price =
        item.productId.salePrice || item.productId.originalPrice || 0;
      return acc + price * item.quantity;
    }, 0);

    await cart.save();

    return res.status(200).json({ message: "Quantity updated", cart });
  } catch (error) {
    console.error("Error updating quantity:", error);
    return res.status(500).json({ message: "Server error" });
  }
}));

export default router;
