import express from "express";
// import Stripe from "stripe";
import { isAuthenticated } from "../middleware/auth.js";
import catchAsyncError from "../middleware/cacheAsyncError.js";
import Stripe from "stripe";
import mongoose from "mongoose";
import Product from "../model/product.js";
import Order from "../model/order.js";
import Cart from "../model/cart.js";
import Razorpay from "razorpay";
import crypto from "crypto";


const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


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



// Cart-based Checkout
router.post(
  "/razorpay-payment",
  isAuthenticated,
  catchAsyncError(async (req, res) => {
    const { shippingAddress } = req.body;
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart || !cart.products.length) {
      return res.status(400).json({ success: false, message: "Cart is empty." });
    }

    const metadataItems = [];
    let totalAmount = 0;

    for (const item of cart.products) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      const itemTotal = item.priceAtAddTime * item.quantity;
      totalAmount += itemTotal;

      metadataItems.push({
        productId: item.productId.toString(),
        quantity: item.quantity,
        price: item.priceAtAddTime,
        variant: item.variant || "",
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // Amount in paisa
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        shippingAddress: JSON.stringify(shippingAddress),
        cart: JSON.stringify(metadataItems),
      },
    });

    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  })
);

// Direct Buy Now Checkout
router.post(
  "/razorpay-payment/buynow/:productId",
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
    const totalAmount = productPrice * quantity;

    const metadataItems = [
      {
        productId: product._id.toString(),
        quantity,
        price: productPrice,
        variant: "", // or req.body.variant
      },
    ];

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // Amount in paisa
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        shippingAddress: JSON.stringify(shippingAddress),
        cart: JSON.stringify(metadataItems),
      },
    });

    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  })
);



// get orderdetails
router.get("/order-details", async (req, res) => {
  try {
    const { session_id, razorpay_order_id } = req.query;

    let orders;

    if (session_id) {
      // 🔵 Stripe flow
      const session = await stripe.checkout.sessions.retrieve(session_id);

      orders = await Order.find({
        "paymentInfo.sessionId": session_id,
        "paymentInfo.gateway": "Stripe"
      }).populate("cart.productId").lean();
    } else if (razorpay_order_id) {
      // 🟠 Razorpay flow
      orders = await Order.find({
        "paymentInfo.sessionId": razorpay_order_id,
        "paymentInfo.gateway": "Razorpay"
      }).populate("cart.productId").lean();
    } else {
      return res.status(400).json({ message: "Missing session_id or razorpay_order_id" });
    }

    if (!orders || !orders.length) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(orders.length === 1 ? orders[0] : orders);
  } catch (err) {
    console.error("Error fetching order details:", err);
    res.status(500).json({ message: "Failed to retrieve order" });
  }
});



// rzp payment verification

// Verify Razorpay Payment and Save Order(s)
router.post(
  "/verify-payment",
  isAuthenticated,
  catchAsyncError(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Step 1: Verify Signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // Step 2: Fetch Razorpay Order Notes (metadata)
    const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);
    const { userId, shippingAddress, cart } = razorpayOrder.notes;

    if (!cart || !shippingAddress) {
      return res.status(400).json({ success: false, message: "Missing order metadata" });
    }

    // Check if orders with this Razorpay order/session ID already exist
    const existingOrders = await Order.find({ "paymentInfo.sessionId": razorpay_order_id });
    if (existingOrders.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Order(s) for this payment have already been processed.",
        orders: existingOrders,
      });
    }

    const cartItems = JSON.parse(cart);
    const parsedShippingAddress = JSON.parse(shippingAddress);
    const shopItemsMap = new Map();

    // Step 3: Group items by shop
    for (const item of cartItems) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      const shopId = product.shopId.toString();
      if (!shopItemsMap.has(shopId)) shopItemsMap.set(shopId, []);

      shopItemsMap.get(shopId).push({
        productId: new mongoose.Types.ObjectId(item.productId),
        quantity: item.quantity,
        price: item.price,
        variant: item.variant || "",
      });
    }

    const orders = [];

    // Step 4: Create orders per shop
    for (const [shopId, items] of shopItemsMap.entries()) {
      const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

      const orderData = {
        cart: items,
        shippingAddress: parsedShippingAddress,
        userId: new mongoose.Types.ObjectId(userId),
        totalPrice: total,
        status: "Processing",
        paymentInfo: {
          id: razorpay_payment_id,
          sessionId: razorpay_order_id,
          status: "Paid",
          type: "rzp",
          brand: "",
          last4: "",
          receiptUrl: "",
          gateway:"Razorpay"
        },
        shopId: new mongoose.Types.ObjectId(shopId),
        paidAt: new Date(),
      };

      const newOrder = await Order.create(orderData);
      orders.push(newOrder);
    }

    // Step 5: Clear cart if it exists
    await Cart.findOneAndDelete({ userId: new mongoose.Types.ObjectId(userId) });

    res.status(201).json({
      success: true,
      orders,
      message: "Payment verified and order(s) placed successfully!",
    });
  })
);




export default router;