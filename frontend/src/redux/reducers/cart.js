import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  cart: null,        // Entire cart object
  error: null,       // Error messages
  success: false,    // Indicates if an operation succeeded
};

export const cartReducer = createReducer(initialState, (builder) => {
  builder
    // Fetch Cart
    .addCase("getCartRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getCartSuccess", (state, action) => {
      state.isLoading = false;
      state.cart = action.payload.cart;
    })
    
    .addCase("getCartFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    })

  // Add Product to Cart
  .addCase("addToCartRequest", (state) => {
    state.isLoading = true;
  })
  .addCase("addToCartSuccess", (state, action) => {
    state.isLoading = false;
    state.cart = action.payload;
    state.success = true;
  })
  .addCase("addToCartFailed", (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
    state.success = false;
  })

  // Remove Product from Cart
  .addCase("removeFromCartRequest", (state) => {
    state.isLoading = true;
  })
  .addCase("removeFromCartSuccess", (state, action) => {
    state.isLoading = false;
    state.cart = action.payload;
    state.success = true;
  })
  .addCase("removeFromCartFailed", (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
    state.success = false;
  })

  // Clear Cart
  .addCase("clearCartRequest", (state) => {
    state.isLoading = true;
  })
  .addCase("clearCartSuccess", (state, action) => {
    state.isLoading = false;
    state.cart = action.payload;
    state.success = true;
  })
  .addCase("clearCartFailed", (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
    state.success = false;
  })

  // Reset Cart state
  .addCase("resetCartState", (state) => {
    state.success = false;
    state.error = null;
  })

  // Clear Errors
  .addCase("clearErrors", (state) => {
    state.error = null;
  });
});
