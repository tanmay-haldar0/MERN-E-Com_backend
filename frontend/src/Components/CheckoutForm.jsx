import React, { useState } from "react";

const CheckoutForm = ({ title, items, onPlaceOrder }) => {
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
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handleAddressChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const totalPrice = items.reduce(
    (acc, item) => acc + item.priceAtAddTime * item.quantity,
    0
  );

  const handleSubmit = async () => {
    const required = [
      "fullName",
      "phoneNumber",
      "addressLine1",
      "city",
      "postalCode",
      "country",
    ];

    for (let field of required) {
      if (!shippingAddress[field]) {
        alert("Please fill in all required shipping fields.");
        return;
      }
    }

    setIsPlacingOrder(true);
    await onPlaceOrder(shippingAddress, paymentMethod);
    setIsPlacingOrder(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">{title}</h2>

      {/* Item List */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white border border-gray-200 rounded-2xl shadow-md p-4"
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
                  <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                </div>
                <p className="text-green-600 font-bold text-lg">
                  ₹{item.priceAtAddTime * item.quantity}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Shipping */}
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

      {/* Payment */}
      <div className="mt-6 bg-white border border-gray-200 rounded-xl shadow p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">💳 Payment Method</h3>
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

      {/* Summary */}
      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 className="text-2xl font-bold text-gray-800">Total: ₹{totalPrice}</h3>
        <button
          onClick={handleSubmit}
          disabled={isPlacingOrder}
          className={`bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition font-semibold shadow ${
            isPlacingOrder ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isPlacingOrder ? "Placing Order..." : "✅ Confirm & Place Order"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutForm;
