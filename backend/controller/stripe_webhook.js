import express from "express";
import Stripe from "stripe";
import mongoose from "mongoose";
import Product from "../model/product.js";
import Order from "../model/order.js";
import Cart from "../model/cart.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// console.log("✅ Stripe Webhook initialized. Secret present?", !!endpointSecret);

router.post(
  "/webhook", // Mounted as /api/v2/stripe/webhook
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    // Step 1: Verify Stripe signature
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Step 2: Handle completed checkout session
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      let userId, shippingAddress, cartItems;
      try {
        userId = session.metadata.userId;
        shippingAddress = JSON.parse(session.metadata.shippingAddress);

        if (session.metadata.cart) {
          cartItems = JSON.parse(session.metadata.cart);
        } else if (session.metadata.productId) {
          cartItems = [
            {
              productId: session.metadata.productId,
              quantity: parseInt(session.metadata.quantity || "1", 10),
              price: parseFloat(session.metadata.price),
              variant: session.metadata.variant || "",
            },
          ];
        } else {
          return res.status(400).send("Invalid order metadata.");
        }
      } catch (err) {
        console.error("❌ Failed to parse metadata:", err.message);
        return res.status(400).send("Malformed metadata.");
      }

      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(
          session.payment_intent,
          { expand: ["latest_charge"] }
        );

        const charge = paymentIntent.latest_charge;
        if (!charge) {
          return res.status(500).send("Charge not found.");
        }

        const shopItemsMap = new Map();

        for (const item of cartItems) {
          const product = await Product.findById(item.productId);
          if (!product) {
            console.warn("⚠️ Product not found:", item.productId);
            continue;
          }

          const shopId = product.shopId.toString();
          if (!shopItemsMap.has(shopId)) shopItemsMap.set(shopId, []);

          shopItemsMap.get(shopId).push({
            productId: new mongoose.Types.ObjectId(item.productId),
            quantity: item.quantity,
            price: item.price,
            variant: item.variant,
          });
        }

        for (const [shopId, items] of shopItemsMap.entries()) {
          const total = items.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
          );

          const orderData = {
            cart: items,
            shippingAddress,
            userId: new mongoose.Types.ObjectId(userId),
            totalPrice: total,
            status: "Processing",
            paymentInfo: {
              id: paymentIntent.id, // Stripe PaymentIntent ID
              sessionId: session.id, // Stripe session ID
              status: paymentIntent.status, // e.g., succeeded
              type: charge.payment_method_details?.type || "unknown",
              brand: charge.payment_method_details?.card?.brand || "",
              last4: charge.payment_method_details?.card?.last4 || "",
              receiptUrl: charge.receipt_url || "",
              gateway: "Stripe", // ✅ NEW FIELD
            },
            shopId: new mongoose.Types.ObjectId(shopId),
            paidAt: new Date(),
          };

          await Order.create(orderData);
        }

        await Cart.findOneAndDelete({ userId });
      } catch (err) {
        console.error("❌ Order creation failed:", err);
        return res.status(500).send("Order processing error.");
      }
    }

    // Step 3: Respond to Stripe
    res.status(200).send("Webhook received.");
  }
);

export default router;
