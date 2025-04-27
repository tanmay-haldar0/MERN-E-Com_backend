import React, { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../server";

const CheckoutConfirmationPage = ({ productToBuy = null }) => {
  const [items, setItems] = useState([]);
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

  useEffect(() => {
    if (productToBuy) {
      setItems([{ ...productToBuy, qty: 1 }]);
    } else {
      // Later we will fetch cart from backend, for now dummy
      setItems([
        { _id: "1", name: "Sample Product 1", salePrice: 499, qty: 2 },
        { _id: "2", name: "Sample Product 2", salePrice: 1, qty: 1 },
      ]);
    }
  }, [productToBuy]);

  const totalPrice = items.reduce((acc, item) => acc + item.salePrice * item.qty, 0);

  const handleAddressChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress.fullName || !shippingAddress.phoneNumber || !shippingAddress.addressLine1 || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
      alert("Please fill in all required shipping fields.");
      return;
    }

    setIsPlacingOrder(true);
    try {
      const requestBody = {
        shippingAddress,
        totalPrice,
        paymentInfo: {
          type: paymentMethod,
        },
      };

      const { data } = await axios.post(`${server}/order/create-order`, requestBody, {
        withCredentials: true,
      });

      console.log("Order Response:", data);
      alert("Order placed successfully!");
      // Redirect or clear cart logic here
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to place order.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Confirm Your Order</h2>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item._id} className="border p-4 rounded-lg shadow flex justify-between items-center">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-600">Qty: {item.qty}</p>
            </div>
            <p className="font-semibold text-green-700">₹{item.salePrice * item.qty}</p>
          </div>
        ))}
      </div>

      {/* Shipping Address */}
      <div className="mt-6 border p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="fullName" placeholder="Full Name *" value={shippingAddress.fullName} onChange={handleAddressChange} className="border p-2 rounded w-full" />
          <input name="phoneNumber" placeholder="Phone Number *" value={shippingAddress.phoneNumber} onChange={handleAddressChange} className="border p-2 rounded w-full" />
          <input name="addressLine1" placeholder="Address Line 1 *" value={shippingAddress.addressLine1} onChange={handleAddressChange} className="border p-2 rounded w-full" />
          <input name="addressLine2" placeholder="Address Line 2" value={shippingAddress.addressLine2} onChange={handleAddressChange} className="border p-2 rounded w-full" />
          <input name="city" placeholder="City *" value={shippingAddress.city} onChange={handleAddressChange} className="border p-2 rounded w-full" />
          <input name="state" placeholder="State" value={shippingAddress.state} onChange={handleAddressChange} className="border p-2 rounded w-full" />
          <input name="postalCode" placeholder="Postal Code *" value={shippingAddress.postalCode} onChange={handleAddressChange} className="border p-2 rounded w-full" />
          <input name="country" placeholder="Country *" value={shippingAddress.country} onChange={handleAddressChange} className="border p-2 rounded w-full" />
        </div>
      </div>

      {/* Payment Method */}
      <div className="mt-6 border p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="COD">Cash on Delivery</option>
          <option value="Card">Card</option>
          <option value="UPI">UPI</option>
        </select>
      </div>

      {/* Total & Place Order */}
      <div className="flex justify-between items-center mt-8">
        <h3 className="text-xl font-bold">Total: ₹{totalPrice}</h3>
        <button
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder}
          className={`bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition ${
            isPlacingOrder ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isPlacingOrder ? "Placing Order..." : "Confirm & Place Order"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutConfirmationPage;
