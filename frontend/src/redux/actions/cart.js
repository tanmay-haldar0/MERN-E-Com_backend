import axios from "axios";
import { server } from "../../server.js";

// Get Cart
export const getCart = () => async (dispatch) => {
  try {
    dispatch({ type: "getCartRequest" });

    const { data } = await axios.get(`${server}/cart`, {
      withCredentials: true,
    });

    dispatch({
      type: "getCartSuccess",
      payload: { cart: data.cart }, // contains 'products' inside
    });

  } catch (error) {
    dispatch({
      type: "getCartFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Add Product to Cart
export const addToCart = (productId, quantity, variant) => async (dispatch) => {
  try {
    dispatch({ type: "addToCartRequest" });

    const { data } = await axios.post(
      `${server}/cart/add`,
      { productId, quantity, variant },
      { withCredentials: true }
    );

    dispatch({
      type: "addToCartSuccess",
      payload: data.cart,
    });
  } catch (error) {
    dispatch({
      type: "addToCartFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Remove Product from Cart
export const removeFromCart = (productId) => async (dispatch) => {
  try {
    dispatch({ type: "removeFromCartRequest" });

    const { data } = await axios.delete(
      `${server}/cart/remove/${productId}`,
      { withCredentials: true }
    );

    dispatch({
      type: "removeFromCartSuccess",
      payload: data.cart,
    });
  } catch (error) {
    dispatch({
      type: "removeFromCartFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Clear Cart
export const clearCart = () => async (dispatch) => {
  try {
    dispatch({ type: "clearCartRequest" });

    const { data } = await axios.delete(`${server}/cart/clear`, {
      withCredentials: true,
    });

    dispatch({
      type: "clearCartSuccess",
      payload: data.cart,
    });
  } catch (error) {
    dispatch({
      type: "clearCartFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Reset Cart State
export const resetCartState = () => (dispatch) => {
  dispatch({ type: "resetCartState" });
};

// Clear Errors
export const clearCartErrors = () => (dispatch) => {
  dispatch({ type: "clearErrors" });
};
