import React, { useState } from "react";
import { FaBox, FaTruck, FaCheckCircle } from "react-icons/fa";

const TrackOrder = () => {
  const orders = [
    {
      orderId: "ORD123456",
      date: "2025-04-12",
      shippingAddress: "1234 Elm Street, Springfield, IL",
      deliveryDate: "2025-04-20",
      status: "Shipped",
      items: [
        { name: "Custom T-shirt", quantity: 2, price: 20 },
        { name: "Personalized Mug", quantity: 1, price: 15 },
      ],
    },
    {
      orderId: "ORD789012",
      date: "2025-04-13",
      shippingAddress: "4567 Maple Avenue, Springfield, IL",
      deliveryDate: "2025-04-22",
      status: "Out for Delivery",
      items: [
        { name: "Laptop Sleeve", quantity: 1, price: 25 },
        { name: "Wireless Mouse", quantity: 1, price: 30 },
      ],
    },
  ];

  const [activeOrder, setActiveOrder] = useState(null);

  const statusSteps = [
    { status: "Ordered", icon: <FaBox /> },
    { status: "Shipped", icon: <FaTruck /> },
    { status: "Out for Delivery", icon: <FaTruck /> },
    { status: "Delivered", icon: <FaCheckCircle /> },
  ];

  const getCurrentPhaseIndex = (status) => {
    switch (status) {
      case "Shipped":
        return 1;
      case "Out for Delivery":
        return 2;
      case "Delivered":
        return 3;
      default:
        return 0;
    }
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Track Your Orders</h1>

      {/* Order List */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700">Your Orders</h3>
        <div className="flex space-x-4 overflow-x-auto py-2">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 flex-shrink-0 w-64
              ${activeOrder?.orderId === order.orderId
                  ? "border-green-500 bg-green-50"
                  : "hover:bg-gray-100 border-gray-200"
                }`}
              onClick={() => setActiveOrder(order)}
            >
              <div className="flex justify-between items-center">
                <div className="text-sm font-semibold text-gray-800">{order.orderId}</div>
                <div className="text-sm text-gray-500">{order.status}</div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {order.items.map((item, index) => (
                  <p key={index}>{item.name}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Details */}
      {activeOrder && (
        <div className="space-y-6 mt-6">
          <h3 className="font-semibold text-gray-700">Order Details</h3>

          {/* Progress Stepper */}
          <div className="relative flex items-center justify-between w-full max-w-3xl mx-auto">
            {statusSteps.map((step, index) => {
              const currentIndex = getCurrentPhaseIndex(activeOrder.status);
              const isCompleted = index < currentIndex;
              const isCurrent = index === currentIndex;

              return (
                <div key={index} className="flex-1 flex flex-col items-center relative">
                  {/* Line between steps */}
                  {index !== 0 && (
                    <div className="absolute -left-1/2 top-4 w-full h-1 bg-gray-300 z-0">
                      <div
                        className={`h-full transition-all ${index <= currentIndex ? "bg-green-500" : "bg-gray-300"
                          }`}
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                  )}

                  {/* Step circle */}
                  <div
                    className={`z-10 w-10 h-10 rounded-full flex items-center justify-center border-2
                    ${isCompleted ? "bg-green-500 text-white border-green-500"
                        : isCurrent
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-gray-100 text-gray-400 border-gray-300"
                      }`}
                  >
                    {step.icon}
                  </div>
                  <span className="mt-2 text-sm text-center">{step.status}</span>
                </div>
              );
            })}
          </div>

          {/* Order Info */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-3">
            <p><strong>Order ID:</strong> {activeOrder.orderId}</p>
            <p><strong>Date:</strong> {activeOrder.date}</p>
            <p><strong>Shipping Address:</strong> {activeOrder.shippingAddress}</p>
            <p><strong>Expected Delivery Date:</strong> {activeOrder.deliveryDate}</p>
          </div>

          {/* Order Items */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-3">
            <h4 className="text-lg font-semibold text-gray-700">Items</h4>
            <ul className="space-y-2">
              {activeOrder.items.map((item, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>${item.price * item.quantity}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 font-semibold">
              Total: ${calculateTotal(activeOrder.items)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
