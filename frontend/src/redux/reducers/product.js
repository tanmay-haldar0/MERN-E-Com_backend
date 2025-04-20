import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    isLoading: true,
    sellerProducts: [],      // Seller dashboard products
    homepageProducts: [],    // Homepage full list
    totalPages: 1,           // For pagination of homepage products
    product: null,           // Single product (used when creating/editing a product)
    error: null,             // Error handling
    success: false,          // Success flag for product creation or other actions
};

export const productReducer = createReducer(initialState, (builder) => {
    builder
        // Product Creation
        .addCase("productCreateRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("productCreateSuccess", (state, action) => {
            state.isLoading = false;
            state.product = action.payload;  // Store the newly created product
            state.success = true;
        })
        .addCase("productCreateFailed", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = false;
        })

        // Seller Dashboard (Get all seller products)
        .addCase("getAllProductsRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("getAllProductsSuccess", (state, action) => {
            state.isLoading = false;
            state.sellerProducts = action.payload;  // Populate seller's product list
            state.success = true;
        })
        .addCase("getAllProductsFailed", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = false;
        })

        // Homepage Full Product List (with pagination)
        .addCase("fullAllProductsRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("fullAllProductsSuccess", (state, action) => {
            state.isLoading = false;
            state.homepageProducts = action.payload.products;  // Populate homepage products list
            state.totalPages = action.payload.totalPages;     // Store total pages for pagination
            state.success = true;
        })
        .addCase("fullAllProductsFailed", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = false;
        })

        // Reset product create state
        .addCase("resetProductCreate", (state) => {
            state.success = false;
            state.product = null;
            state.error = null;
        })

        // Clear errors globally
        .addCase("clearErrors", (state) => {
            state.error = null;
        });
});
