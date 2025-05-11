import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUser,
  FaStore,
  FaClipboardList,
  FaMoneyBillWave,
  FaPalette,
  FaChartBar,
} from "react-icons/fa";

const navItems = [
  { label: "Dashboard", path: "/", icon: <FaTachometerAlt /> },
  { label: "Users", path: "/users", icon: <FaUser /> },
  { label: "Vendors", path: "/vendors", icon: <FaStore /> },
  { label: "Orders", path: "/orders", icon: <FaClipboardList /> },
  { label: "Payments", path: "/payments", icon: <FaMoneyBillWave /> },
  { label: "Themes", path: "/themes", icon: <FaPalette /> },
  { label: "Statistics", path: "/statistics", icon: <FaChartBar /> },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 h-screen fixed top-0 bg-[#EFF6FF] text-gray-800 shadow-md p-4 border-r border-gray-200">
      <nav className="flex flex-col mt-16 gap-4">
        {navItems.map(({ label, path, icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={label}
              to={path}
              className={`flex items-center gap-4 px-5 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-blue-500 text-white shadow-lg transform scale-105"
                  : "hover:bg-gray-100 text-gray-600 hover:text-blue-500"
              }`}
            >
              <span className="text-xl">{icon}</span>
              <span className="text-sm font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
