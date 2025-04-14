import React from "react";
import { FaBoxOpen, FaUndo, FaTimesCircle, FaCheckCircle } from "react-icons/fa";

const dummyOrderHistory = [
  {
    id: "ORD123",
    productName: "Retro Graphic Tee",
    date: "2025-03-21",
    status: "Delivered",
    image: "https://via.placeholder.com/100",
  },
  {
    id: "ORD124",
    productName: "Grunge Skull Hoodie",
    date: "2025-03-22",
    status: "Returned",
    image: "https://via.placeholder.com/100",
  },
  {
    id: "ORD125",
    productName: "Floral Aesthetic Crop Top",
    date: "2025-03-23",
    status: "Failed",
    image: "https://via.placeholder.com/100",
  },
];

const statusStyles = {
  Delivered: "text-green-600 bg-green-100",
  Returned: "text-yellow-600 bg-yellow-100",
  Failed: "text-red-600 bg-red-100",
};

const statusIcons = {
  Delivered: <FaCheckCircle className="text-green-600" />,
  Returned: <FaUndo className="text-yellow-600" />,
  Failed: <FaTimesCircle className="text-red-600" />,
};

const OrderHistory = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Order History</h2>

      {dummyOrderHistory.length === 0 ? (
        <p className="text-gray-500 text-sm">You have no past order history.</p>
      ) : (
        <div className="space-y-4">
          {dummyOrderHistory.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-md shadow hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={order.image}
                  alt={order.productName}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div>
                  <p className="font-semibold text-gray-800">{order.productName}</p>
                  <p className="text-sm text-gray-500">Order ID: {order.id}</p>
                  <p className="text-sm text-gray-400">{order.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {statusIcons[order.status]}
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${statusStyles[order.status]}`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
