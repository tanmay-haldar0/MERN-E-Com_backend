import express from "express";
import Order from "../model/order.js";
import Product from "../model/product.js";
import Seller from "../model/seller.js";
import Cart from "../model/cart.js";
import catchAsyncError from "../middleware/cacheAsyncError.js";
import { isAuthenticated, isSellerAuthenticated } from "../middleware/auth.js";
const router = express.Router();

// // Create new order
// router.post(
//   "/create-order",
//   isAuthenticated,
//   catchAsyncError(async (req, res, next) => {
//     const { shippingAddress, totalPrice, paymentInfo } = req.body;
//     const cart = await Cart.findOne({ userId: req.user._id });

//     if (!cart || !cart.products.length) {
//       return res.status(400).json({ success: false, message: "Cart is empty." });
//     }

//     try {
//       const shopItemsMap = new Map();

//       // Fetch shopId for each product in the cart
//       for (const item of cart.products) {
//         const product = await Product.findById(item.productId);

//         if (!product) {
//           throw new Error(`Product ${item.productId} not found`);
//         }

//         const shopId = product.shopId.toString(); // Get shopId from the Product model

//         if (!shopItemsMap.has(shopId)) {
//           shopItemsMap.set(shopId, []);
//         }

//         shopItemsMap.get(shopId).push({
//           productId: item.productId,
//           quantity: item.quantity,
//           price: item.priceAtAddTime, // Price when added to cart
//           variant: item.variant,
//         });
//       }

//       // Create an order for each shop
//       const orders = [];

//       for (const [shopId, items] of shopItemsMap) {
//         const subTotal = items.reduce(
//           (acc, item) => acc + item.price * item.quantity,
//           0
//         );

//         const order = await Order.create({
//           cart: items,
//           shippingAddress,
//           userId: req.user._id, // Correct field
//           totalPrice: subTotal,
//           paymentInfo: JSON.stringify(paymentInfo), // Convert to string
//           shopId,
//         });

//         orders.push(order);
//       }

//       res.status(201).json({
//         success: true,
//         orders,
//         message: "Order(s) placed successfully!",
//       });
//     } catch (error) {
//       console.error("Create Order Error:", error);
//       res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   })
// );

// // Direct Buy Now (without storing in cart)
// router.post(
//   "/create-order/:productId",
//   isAuthenticated,
//   catchAsyncError(async (req, res, next) => {
//     const { shippingAddress, totalPrice, paymentInfo, quantity } = req.body;
//     const { productId } = req.params; // Get productId from URL parameter

//     // Validate if all required fields are provided
//     if (!quantity || !shippingAddress || !totalPrice || !paymentInfo) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields.",
//       });
//     }

//     try {
//       // Fetch the product details
//       const product = await Product.findById(productId);

//       if (!product) {
//         return res.status(404).json({
//           success: false,
//           message: "Product not found.",
//         });
//       }

//       // Calculate total price based on quantity
//       const productPrice = product.salePrice || product.originalPrice;
//       const totalProductPrice = productPrice * quantity;

//       // Create the order
//       const order = await Order.create({
//         cart: [
//           {
//             productId: product._id,
//             quantity: quantity,
//             price: productPrice,
//             variant: null, // Assuming no variants for single product
//           },
//         ],
//         shippingAddress,
//         userId: req.user._id,
//         totalPrice: totalProductPrice,
//         paymentInfo: JSON.stringify(paymentInfo), // Convert paymentInfo to string
//         shopId: product.shopId, // Assuming all products have the same shopId
//       });

//       res.status(201).json({
//         success: true,
//         order,
//         message: "Order placed successfully!",
//       });
//     } catch (error) {
//       console.error("Create Order Error:", error);
//       res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   })
// );



// Get all orders (Admin)
router.get(
  "/admin-orders",
  catchAsyncError(async (req, res) => {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email")
      .populate("shopId", "name");

    const formattedOrders = orders.map((order) => ({
      id: order._id,
      orderId: "ORD" + order._id.toString().slice(-4).toUpperCase(),
      customerName: order.userId?.name || "Unknown",
      customerEmail: order.userId?.email || "N/A",
      vendorName: order.shopId?.name || "Unknown",
      amount: `$${order.totalPrice.toFixed(2)}`,
      status: order.status || "Pending",
    }));

    res.status(200).json({ success: true, orders: formattedOrders });
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
    const orders = await Order.find({ shopId: req.user._id })
      .sort({ createdAt: -1 })
      .populate("userId", "name") // populate user name only
      .populate("cart.productId", "name images salePrice"); // populate product fields

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



export default router;
