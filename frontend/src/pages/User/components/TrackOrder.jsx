import React, { useState, useEffect } from "react";
import { FaBox, FaTruck, FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { server } from "../../../server";

const TrackOrder = () => {
  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const statusSteps = [
    { status: "Ordered", icon: <FaBox /> },
    { status: "Shipped", icon: <FaTruck /> },
    { status: "Out for Delivery", icon: <FaTruck /> },
    { status: "Delivered", icon: <FaCheckCircle /> },
  ];

  const getCurrentPhaseIndex = (status) => {
    switch (status) {
      case "Shipped": return 1;
      case "Out for Delivery": return 2;
      case "Delivered": return 3;
      default: return 0;
    }
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${server}/order/user-orders`, { withCredentials: true });
        setOrders(res.data.orders);
        if (res.data.orders.length > 0) {
          setActiveOrder(res.data.orders[0]);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="text-center mt-8 text-gray-500">Loading your orders...</p>;

  if (!loading && orders.length === 0) {
    return (
      <div className="text-center mt-12 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700">No orders found</h2>
        <p className="text-gray-500">Looks like you haven't placed any orders yet.</p>
        <Link
          to="/shop"
          className="inline-block px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md space-y-6 w-[90vw] sm:w-full sm:max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800">Track Your Orders</h1>

      {/* Orders List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700">Your Orders</h3>

        <div className="overflow-x-auto">
          <div className="flex gap-3 sm:gap-4 py-2 min-w-full">
            {orders.map((order) => (
              <div
                key={order._id}
                className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-all duration-300 flex-shrink-0 w-[65vw] sm:w-[300px]
                ${activeOrder?._id === order._id
                    ? "border-green-500 bg-green-50"
                    : "hover:bg-gray-100 border-gray-200"
                  }`}
                onClick={() => setActiveOrder(order)}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div className="text-sm font-semibold text-gray-800 truncate">{order._id}</div>
                  <div className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-0 whitespace-nowrap">
                    {order.status}
                  </div>
                </div>

                <div className="mt-2 text-sm text-gray-600 space-y-1">
                  {order.cart.map((item, index) => (
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

          {/* Stepper */}
          <div className="flex items-start justify-between w-full gap-2 sm:gap-8 max-w-4xl mx-auto">
            {statusSteps.map((step, index) => {
              const currentIndex = getCurrentPhaseIndex(activeOrder.status);
              const isCompleted = index < currentIndex;
              const isCurrent = index === currentIndex;

              return (
                <div key={index} className="flex-1 flex flex-col items-center w-full sm:w-auto relative min-w-[60px]">
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
                  <div className="mt-2 w-[60px] text-center text-[9px] sm:text-sm leading-tight break-words">
                    {step.status}
                  </div>
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
            <p><strong>Order ID:</strong> {activeOrder._id}</p>
            <p><strong>Date:</strong> {new Date(activeOrder.createdAt).toLocaleDateString()}</p>
            <p><strong>Shipping Address:</strong> {activeOrder.shippingAddress}</p>
            <p><strong>Expected Delivery:</strong> {activeOrder.deliveryDate || "N/A"}</p>
          </div>

          {/* Items List */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-3 text-sm w-full">
            <h4 className="text-lg font-semibold text-gray-700">Items</h4>
            <ul className="space-y-2">
              {activeOrder.cart.map((item, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>${item.price * item.quantity}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 font-semibold">
              Total: ${calculateTotal(activeOrder.cart)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
