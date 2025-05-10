import React from "react";
import {
  FaUser,
  FaStore,
  FaDollarSign,
  FaCog,
  FaClipboardList,
  FaMoneyCheckAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const statCards = [
  {
    title: "Users",
    value: "1,245",
    icon: <FaUser className="text-white" size={22} />,
    color: "from-blue-400 to-blue-600",
  },
  {
    title: "Vendors",
    value: "134",
    icon: <FaStore className="text-white" size={22} />,
    color: "from-purple-400 to-purple-600",
  },
  {
    title: "Revenue",
    value: "$54,230",
    icon: <FaDollarSign className="text-white" size={22} />,
    color: "from-green-400 to-green-600",
  },
];

const Dashboard = () => {
  return (
    <div className="p-6 pl-64 bg-gray-50 min-h-screen space-y-10">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Welcome Back, Admin</h1>
        <p className="text-gray-500 text-sm">Here's what's happening today</p>
      </header>

      {/* Stat Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between p-5 rounded-xl bg-gradient-to-r ${card.color} shadow-md`}
          >
            <div>
              <h3 className="text-white text-sm font-medium mb-1">{card.title}</h3>
              <p className="text-white text-2xl font-bold">{card.value}</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-full p-3">{card.icon}</div>
          </div>
        ))}
      </section>

      {/* Action Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <ActionCard title="Manage Users" icon={<FaUser size={20} />} to="/users" color="bg-blue-50" />
        <ActionCard title="Vendor Panel" icon={<FaStore size={20} />} to="/vendors" color="bg-purple-50" />
        <ActionCard title="All Orders" icon={<FaClipboardList size={20} />} to="/orders" color="bg-indigo-50" />
        <ActionCard title="Payments" icon={<FaMoneyCheckAlt size={20} />} to="/payments" color="bg-teal-50" />
        <ActionCard title="Theme Settings" icon={<FaCog size={20} />} to="/themes" color="bg-gray-100" />
        <ActionCard title="Analytics" icon={<FaClipboardList size={20} />} to="/statistics" color="bg-green-50" />
      </section>

      {/* Recent Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentCard title="Latest Users">
          {[
            { name: "Alice Smith", email: "alice@example.com" },
            { name: "Bob Johnson", email: "bob@example.com" },
            { name: "Charlie Brown", email: "charlie@example.com" },
          ].map((user, idx) => (
            <RecentItem key={idx} name={user.name} email={user.email} time="Joined 2h ago" />
          ))}
        </RecentCard>

        <RecentCard title="Latest Vendors">
          {[
            { name: "VendorPro", email: "support@vendorpro.com" },
            { name: "FreshMart", email: "contact@freshmart.io" },
            { name: "StyleZone", email: "hello@stylezone.in" },
          ].map((vendor, idx) => (
            <RecentItem key={idx} name={vendor.name} email={vendor.email} time="Registered 3h ago" />
          ))}
        </RecentCard>

        <RecentCard title="Latest Orders">
          {[
            { name: "#ORD1024", email: "alice@example.com" },
            { name: "#ORD1023", email: "bob@example.com" },
            { name: "#ORD1022", email: "charlie@example.com" },
          ].map((order, idx) => (
            <RecentItem key={idx} name={order.name} email={order.email} time="Placed 1h ago" />
          ))}
        </RecentCard>
      </section>
    </div>
  );
};

// ActionCard Component
const ActionCard = ({ title, icon, to, color }) => (
  <Link
    to={to}
    className={`flex items-center justify-between p-5 rounded-lg shadow-sm hover:shadow-md transition bg-white border ${color}`}
  >
    <div>
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      <p className="text-sm text-gray-500 mt-1">Go to {title.toLowerCase()}</p>
    </div>
    <div className="text-gray-600 bg-gray-100 p-3 rounded-full">{icon}</div>
  </Link>
);

// RecentCard Component
const RecentCard = ({ title, children }) => (
  <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
    <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
    <ul className="space-y-3">{children}</ul>
  </div>
);

// RecentItem Component (with email)
const RecentItem = ({ name, email, time }) => (
  <li className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
    <div>
      <p className="font-medium">{name}</p>
      <p className="text-gray-500 text-xs">{email}</p>
    </div>
    <span className="text-gray-400 text-xs mt-2 sm:mt-0">{time}</span>
  </li>
);

export default Dashboard;
