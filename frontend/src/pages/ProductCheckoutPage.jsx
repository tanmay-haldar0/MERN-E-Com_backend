import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../server";
import CheckoutForm from "../Components/CheckoutForm";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";

// Load Stripe outside to prevent recreation on every render
const stripePromise = loadStripe('pk_test_51RIUVKIHTS4RdlhsPJiLRQttFAb22bEmk4Wyb3X3pdpfQYdgToqIEdEjmbPUECI7CJsc2RS4ieszm55bNgaGX06X00Bd8le8b9');


const ProductCheckoutPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  
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
    const totalPrice = items.reduce(
      (acc, item) => acc + item.priceAtAddTime * item.quantity,
      0
    );

    if (paymentMethod === "Card") {
      setLoading(true);
      try {
        const stripe = await stripePromise;
        const { data } = await axios.post(
          `${server}/payment/create-checkout-session`,
          { shippingAddress },
          { withCredentials: true }
        );
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      } catch (err) {
        console.error(err);
        alert("Stripe checkout failed.");
        setLoading(false);
      }

    } else {
      // Handle Cash on Delivery or other method
      try {
        const { data } = await axios.post(
          `${server}/order/create-order`,
          {
            shippingAddress,
            totalPrice,
            paymentInfo: { type: paymentMethod },
          },
          { withCredentials: true }
        );

        alert("Order placed successfully!");
        dispatch(clearCart());
        navigate("/shop");
      } catch (error) {
        alert(error.response?.data?.message || "Failed to place order.");
      }
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
