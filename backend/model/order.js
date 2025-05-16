import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },
  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      variant: {
        type: String,
      },
    },
  ],
  shippingAddress: {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
  paymentInfo: {
    id: { type: String, required: true }, // Stripe PaymentIntent ID
    sessionId:{type: String, required: true},
    status: { type: String, required: true }, // e.g., "succeeded", "requires_payment_method"
    type: { type: String, required: true }, // e.g., "Card", "UPI", "COD"
    brand: { type: String }, // e.g., "Visa", "Mastercard"
    last4: { type: String }, // last 4 digits of card
    receiptUrl: { type: String }, // Stripe receipt URL
    gateway: {type: String}
  },

  paidAt: {
    type: Date,
  },
  deliveredAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true // adds createdAt and updatedAt automatically
});

export default mongoose.model("Order", orderSchema);
