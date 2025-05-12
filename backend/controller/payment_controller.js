import express from "express";
import Stripe from "stripe";
import { isAuthenticated } from "../middleware/auth.js";
import catchAsyncError from "../middleware/cacheAsyncError.js";
import Product from "../model/product.js";
import Cart from "../model/cart.js";
import Order from "../model/order.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Stripe Checkout Session
router.post(
  "/create-checkout-session",
  isAuthenticated,
  catchAsyncError(async (req, res) => {
    const { shippingAddress } = req.body;
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart || !cart.products.length) {
      return res.status(400).json({ success: false, message: "Cart is empty." });
    }

    const line_items = [];
    const metadataItems = [];

    for (const item of cart.products) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      line_items.push({
        price_data: {
          currency: "INR",
          product_data: {
            name: product.name,
            images: [product.images[0]],
          },
          unit_amount: Math.round(item.priceAtAddTime * 100),
        },
        quantity: item.quantity,
      });

      metadataItems.push({
        productId: item.productId.toString(),
        quantity: item.quantity,
        price: item.priceAtAddTime,
        variant: item.variant || "",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: {
        userId: req.user._id.toString(),
        shippingAddress: JSON.stringify(shippingAddress),
        cart: JSON.stringify(metadataItems),
      },
    });

    res.json({ sessionId: session.id });
  })
);

export default router;