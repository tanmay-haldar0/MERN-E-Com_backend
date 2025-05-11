import express from "express";
import Stripe from "stripe";
import mongoose from "mongoose";
import Product from "../model/product.js";
import Order from "../model/order.js";
import Cart from "../model/cart.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      console.log("✅ Stripe event received:", event.type);
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      let userId, shippingAddress, cartItems;

      try {
        userId = session.metadata.userId;
        shippingAddress = JSON.parse(session.metadata.shippingAddress);
        cartItems = JSON.parse(session.metadata.cart);

        if (!userId || !cartItems || !Array.isArray(cartItems)) {
          console.error("❌ Invalid metadata in Stripe session:", session.metadata);
          return res.status(400).json({ error: "Invalid metadata in session" });
        }

        console.log("✅ Metadata parsed:", { userId, shippingAddress, cartItems });
      } catch (err) {
        console.error("❌ Failed to parse metadata:", err.message);
        return res.status(400).json({ error: "Malformed metadata in session" });
      }

      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
        const charge = paymentIntent.charges.data[0];

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
          const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

          const orderData = {
            cart: items,
            shippingAddress,
            userId: new mongoose.Types.ObjectId(userId),
            totalPrice: total,
            status: "Processing",
            paymentInfo: {
              id: paymentIntent.id,
              status: paymentIntent.status,
              type: charge.payment_method_details?.type || "unknown",
              brand: charge.payment_method_details?.card?.brand || "",
              last4: charge.payment_method_details?.card?.last4 || "",
              receiptUrl: charge.receipt_url,
            },
            shopId: new mongoose.Types.ObjectId(shopId),
            paidAt: new Date(),
          };

          console.log("📝 Creating order:", orderData);

          await Order.create(orderData);
          console.log("✅ Order created for shop:", shopId);
        }

        await Cart.findOneAndDelete({ userId });
        console.log("🧹 Cart cleared for user:", userId);
      } catch (error) {
        console.error("❌ Stripe Order Creation Error:", error);
        return res.status(500).json({ error: "Order creation failed" });
      }
    }

    res.status(200).json({ received: true });
  }
);

export default router;
