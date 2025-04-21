import express from "express"
import Order from "../model/order"
import Product from "../model/product"
import Seller from "../model/seller"
import catchAsyncError from "../middleware/cacheAsyncError"
import { isAuthenticated } from "../middleware/auth"
const router = express.Router();


// Create new order
router.post(
    "/create-order",
    isAuthenticated,
    catchAsyncError(async (req, res, next) => {
        const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

        if (!cart || !cart.length) {
            return res.status(400).json({ success: false, message: "Cart is empty." });
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
                const subTotal = items.reduce((acc, item) => acc + item.salePrice * item.qty, 0);

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
