import express from "express";
import Order from "../model/order.js";
import Product from "../model/product.js";
import Seller from "../model/seller.js";
import Cart from "../model/cart.js";
import catchAsyncError from "../middleware/cacheAsyncError.js";
import { isAuthenticated, isSellerAuthenticated } from "../middleware/auth.js";
const router = express.Router();

// Create new order
router.post(
  "/create-order",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    const { shippingAddress, totalPrice, paymentInfo } = req.body;
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart || !cart.products.length) {
      return res.status(400).json({ success: false, message: "Cart is empty." });
    }

    try {
      const shopItemsMap = new Map();

      // Fetch shopId for each product in the cart
      for (const item of cart.products) {
        const product = await Product.findById(item.productId);

        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        const shopId = product.shopId.toString(); // Get shopId from the Product model

        if (!shopItemsMap.has(shopId)) {
          shopItemsMap.set(shopId, []);
        }

        shopItemsMap.get(shopId).push({
          productId: item.productId,
          quantity: item.quantity,
          price: item.priceAtAddTime, // Price when added to cart
          variant: item.variant,
        });
      }

      // Create an order for each shop
      const orders = [];

      for (const [shopId, items] of shopItemsMap) {
        const subTotal = items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );

        const order = await Order.create({
          cart: items,
          shippingAddress,
          userId: req.user._id, // Correct field
          totalPrice: subTotal,
          paymentInfo: JSON.stringify(paymentInfo), // Convert to string
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
  // isAdmin,
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
