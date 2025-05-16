import React, { useState } from "react";
import { FaStripeS, FaCcVisa, FaPaypal } from "react-icons/fa"; // Replace with actual logos
import { toast } from "react-toastify";

const CheckoutForm = ({ title, items, onPlaceOrder }) => {
  const [shippingAddress, setShippingAddress] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [newAddress, setNewAddress] = useState(false);

  const userAddresses = [
    {
      fullName: "John Doe",
      phoneNumber: "9876543210",
      addressLine1: "1234 Elm Street",
      addressLine2: "Apt 56B",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "USA",
    },
  ];

  const handleAddressChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // Check if required address fields are filled
    const requiredFields = [
      "fullName",
      "phoneNumber",
      "addressLine1",
      "city",
      "postalCode",
      "country",
    ];
    const isAddressComplete = requiredFields.every(
      (field) => shippingAddress[field]
    );

    if (!isAddressComplete) {
      toast.error("Please select or enter a complete shipping address.");
      return;
    }

    // Default to "COD" if payment method is somehow unset
    const finalPaymentMethod = paymentMethod || "Card";
    console.log(finalPaymentMethod);

    setIsPlacingOrder(true);
    await onPlaceOrder(shippingAddress, finalPaymentMethod);
    setIsPlacingOrder(false);
  };

  const totalPrice = items.reduce(
    (acc, item) => acc + item.priceAtAddTime * item.quantity,
    0
  );

  return (
    <div className="max-w-5xl mx-auto p-4 mt-16">
      <h2 className="sm:text-3xl text-xl font-bold text-center mb-4 text-gray-800">
        {title}
      </h2>
      {/* Item List */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl shadow-sm p-3"
          >
            <img
              src={item.productId.images?.[0] || "/default.jpg"}
              alt={item.productId.name}
              className="w-20 h-20 object-cover rounded-md"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-gray-800 truncate">
                {item.productId.name}
              </p>
              <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="text-green-600 font-semibold text-sm whitespace-nowrap">
                ₹{item.priceAtAddTime * item.quantity}
              </p>
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
          {userAddresses.map((address, index) => (
            <div
              key={index}
              onClick={() => setShippingAddress(address)}
              className={`cursor-pointer p-4 rounded-lg border ${
                shippingAddress.addressLine1 === address.addressLine1
                  ? "bg-green-100 border-green-500"
                  : "border-gray-300"
              }`}
            >
              <p className="font-semibold">{address.fullName}</p>
              <p className="text-sm">{address.addressLine1}</p>
              <p className="text-sm">{address.addressLine2}</p>
              <p className="text-sm">{address.phoneNumber}</p>
              <p className="text-sm">
                {address.city}, {address.state}, {address.country}
              </p>
            </div>
          ))}
          <div
            onClick={() => setNewAddress(!newAddress)}
            className="cursor-pointer flex justify-center items-center p-4 rounded-lg border border-gray-300 bg-gray-50"
          >
            <p className="text-center text-gray-600">+ Add New Address</p>
          </div>
        </div>

        {/* New Address Form */}
        {newAddress && (
          <div className="mt-4">
            <input
              name="fullName"
              placeholder="Full Name *"
              onChange={handleAddressChange}
              className="w-full p-3 border border-gray-300 rounded-md mb-4"
            />
            <input
              name="phoneNumber"
              placeholder="Phone Number *"
              onChange={handleAddressChange}
              className="w-full p-3 border border-gray-300 rounded-md mb-4"
            />
            <input
              name="addressLine1"
              placeholder="Address Line 1 *"
              onChange={handleAddressChange}
              className="w-full p-3 border border-gray-300 rounded-md mb-4"
            />
            <input
              name="addressLine2"
              placeholder="Address Line 2"
              onChange={handleAddressChange}
              className="w-full p-3 border border-gray-300 rounded-md mb-4"
            />
            <input
              name="city"
              placeholder="City *"
              onChange={handleAddressChange}
              className="w-full p-3 border border-gray-300 rounded-md mb-4"
            />
            <input
              name="state"
              placeholder="State"
              onChange={handleAddressChange}
              className="w-full p-3 border border-gray-300 rounded-md mb-4"
            />
            <input
              name="postalCode"
              placeholder="Postal Code *"
              onChange={handleAddressChange}
              className="w-full p-3 border border-gray-300 rounded-md mb-4"
            />
            <input
              name="country"
              placeholder="Country *"
              onChange={handleAddressChange}
              className="w-full p-3 border border-gray-300 rounded-md mb-4"
            />
          </div>
        )}
      </div>
      {/* Payment */}
      <div className="mt-6 bg-white border border-gray-200 rounded-xl shadow p-6">
        <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-800">
          💳 Choose a Payment Method
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Card",
              icon: <FaCcVisa className="text-2xl sm:text-3xl" />,
            },
            {
              label: "Razorpay",
              icon: <FaStripeS className="text-2xl sm:text-3xl" />,
            },
            {
              label: "Paytm",
              icon: <FaPaypal className="text-2xl sm:text-3xl" />,
            },
          ].map((method) => (
            <div
              key={method.label}
              onClick={() => setPaymentMethod(method.label)}
              className={`group cursor-pointer p-3 sm:p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-all duration-200 shadow-sm hover:shadow-md hover:border-green-400 ${
                paymentMethod === method.label
                  ? "bg-green-100 border-green-500"
                  : "bg-white border-gray-300"
              }`}
            >
              <div className="mb-1">{method.icon}</div>
              <p className="text-sm sm:text-base font-medium text-gray-700 group-hover:text-green-600">
                {method.label}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Summary */}
      <div className="h-24" />{" "}
      {/* Spacer so content doesn't get hidden by fixed button */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md z-50 p-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
            Total: ₹{totalPrice}
          </h3>
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
    </div>
  );
};

export default CheckoutForm;
