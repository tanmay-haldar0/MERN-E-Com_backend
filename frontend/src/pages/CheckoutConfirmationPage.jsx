import React, { useState } from "react";

const CheckoutConfirmationPage = () => {
  const [items] = useState([
    { _id: "1", name: "Sample Product 1", salePrice: 499, qty: 2 },
    { _id: "2", name: "Sample Product 2", salePrice: 299, qty: 1 },
  ]);

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [shippingAddress, setShippingAddress] = useState({
    street: "123 Lane",
    city: "Kolkata",
    pincode: "700001",
    country: "India",
  });

  const totalPrice = items.reduce((acc, item) => acc + item.salePrice * item.qty, 0);

  const handleAddressChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Confirm Your Order</h2>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item._id}
            className="border p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p>Qty: {item.qty}</p>
            </div>
            <p>₹{item.salePrice * item.qty}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 border p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Shipping Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            name="street"
            placeholder="Street"
            value={shippingAddress.street}
            onChange={handleAddressChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={shippingAddress.city}
            onChange={handleAddressChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={shippingAddress.pincode}
            onChange={handleAddressChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={shippingAddress.country}
            onChange={handleAddressChange}
            className="border p-2 rounded"
          />
        </div>
      </div>

      <div className="mt-4 border p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Payment Method</h3>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="COD">Cash on Delivery</option>
          <option value="Online">Online Payment</option>
        </select>
      </div>

      <div className="flex justify-between items-center mt-6">
        <h3 className="text-lg font-bold">Total: ₹{totalPrice}</h3>
        <button
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Confirm & Place Order
        </button>
      </div>
    </div>
  );
};

export default CheckoutConfirmationPage;
