import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../server";
import CheckoutForm from "../components/CheckoutForm";
import { toast } from "react-toastify";

const ProductCheckoutPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!productId) return navigate(-1);

    const fetchProduct = async () => {
    //   console.log("Product ID from URL:", productId);
      try {
        const { data } = await axios.get(`${server}/product/get-product/${productId}`);
        // console.log("Fetched product:", data.product);

        const prod = Array.isArray(data.product) ? data.product[0] : data.product;

        if (!prod) {
          toast.error("Product not found");
          return navigate(-1);
        }

        setItems([
          {
            _id: Date.now(),
            productId: prod,
            quantity: 1,
            priceAtAddTime: prod.salePrice || prod.originalPrice,
          },
        ]);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Product not found");
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, navigate]);

  const handlePlaceOrder = async (shippingAddress, paymentMethod) => {
    const totalPrice = items[0]?.priceAtAddTime;
    // console.log(productId);

    try {
      await axios.post(
        `${server}/order/create-order/${productId}`,
        {
          shippingAddress,
          totalPrice,
          paymentInfo: { type: paymentMethod },
          quantity: 1,
        },
        { withCredentials: true }
      );

      toast.success("Order placed successfully!");
      navigate("/shop");
    } catch (error) {
      console.error("Order error:", error);
      alert(error.response?.data?.message || "Failed to place order.");
    }
  };

  return isLoading ? (
    <div className="text-center text-gray-500 mt-10">Loading product...</div>
  ) : (
    <CheckoutForm
      title="🛍️ Confirm Your Purchase"
      items={items}
      onPlaceOrder={handlePlaceOrder}
    />
  );
};

export default ProductCheckoutPage;
