import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter the Name of the Product"],
    },
    description: {
        type: String,
        required: [true, "Please Enter the Description of the Product"],
    },
    category: {
        type: String,
        required: [true, "Please Enter the Category"],
    },
    tags: {
        type: String,
        required: [true, "Please Enter the Tags"],
    },
    originalPrice: {
        type: Number,
        required: [true, "Please Enter the Price"],
    },
    salePrice: {
        type: Number
    },
    isCustomizable:{
        type: Boolean,
        default: false,
    },
    stock: {
        type: Number,
        required: [true, "Please enter the stock"],
    },
    images: [
        {
            type: String,
        },
    ],
    shopId: {
        type: String,
        required: true,
    },
    shop: {
        type: Object,
        required: true,
    },
    sold_out:{
        type:Number,
    },
    createdAt:{
        type:Date,
        default: Date.now(),
    }

});

export default mongoose.model("Product", productSchema);