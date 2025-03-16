import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    user: null, // Add user to initial state for clarity


}

export const sellerReducer = createReducer(initialState, (builder) => {
    builder
        .addCase("LoadSellerRequest", (state) => {
            state.loading = true;
        })
    .addCase("LoadSellerSuccess", (state, action) => {
        // console.log("Seller data loaded:", action.payload); // Log seller data for debugging

            state.isAuthenticated = true;
            state.loading = false;
            state.user = action.payload;
        })
        .addCase("LoadSellerFail", (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        })
        .addCase("ClearErrors", (state) => {
            state.error = null;
        });
});
