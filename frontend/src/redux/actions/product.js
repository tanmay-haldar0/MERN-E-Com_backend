import axios from "axios";
import { server } from "../../server.js";

// Create Product
export const createProduct = (newForm) => async (dispatch) => {
  try {
    dispatch({ type: "productCreateRequest" });

    const config = {
      headers: { "Content-Type": "multipart/form-data" },
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


// get all Products

export const getAllProducts = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllProductsRequest",
    });
 
    // Updated URL with the correct path
    const { data } = await axios.get(`${server}/product/get-seller-all-products/${id}`);

    dispatch({
      type: "getAllProductsSuccess",
      payload: data.products,
    });
    // console.log(data);
  } catch (error) {
    dispatch({
      type: "getAllProductsFailed", // ✅ fixed spelling here
      payload: error.response?.data?.message || error.message,
    });
  }
};
