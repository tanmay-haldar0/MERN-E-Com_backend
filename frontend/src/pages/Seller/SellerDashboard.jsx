import React from "react";
import { FaBoxOpen, FaClipboardList, FaChartLine, FaDollarSign } from "react-icons/fa";
import SideNav from "../../Components/SideNav.jsx";

const SellerDashboard = () => {
  // Dummy statistics (Replace with API data)
  const stats = [
    { title: "Total Revenue", value: "₹25,890", icon: <FaDollarSign className="text-green-500" />, color: "bg-green-100" },
    { title: "Total Orders", value: "1,024", icon: <FaClipboardList className="text-blue-500" />, color: "bg-blue-100" },
    { title: "Products Listed", value: "150", icon: <FaBoxOpen className="text-yellow-500" />, color: "bg-yellow-100" },
    { title: "Analytics Score", value: "88%", icon: <FaChartLine className="text-purple-500" />, color: "bg-purple-100" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <SideNav />

      {/* Main Content (Add margin-left to prevent overlap) */}
      <div className="flex-1 p-6 ml-64 mt-16">
        <h1 className="text-3xl font-bold text-gray-800">Seller Dashboard</h1>
        <p className="text-gray-600">Manage your store efficiently with real-time insights.</p>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mt-6">
          {stats.map((stat, index) => (
            <div key={index} className={`p-6 rounded-lg shadow-md ${stat.color} flex items-center`}>
              <div className="text-4xl">{stat.icon}</div>
              <div className="ml-4">
                <p className="text-lg font-semibold">{stat.value}</p>
                <p className="text-gray-700">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Orders & Products Section */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {/* Recent Orders */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
            <p className="text-gray-600">Track your latest transactions.</p>
            <ul className="mt-4">
              <li className="flex justify-between py-2 border-b text-gray-700">
                <span>Order #1234</span> <span className="text-green-500">Completed</span>
              </li>
              <li className="flex justify-between py-2 border-b text-gray-700">
                <span>Order #1235</span> <span className="text-yellow-500">Pending</span>
              </li>
              <li className="flex justify-between py-2 border-b text-gray-700">
                <span>Order #1236</span> <span className="text-red-500">Canceled</span>
              </li>
            </ul>
          </div>

          {/* Featured Products */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800">Top Products</h2>
            <p className="text-gray-600">Your best-selling products.</p>
            <ul className="mt-4">
              <li className="flex justify-between py-2 border-b text-gray-700">
                <span>Wireless Headphones</span> <span className="font-semibold">$99</span>
              </li>
              <li className="flex justify-between py-2 border-b text-gray-700">
                <span>Smartwatch Pro</span> <span className="font-semibold">$149</span>
              </li>
              <li className="flex justify-between py-2 border-b text-gray-700">
                <span>Gaming Mouse</span> <span className="font-semibold">$69</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
