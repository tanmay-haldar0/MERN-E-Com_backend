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
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md space-y-6 w-[90vw] sm:w-full sm:max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800">Track Your Orders</h1>

      {/* Order List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700">Your Orders</h3>

        {/* Scrollable Orders Row */}
        <div className="overflow-x-auto">
          <div className="flex gap-3 sm:gap-4 py-2 min-w-full">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-all duration-300 flex-shrink-0 w-[65vw] sm:w-[300px]
            ${activeOrder?.orderId === order.orderId
                    ? "border-green-500 bg-green-50"
                    : "hover:bg-gray-100 border-gray-200"
                  }`}
                onClick={() => setActiveOrder(order)}
              >
                {/* Order ID & Status */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div className="text-sm font-semibold text-gray-800 truncate">{order.orderId}</div>
                  <div className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-0 whitespace-nowrap">
                    {order.status}
                  </div>
                </div>

                {/* Items */}
                <div className="mt-2 text-sm text-gray-600 space-y-1">
                  {order.items.map((item, index) => (
                    <p key={index} className="truncate">{item.name}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Order Details */}
      {activeOrder && (
        <div className="space-y-6 mt-6">
          <h3 className="font-semibold text-gray-700">Order Details</h3>

          {/* Progress Stepper */}
          <div className="flex items-start justify-between w-full gap-2 sm:gap-8 max-w-4xl mx-auto">
            {statusSteps.map((step, index) => {
              const currentIndex = getCurrentPhaseIndex(activeOrder.status);
              const isCompleted = index < currentIndex;
              const isCurrent = index === currentIndex;

              return (
                <div key={index} className="flex-1 flex flex-col items-center w-full sm:w-auto relative min-w-[60px]">
                  {/* Step Circle (fixed position) */}
                  <div
                    className={`z-10 w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2
          ${isCompleted
                        ? "bg-green-500 text-white border-green-500"
                        : isCurrent
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-gray-100 text-gray-400 border-gray-300"
                      }`}
                  >
                    <span className="text-xs sm:text-sm">{step.icon}</span>
                  </div>

                  {/* Step Label (does not affect circle position) */}
                  <div className="mt-2 w-[60px] text-center text-[9px] sm:text-sm leading-tight break-words">
                    {step.status}
                  </div>

                  {/* Line between steps */}
                  {index !== statusSteps.length - 1 && (
                    <div
                      className={`absolute top-3 sm:top-5 left-[5%] translate-x-1/2 h-1 w-full z-0
            ${index < currentIndex ? "bg-green-500" : "bg-gray-300"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>


          {/* Order Info */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-3 text-sm w-full">
            <p><strong>Order ID:</strong> {activeOrder.orderId}</p>
            <p><strong>Date:</strong> {activeOrder.date}</p>
            <p><strong>Shipping Address:</strong> {activeOrder.shippingAddress}</p>
            <p><strong>Expected Delivery Date:</strong> {activeOrder.deliveryDate}</p>
          </div>

          {/* Order Items */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-3 text-sm w-full">
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
