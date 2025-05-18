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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${server}/order/user-orders`, {
          withCredentials: true,
        });
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

  // Skeleton Loader
  if (loading)
    return (
      <div className="space-y-4 w-[90vw] sm:w-full sm:max-w-6xl mx-auto p-4 sm:p-6">
        <div className="h-6 w-1/3 bg-gray-300 animate-pulse rounded"></div>
        <div className="flex gap-3 overflow-x-auto">
          {Array(3).fill(0).map((_, i) => (
            <div
              key={i}
              className="p-3 sm:p-4 border rounded-lg w-[190px] sm:w-[300px] h-[120px] animate-pulse bg-gray-200"
            ></div>
          ))}
        </div>
        <div className="space-y-6 mt-6">
          <div className="h-6 w-1/4 bg-gray-300 animate-pulse rounded"></div>
          <div className="flex justify-between gap-2 sm:gap-8">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="flex-1 flex flex-col items-center relative min-w-[60px]">
                <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse" />
                <div className="mt-2 h-3 w-10 bg-gray-300 rounded animate-pulse" />
                {i !== 3 && (
                  <div className="absolute top-5 left-[5%] translate-x-1/2 h-1 w-full bg-gray-300" />
                )}
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
          </div>
          <div className="space-y-3">
            <div className="h-5 bg-gray-300 rounded w-1/4 animate-pulse" />
            {Array(2).fill(0).map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="w-12 h-12 bg-gray-300 rounded animate-pulse" />
                  <div className="h-4 bg-gray-300 w-32 rounded animate-pulse" />
                </div>
                <div className="h-4 bg-gray-300 w-12 rounded animate-pulse" />
              </div>
            ))}
            <div className="h-5 w-20 bg-gray-300 rounded ml-auto animate-pulse" />
          </div>
        </div>
      </div>
    );

  if (!loading && orders.length === 0) {
    return (
      <div className="text-center mt-12 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700">No orders found</h2>
        <p className="text-gray-500">
          Looks like you haven't placed any orders yet.
        </p>
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
                className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-all duration-300 flex-shrink-0 w-[190px] sm:w-[300px] h-[120px] flex flex-col justify-between
  ${
    activeOrder?._id === order._id
      ? "border-green-500 bg-green-50"
      : "hover:bg-gray-100 border-gray-400"
  }`}
                onClick={() => setActiveOrder(order)}
              >
                <div className="text-sm font-semibold text-gray-800 truncate space-y-1">
                  {order.cart.slice(0, 2).map((item, index) => (
                    <p
                      key={index}
                      className="text-[12px] sm:text-sm font-medium break-words leading-snug max-w-[160px] sm:max-w-none"
                    >
                      {item.productId?.name} ({item?.quantity})
                    </p>
                  ))}
                  {order.cart.length > 2 && (
                    <p className="text-gray-500 text-xs">+etc.</p>
                  )}
                </div>

                <div className="mt-1 text-sm text-primary space-y-1">
                  {order.status}
                </div>

                <div className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-0 whitespace-nowrap">
                  {new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })}
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
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center w-full sm:w-auto relative min-w-[60px]"
                >
                  <div
                    className={`z-10 w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2
                    ${
                      isCompleted
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

          {/* Shipping Info */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-3 text-sm w-full">
            <p>
              <strong>Order ID:</strong> {activeOrder._id}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(activeOrder.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })}
            </p>
            <div className="text-sm text-gray-700 leading-snug">
              <p>
                <strong>{activeOrder.shippingAddress.fullName}</strong>
              </p>
              <p>{activeOrder.shippingAddress.phoneNumber}</p>
              <p>{activeOrder.shippingAddress.addressLine1}</p>
              <p>{activeOrder.shippingAddress.addressLine2}</p>
              <p>
                {activeOrder.shippingAddress.city},{" "}
                {activeOrder.shippingAddress.state} -{" "}
                {activeOrder.shippingAddress.postalCode}
              </p>
              <p>{activeOrder.shippingAddress.country}</p>
            </div>
            <p>
              <strong>Expected Delivery:</strong>{" "}
              {activeOrder.deliveryDate || "N/A"}
            </p>
          </div>

          {/* Items */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-3 text-sm w-full">
            <h4 className="text-lg font-semibold text-gray-700">Items</h4>
            <ul className="space-y-2">
              {activeOrder.cart.map((item, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-start sm:items-center gap-2 sm:gap-4"
                >
                  <div className="flex">
                    <img
                      src={item.productId?.images[0]}
                      alt=""
                      className="w-12 sm:w-16 h-12 sm:h-16 object-cover rounded-md"
                    />
                    <p className="ml-2 sm:ml-4 text-sm font-semibold break-words leading-snug max-w-[160px] sm:max-w-none">
                      {item.productId?.name} (x {item.quantity})
                    </p>
                  </div>
                  <span className="text-base sm:text-lg font-semibold whitespace-nowrap">
                    ₹ {item.price * item.quantity}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 font-semibold text-lg text-right">
              Total: ₹ {calculateTotal(activeOrder.cart)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
