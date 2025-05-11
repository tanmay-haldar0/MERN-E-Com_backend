import { FaUsers, FaStore, FaShoppingCart, FaRupeeSign } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const stats = [
  { label: "Total Users", value: 1280, icon: <FaUsers className="text-3xl text-blue-600" />, change: "+8%" },
  { label: "Vendors", value: 230, icon: <FaStore className="text-3xl text-green-600" />, change: "-3%" },
  { label: "Orders", value: 5420, icon: <FaShoppingCart className="text-3xl text-yellow-600" />, change: "+12%" },
  { label: "Revenue", value: "98,000", icon: <FaRupeeSign className="text-3xl text-purple-600" />, change: "+15%" },
];

const revenueData = [
  { month: "Jan", revenue: 10000 },
  { month: "Feb", revenue: 12000 },
  { month: "Mar", revenue: 15000 },
  { month: "Apr", revenue: 18000 },
  { month: "May", revenue: 22000 },
];

const Statistics = () => {
  return (
    <div className="pl-64 pr-8 py-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">Statistics Overview</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex items-center space-x-4 hover:shadow-lg transition-shadow duration-300 relative"
          >
            <div className="p-4 bg-gray-100 rounded-full">
              {stat.icon}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-700">{stat.label}</h2>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.change}</p>
            </div>

            {/* Hover Popup */}
            <div className="absolute top-0 right-0 mt-4 mr-4 p-4 bg-gray-900 text-white rounded-lg opacity-0 transition-opacity duration-300 hover:opacity-100">
              <p className="font-semibold">{stat.label} Insights</p>
              <p className="text-xs">{stat.label} has changed by {stat.change} in the last month.</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Revenue Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <XAxis dataKey="month" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Statistics;
