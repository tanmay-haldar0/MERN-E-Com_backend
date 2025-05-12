import express from "express";
// import Stripe from "stripe";
import { isAuthenticated } from "../middleware/auth.js";
import catchAsyncError from "../middleware/cacheAsyncError.js";
import Stripe from "stripe";
import mongoose from "mongoose";
import Product from "../model/product.js";
import Order from "../model/order.js";
import Cart from "../model/cart.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Stripe Checkout Session for cart
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
// Direct Buy Now checkout Session
router.post(
  "/create-checkout-session/buynow/:productId",
  isAuthenticated,
  catchAsyncError(async (req, res) => {
    const { productId } = req.params;
    const { shippingAddress, quantity = 1 } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: "Shipping address is required." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    const productPrice = product.salePrice || product.originalPrice;

    const line_items = [
      {
        price_data: {
          currency: "INR",
          product_data: {
            name: product.name,
            images: [product.images[0]],
          },
          unit_amount: Math.round(productPrice * 100),
        },
        quantity,
      },
    ];

    const metadata = {
      userId: req.user._id.toString(),
      shippingAddress: JSON.stringify(shippingAddress),
      cart: JSON.stringify([
        {
          productId: product._id.toString(),
          quantity,
          price: productPrice,
          variant: "", // or send from req.body if needed
        },
      ]),
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/product/${productId}`,
      metadata,
    });

    res.json({ sessionId: session.id });
  })
);

// get orderdetails
router.get("/order-details", async (req, res) => {
  try {
    const sessionId = req.query.session_id;
    // console.log("session id is", sessionId);

    if (!sessionId) {
      return res.status(400).json({ message: "Missing session_id" });
    }

    // Optional: Verify the session exists in Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // ✅ Correct: search using sessionId, not paymentIntentId
    const orders = await Order.find({ "paymentInfo.sessionId": sessionId }).populate("cart.productId").lean();
    // console.log("orders are:", orders);

    if (!orders.length) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(orders.length === 1 ? orders[0] : orders);
  } catch (err) {
    console.error("Error fetching order details:", err);
    res.status(500).json({ message: "Failed to retrieve order" });
  }
});


export default router;