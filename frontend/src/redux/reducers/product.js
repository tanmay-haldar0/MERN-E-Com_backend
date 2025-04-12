import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    isLoading: true,
};

export const productReducer = createReducer(initialState, (builder) => {
    builder
        .addCase("productCreateRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("productCreateSuccess", (state, action) => {
            state.isLoading = false;
            state.product = action.payload;
            state.success = true;
        })
        .addCase("productCreateFailed", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = false;
        })
        .addCase("getAllProductsRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("getAllProductsSuccess", (state, action) => {
            state.isLoading = false;
            state.products = action.payload;
            state.success = true;
        })
        .addCase("getAllProductsFailed", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = false;
        })
        .addCase("resetProductCreate", (state) => {
            state.success = false;
            state.product = null;
            state.error = null;
        })

        .addCase("clearErrors", (state) => {
            state.error = null;
        });
}); 
