import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../server";
import CheckoutForm from "../Components/CheckoutForm";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";

// Load Stripe outside to prevent recreation on every render
const stripePromise = loadStripe(
  "pk_test_51RIUVKIHTS4RdlhsPJiLRQttFAb22bEmk4Wyb3X3pdpfQYdgToqIEdEjmbPUECI7CJsc2RS4ieszm55bNgaGX06X00Bd8le8b9"
);

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
        const { data } = await axios.get(
          `${server}/product/get-product/${productId}`
        );
        // console.log("Fetched product:", data.product);

        const prod = Array.isArray(data.product)
          ? data.product[0]
          : data.product;

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
      // Stripe flow
      setLoading(true);
      try {
        const stripe = await stripePromise;
        const { data } = await axios.post(
          `${server}/payment/create-checkout-session/buynow/${productId}`,
          { shippingAddress },
          { withCredentials: true }
        );
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      } catch (err) {
        console.error(err);
        alert("Stripe checkout failed.");
        setLoading(false);
      }
    } else if (paymentMethod === "Razorpay") {
      // Razorpay flow
      try {
        const { data } = await axios.post(
          `${server}/payment/razorpay-payment/buynow/${productId}`,
          {
            productId,
            quantity: items[0].quantity,
            shippingAddress,
          },
          { withCredentials: true }
        );

        const options = {
          key: "rzp_test_NbLA8G39wddNT4", // replace with your actual Razorpay key
          amount: data.amount,
          currency: "INR",
          name: "Classicustom",
          description: "Product Purchase",
          image: "https://classiccustom.com/logo.png", // optional
          order_id: data.orderId,
          handler: function (response) {
            const {
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
            } = response;

            toast.success("Payment successful!");

            // Redirect with query parameters
            navigate(
              `/payment/rzp/success?razorpay_order_id=${razorpay_order_id}&razorpay_payment_id=${razorpay_payment_id}&razorpay_signature=${razorpay_signature}`
            );
          },
          prefill: {
            name: data.user?.name || "Guest",
            email: data.user?.email || "guest@example.com",
          },

          theme: {
            color: "#3399cc",
          },
        };

        const razorpay = new window.Razorpay(options);

        razorpay.on("payment.failed", function (response) {
          toast.error("Payment failed: " + response.error.description);
        });

        razorpay.open();
      } catch (error) {
        console.error(error);
        toast.error("Razorpay payment failed");
      }
    } else {
      // Cash on Delivery or other method
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

        toast.success("Order placed successfully!");
        dispatch(clearCart());
        navigate("/shop");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to place order.");
      }
    }
  };

  return isLoading ? (
    <div className="max-w-5xl mx-auto p-4">
      <div className="animate-pulse space-y-6">
        {/* Title */}
        <div className="h-8 w-1/3 bg-gray-300 rounded"></div>

        {/* Product Card */}
        <div className="flex gap-4 bg-white p-4 border border-gray-200 rounded-xl shadow">
          <div className="w-28 h-24 bg-gray-300 rounded-md"></div>
          <div className="flex-1 space-y-2">
            <div className="h-5 w-3/4 bg-gray-300 rounded"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Address section */}
        <div className="space-y-4">
          <div className="h-6 w-1/4 bg-gray-300 rounded"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(2)].map((_, idx) => (
              <div key={idx} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>

        {/* Payment section */}
        <div className="space-y-4">
          <div className="h-6 w-1/4 bg-gray-300 rounded"></div>
          <div className="flex gap-4">
            {[...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className="w-full h-20 bg-gray-200 rounded-lg"
              ></div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="flex justify-between items-center mt-8">
          <div className="h-6 w-32 bg-gray-300 rounded"></div>
          <div className="h-10 w-40 bg-green-300 rounded-lg"></div>
        </div>
      </div>
    </div>
  ) : (
    <CheckoutForm
      title="🛍️ Confirm Your Purchase"
      items={items}
      onPlaceOrder={handlePlaceOrder}
    />
  );
};

export default ProductCheckoutPage;
