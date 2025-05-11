import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart } from "../redux/actions/cart";
import axios from "axios";
import { server } from "../server";
import { useNavigate } from "react-router-dom";
import CheckoutForm from "../Components/CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";

// Load Stripe outside to prevent recreation on every render
const stripePromise = loadStripe('pk_test_51RIUVKIHTS4RdlhsPJiLRQttFAb22bEmk4Wyb3X3pdpfQYdgToqIEdEjmbPUECI7CJsc2RS4ieszm55bNgaGX06X00Bd8le8b9');

const CartCheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  useEffect(() => {
    if (cart?.products?.length) {
      setItems(cart.products);
    }
  }, [cart]);

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

  return (
    <CheckoutForm
      title="🛒 Confirm Your Cart Order"
      items={items}
      onPlaceOrder={handlePlaceOrder}
    />
  );
};

export default CartCheckoutPage;
