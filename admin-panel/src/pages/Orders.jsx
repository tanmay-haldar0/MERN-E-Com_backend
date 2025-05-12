import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { server } from "../server";

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${server}/order/admin-orders`, {
          withCredentials: true,
        });
        setOrders(data.orders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this order?")) {
      setOrders(orders.filter((order) => order.id !== id));
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-600";
      case "Pending":
        return "bg-yellow-100 text-yellow-600";
      case "Processing":
        return "bg-blue-400 text-white";
      case "Shipped":
        return "bg-blue-100 text-blue-600";
      case "Cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const SkeletonRow = () => (
    <tr className="animate-pulse bg-white">
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-6 bg-gray-300 rounded w-20"></div>
      </td>
      <td className="px-6 py-4 text-center space-x-4">
        <div className="h-4 w-4 inline-block bg-gray-300 rounded-full"></div>
        <div className="h-4 w-4 inline-block bg-gray-300 rounded-full"></div>
      </td>
    </tr>
  );

  return (
    <div className="pl-64 pr-8 py-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
        Order Management
      </h1>

      <input
        type="text"
        placeholder="🔍 Search orders by order ID, customer name, email, or vendor name..."
        className="w-full mb-6 px-5 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-gray-700 placeholder-gray-400"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <div className="w-full bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-blue-50 text-gray-700 text-left">
              <tr>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Vendor Name</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[...Array(5)].map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="w-full bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-blue-50 text-gray-700 text-left">
              <tr>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Vendor Name</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order, index) => (
                <tr
                  key={order.id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } transition hover:bg-blue-50`}
                >
                  <td className="px-6 py-4 text-gray-800 font-medium">
                    {order.orderId}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div>{order.customerName}</div>
                    <div className="text-xs text-gray-500">
                      {order.customerEmail}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {order.vendorName}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{order.amount}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full font-semibold text-xs ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center space-x-4">
                    <button
                      className="text-blue-500 hover:text-blue-700 transition transform hover:scale-110"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="text-red-500 hover:text-red-700 transition transform hover:scale-110"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-6 text-center text-gray-500 italic"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
