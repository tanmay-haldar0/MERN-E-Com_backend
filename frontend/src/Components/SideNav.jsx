import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie"; // Import Cookies library
import {
  FaBoxOpen,
  FaClipboardList,
  FaChartLine,
  FaUserCog,
  FaSignOutAlt,
  FaPlus,
  FaCamera,
  FaBars,
} from "react-icons/fa";
import { server } from "../server";
import { loadSeller } from "../redux/actions/user";
import { toast } from "react-toastify";

const SideNav = () => {
  const { seller, orders } = useSelector((state) => ({
    seller: state.seller.user,
    orders: state.orders?.list || [],
  }));

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileImage, setProfileImage] = useState(seller?.avatar?.url || "");
  const [newImage, setNewImage] = useState(null);

  const menuItems = [
    { name: "Dashboard", icon: <FaChartLine />, path: "/seller/dashboard" },
    { name: "Add Product", icon: <FaPlus />, path: "/seller/create-product" },
    { name: "All Products", icon: <FaBoxOpen />, path: "/seller/all-products" },
    {
      name: "Orders",
      icon: <FaClipboardList />,
      path: "/seller/orders",
      count: orders.length,
    },
    { name: "Analytics", icon: <FaChartLine />, path: "/seller/analytics" },
    {
      name: "Profile Settings",
      icon: <FaUserCog />,
      path: "/seller/profile-settings",
    },
  ];

  const activeSection =
    menuItems.find((item) => item.path === location.pathname)?.name ||
    "Dashboard";

  useEffect(() => {
    if (seller?.avatar?.url && !profileImage) {
      setProfileImage(seller.avatar.url);
    }
  }, [seller]);

  const handleNavigation = (path) => {
    navigate(path);
  };


  const handleLogout = async () => {
    try {
      const res = await fetch(`${server}/seller/logout`, {
        method: "GET",
        credentials: "include", // VERY IMPORTANT: to send cookies
      });
  
      const data = await res.json();
  
      if (data.success) {
        // Optional: redirect to login or home
        toast.success("Logged Out Successfully");
        // console.log("Logged out:", data.message);
        navigate("/seller");
        dispatch(loadSeller());
      } else {
        toast.error("Logout failed:", data.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  

  return (
    <div className="fixed min-h-screen mt-16">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-6 shadow-md hidden md:block">
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 bg-gray-300 rounded-full overflow-hidden group">
            {newImage ? (
              <img
                src={newImage}
                alt="New Profile Preview"
                className="w-full h-full rounded-full object-cover border-2 border-blue-500"
              />
            ) : profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600 text-2xl font-bold">
                SA
              </div>
            )}
            <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
              <FaCamera className="text-white text-2xl" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  setNewImage(URL.createObjectURL(e.target.files[0]))
                }
              />
            </label>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mt-4 text-center">
          {seller?.shopName || "Seller Name"}
        </h2>
        <h5 className="text-sm text-gray-400 text-center">
          {seller?.name || "Seller Name"}
        </h5>

        {/* Navigation Menu */}
        <nav className="mt-6 space-y-4">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-2 transition-all md:text-base text-lg ${
                activeSection === item.name
                  ? "text-primary font-semibold"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="relative flex items-center">{item.icon}</div>
              <span>{item.name}</span>
              {item.count > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Sign Out Button */}
        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md flex items-center justify-center space-x-2"
        >
          <FaSignOutAlt />
          <span>Sign Out</span>
        </button>
      </aside>
    </div>
  );
};

export default SideNav;
