import React, { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../server";
import { useSelector, useDispatch } from "react-redux";
import { clearCart, getCart } from "../redux/actions/cart";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const CheckoutConfirmationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { productId } = location.state || {};

  const [items, setItems] = useState([]);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const { cart } = useSelector((state) => state.cart);

  useEffect(() => {
    if (productId) {
      fetchSingleProduct(productId);
    } else {
      dispatch(getCart());
    }
  }, [productId, dispatch]);

  useEffect(() => {
    if (!productId && cart?.products?.length) {
      setItems(cart.products);
    }
  }, [cart, productId]);

  const fetchSingleProduct = async (id) => {
    setIsLoadingProduct(true);
    try {
      const { data } = await axios.get(`${server}/product/get-product/${id}`);
      const prod = data.product;
      console.log("prod name: ", prod);
      setItems([
        {
          _id: Date.now(),
          productId: prod, // ✅ don't wrap in an array
          quantity: 1,
          priceAtAddTime: prod.salePrice || prod.originalPrice,
        },
      ]);
      
      
    } catch (error) {
      alert("Failed to fetch product");
      navigate(-1);
    } finally {
      setIsLoadingProduct(false);
    }
  };

  const totalPrice = items.reduce(
    (acc, item) => acc + item.priceAtAddTime * item.quantity,
    0
  );

  const handleAddressChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    const requiredFields = [
      "fullName",
      "phoneNumber",
      "addressLine1",
      "city",
      "postalCode",
      "country",
    ];

    for (let field of requiredFields) {
      if (!shippingAddress[field]) {
        alert("Please fill in all required shipping fields.");
        return;
      }
    }

    setIsPlacingOrder(true);
    try {
      const requestBody = {
        shippingAddress,
        totalPrice,
        paymentInfo: { type: paymentMethod },
      };

      const { data } = await axios.post(
        `${server}/order/create-order`,
        requestBody,
        { withCredentials: true }
      );

      alert("Order placed successfully!");
      dispatch(clearCart());
      navigate("/shop");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to place order.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  useEffect(() => {
    if (items.length) {
      console.log("🛍️ Checkout Items:");
      items.forEach((item, index) => {
        console.log(`Item ${index + 1}:`);
        console.log("Name:", item.productId);
        console.log("Images:", item.productId?.images);
      });
    }
  }, [items]);
  

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto p-4"
    >
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        🛒 Confirm Your Order
      </h2>

      {/* Items */}
      {isLoadingProduct ? (
        <div className="text-center text-sm text-gray-500">
          Loading product...
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition p-4"
            >
              <img
                src={item.productId.images?.[0] || "/default.jpg"}
                alt={item.productId.name}
                className="w-28 h-24 object-cover rounded-md"
              />
              <div className="flex-1 w-full">
                <div className="flex justify-between items-center w-full">
                  <div>
                    <p className="font-semibold text-lg text-gray-800">
                      {item.productId.name}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-green-600 font-bold text-lg">
                    ₹{item.priceAtAddTime * item.quantity}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Shipping Address */}
      <div className="mt-8 bg-white border border-gray-200 rounded-xl shadow p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          🚚 Shipping Address
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            ["fullName", "Full Name *"],
            ["phoneNumber", "Phone Number *"],
            ["addressLine1", "Address Line 1 *"],
            ["addressLine2", "Address Line 2"],
            ["city", "City *"],
            ["state", "State"],
            ["postalCode", "Postal Code *"],
            ["country", "Country *"],
          ].map(([name, placeholder]) => (
            <input
              key={name}
              name={name}
              placeholder={placeholder}
              value={shippingAddress[name]}
              onChange={handleAddressChange}
              className="border border-gray-300 p-3 rounded-md w-full focus:ring-2 focus:ring-green-500"
            />
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="mt-6 bg-white border border-gray-200 rounded-xl shadow p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          💳 Payment Method
        </h3>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="border border-gray-300 p-3 rounded-md w-full focus:ring-2 focus:ring-green-500"
        >
          <option value="COD">Cash on Delivery</option>
          <option value="Card">Credit/Debit Card</option>
          <option value="UPI">UPI</option>
        </select>
      </div>

      {/* Summary + Button */}
      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 className="text-2xl font-bold text-gray-800">
          Total: ₹{totalPrice}
        </h3>
        <button
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder}
          className={`bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition font-semibold shadow ${
            isPlacingOrder ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isPlacingOrder ? "Placing Order..." : "✅ Confirm & Place Order"}
        </button>
      </div>
    </motion.div>
  );
};

export default CheckoutConfirmationPage;
