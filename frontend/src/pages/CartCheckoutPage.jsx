import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart } from "../redux/actions/cart";
import axios from "axios";
import { server } from "../server";
import { useNavigate } from "react-router-dom";
import CheckoutForm from "../components/CheckoutForm";

const CartCheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const [items, setItems] = useState([]);

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
