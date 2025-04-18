import React from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaBox,
  FaMapMarkerAlt,
  FaHeart,
  FaHistory,
  FaSignOutAlt,
  FaCamera,
} from "react-icons/fa";

const AccountPanel = ({
  user,
  newImage,
  profileImage,
  handleImageUpload,
  handleConfirmUpload,
  handleLogout,
}) => {
  const getInitials = (name) => {
    if (!name) return "S";
    return name
      .split(" ")
      .map((part) => part[0].toUpperCase())
      .slice(0, 2)
      .join("");
  };

  return (
    <aside className="bg-white p-6 shadow-md fixed top-16 left-0 h-full overflow-y-auto z-10">
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24 bg-gray-300 rounded-full mb-3 flex items-center justify-center overflow-hidden group">
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
            <span className="text-2xl font-semibold text-gray-700">
              {getInitials(user?.name)}
            </span>
          )}
          <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <FaCamera className="text-white text-xl" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>

        {newImage && (
          <button
            onClick={handleConfirmUpload}
            className="my-2 bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Update
          </button>
        )}

        <h1 className="text-xl font-bold text-gray-800 text-center">
          {user?.name}
        </h1>
        <p className="text-gray-500 text-sm text-center">{user?.email}</p>
      </div>

      <nav className="mt-6 space-y-4">
        {[
          { name: "Personal Information", icon: <FaUser />, path: "/personal-info" },
          { name: "Track Order", icon: <FaBox />, path: "/track-order" },
          { name: "Addresses", icon: <FaMapMarkerAlt />, path: "/addresses" },
          { name: "Saved Designs", icon: <FaHeart />, path: "/saved-designs" },
          { name: "Order History", icon: <FaHistory />, path: "/order-history" },
        ].map(({ name, icon, path }) => (
          <Link
            key={name}
            to={path}
            className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-2 ${
              window.location.pathname === path
                ? "text-primary font-semibold"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {icon}
            <span>{name}</span>
          </Link>
        ))}
      </nav>

      <button
        className="mt-6 w-full bg-primary hover:bg-orange-600 text-white py-2 rounded-md flex items-center justify-center space-x-2"
        onClick={handleLogout}
      >
        <FaSignOutAlt /> <span>Sign Out</span>
      </button>
    </aside>
  );
};

export default AccountPanel;
