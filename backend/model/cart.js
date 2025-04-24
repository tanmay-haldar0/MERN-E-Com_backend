import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // reference to your User model
        required: true,
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",  // reference to your Product model
                required: true,
            },
            quantity: {
                type: Number,
                default: 1,
                min: 1,
            },
            priceAtAddTime: {
                type: Number,
                required: true,  // useful for historical accuracy
            },
            variant: {
                type: String,  // optional: color/size, etc.
            },
        },
    ],
    totalQuantity: {
        type: Number,
        default: 0,
    },
    totalPrice: {
        type: Number,
        default: 0,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Cart", cartSchema);
