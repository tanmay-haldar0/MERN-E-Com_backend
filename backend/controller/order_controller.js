import express from "express";
import Order from "../model/order";
import Product from "../model/product";
import Seller from "../model/seller";
import catchAsyncError from "../middleware/cacheAsyncError";
import { isAuthenticated, isSellerAuthenticated } from "../middleware/auth";
const router = express.Router();

// Create new order
router.post(
  "/create-order",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

    if (!cart || !cart.length) {
      return res
        .status(400)
        .json({ success: false, message: "Cart is empty." });
    }

    try {
      const shopItemsMap = new Map();

      // Group cart items by shopId
      for (const item of cart) {
        const shopId = item.shopId;

        if (!shopItemsMap.has(shopId)) {
          shopItemsMap.set(shopId, []);
        }

        shopItemsMap.get(shopId).push(item);
      }

      // Create an order for each shop
      const orders = [];

      for (const [shopId, items] of shopItemsMap) {
        const subTotal = items.reduce(
          (acc, item) => acc + item.salePrice * item.qty,
          0
        );

        const order = await Order.create({
          cart: items,
          shippingAddress,
          user,
          totalPrice: subTotal, // Optional: use subTotal if splitting totalPrice per order
          paymentInfo,
          shopId,
        });

        orders.push(order);
      }

      res.status(201).json({
        success: true,
        orders,
        message: "Order(s) placed successfully!",
      });
    } catch (error) {
      console.error("Create Order Error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  })
);

// Get All Orders (Admin or for dashboard)
router.get(
  "/admin-orders",
  isAuthenticated,
  isAdmin,
  catchAsyncError(async (req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  })
);

// Get Orders for Specific User
router.get(
  "/user-orders",
  isAuthenticated,
  catchAsyncError(async (req, res) => {
    const orders = await Order.find({ "user._id": req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, orders });
  })
);

// Get Orders for Seller
router.get(
  "/seller-orders",
  isSellerAuthenticated,
  catchAsyncError(async (req, res) => {
    const orders = await Order.find({ shopId: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, orders });
  })
);

// Get Single Order by ID
router.get(
  "/:id",
  isAuthenticated,
  catchAsyncError(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    res.status(200).json({ success: true, order });
  })
);

// Update Order Status
router.put(
  "/update-order/:id",
  isSellerAuthenticated,
  catchAsyncError(async (req, res) => {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    order.status = status;
    if (status === "Delivered") {
      order.deliveredAt = Date.now();
    }

    await order.save();

    res
      .status(200)
      .json({ success: true, message: "Order status updated", order });
  })
);

// Cancel/Delete Order (optional)
router.delete(
  "/delete/:id",
  isAuthenticated,
  catchAsyncError(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    if (String(order.user._id) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this order",
      });
    }

    await order.remove();
    res
      .status(200)
      .json({ success: true, message: "Order deleted successfully" });
  })
);

// Direct Buy Now (without storing in cart)
router.post(
  "/direct-order",
  isAuthenticated,
  catchAsyncError(async (req, res) => {
    const { productId, qty, shippingAddress, user, paymentInfo } = req.body;

    if (!productId || !qty || qty <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product or quantity",
      });
    }

    try {
      // Fetch product details
      const product = await Product.findById(productId);
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      const orderItem = {
        _id: product._id,
        name: product.name,
        images: product.images,
        salePrice: product.salePrice,
        qty,
        shopId: product.shopId,
      };

      const subTotal = product.salePrice * qty;

      const order = await Order.create({
        cart: [orderItem],
        shippingAddress,
        user,
        totalPrice: subTotal,
        paymentInfo,
        shopId: product.shopId,
      });

      res.status(201).json({
        success: true,
        order,
        message: "Direct order placed successfully!",
      });
    } catch (error) {
      console.error("Direct Order Error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  })
);

export default router;
