import axios from "axios";
import { server } from "../../server.js";

// Create Product
export const createProduct = (newForm) => async (dispatch) => {
  try {
    dispatch({ type: "productCreateRequest" });

    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    };

    const { data } = await axios.post(
      `${server}/product/create-product`,
      newForm,
      config
    );

    dispatch({
      type: "productCreateSuccess",
      payload: data.product,
    });
  } catch (error) {
    dispatch({
      type: "productCreateFailed", // ✅ fixed spelling here
      payload: error.response?.data?.message || error.message,
    });
  }
};



// Get All Products of a Seller
export const getShopAllProducts = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllProductsRequest",
    });

    // Updated URL with the correct path
    const { data } = await axios.get(`${server}/product/get-seller-all-products/${id}`, {withCredentials:true});

    dispatch({
      type: "getAllProductsSuccess",
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: "getAllProductsFailed", // ✅ fixed spelling here
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get All Products
const itemsPerPage = 20;

export const getAllProducts = (page = 1, limit = 20) => async (dispatch) => {
  try {
    dispatch({ type: "fullAllProductsRequest" });

    const { data } = await axios.get(
      `${server}/product/get-all-products?page=${page}&limit=${limit}`
    );

    // console.log("✅ API Response:", data); // 👈 Add this for debugging

    // Updated dispatch to send both products and totalPages
    dispatch({
      type: "fullAllProductsSuccess",
      payload: {
        products: data.products,
        totalPages: data.totalPages,
      },
    });
  } catch (error) {
    dispatch({
      type: "fullAllProductsFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Delete Product
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({ type: "deleteProductRequest" });

    const { data } = await axios.delete(`${server}/product/delete-product/${id}`, {
      withCredentials: true,
    });

    dispatch({
      type: "deleteProductSuccess",
      payload: data.message, // or data.product if your backend returns the deleted product
    });
  } catch (error) {
    dispatch({
      type: "deleteProductFailure",
      payload: error.response?.data?.message || error.message,
    });
  }
};
