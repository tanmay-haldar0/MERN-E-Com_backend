import React, { useState } from "react";
import {
  FaUser,
  FaBox,
  FaMapMarkerAlt,
  FaHeart,
  FaHistory,
  FaSignOutAlt,
  FaEdit,
  FaCamera,
} from "react-icons/fa";
import PersonalInformation from "../../Components/UserInfo";
import TrackOrder from "./components/TrackOrder.jsx";
import { useDispatch, useSelector } from "react-redux";
import { server } from "../../server";
// import { useNavigate } from "react-router-dom";
import { loadUser } from "../../redux/actions/user";
import { toast } from "react-toastify";
import UserAddress from "./components/UserAddress.jsx";
import SavedDesigns from "./components/SavedDesigns.jsx";
import OrderHistory from "./components/OrderHistory.jsx";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
// Import components like before

const AccountDashboard = () => {
  const { user } = useSelector((state) => ({ user: state.user.user }));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profileImage, setProfileImage] = useState(user?.avatar?.url || "");
  const [newImage, setNewImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmUpload = () => {
    if (newImage) {
      setProfileImage(newImage);
      setNewImage(null);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(`${server}/user/logout`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Logged Out Successfully");
        navigate("/login");
        dispatch(loadUser());
      } else {
        toast.error("Logout failed:", data.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getInitials = (name) => {
    if (!name) return "S";
    return name
      .split(" ")
      .map((part) => part[0].toUpperCase())
      .slice(0, 2)
      .join("");
  };

  const navItems = [
    { label: "Personal Info", path: "personal-info", icon: <FaUser /> },
    { label: "Track Order", path: "track-order", icon: <FaBox /> },
    { label: "Addresses", path: "addresses", icon: <FaMapMarkerAlt /> },
    { label: "Saved Designs", path: "saved-designs", icon: <FaHeart /> },
    { label: "Order History", path: "order-history", icon: <FaHistory /> },
  ];

  return (
    <div className="min-h-screen flex mt-14">
      {/* Side Panel */}
      <aside className="hidden sm:block bg-white p-6 shadow-md fixed top-16 left-0 h-full w-64 overflow-y-auto z-10">
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 bg-gray-300 rounded-full mb-3 flex items-center justify-center overflow-hidden group">
            {newImage ? (
              <img
                src={newImage}
                className="w-full h-full rounded-full object-cover border-2 border-blue-500"
              />
            ) : profileImage ? (
              <img
                src={profileImage}
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
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={`/dashboard/${item.path}`}
              className={({ isActive }) =>
                `w-full text-left px-3 py-2 rounded-md flex text-md items-center space-x-2 ${
                  isActive
                    ? "text-primary font-semibold"
                    : "text-gray-500 hover:text-gray-700"
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button
          className="mt-6 w-full bg-primary hover:bg-orange-600 text-white py-2 rounded-md flex items-center justify-center space-x-2"
          onClick={handleLogout}
        >
          <FaSignOutAlt /> <span>Sign Out</span>
        </button>
      </aside>

      {/* Main content with nested routes */}
      {/* Main content with nested routes */}
      <main className="flex-1 sm:ml-64 p-4 sm:p-6 bg-gray-50 min-h-screen">
        <div className="bg-white p-1 sm:p-4 rounded-xl shadow-md w-full max-w-6xl mx-auto">
          <Routes>
            <Route
              path="personal-info"
              element={
                <PersonalInformation
                  name={user?.name}
                  email={user?.email}
                  id={user?._id}
                />
              }
            />
            <Route path="track-order" element={<TrackOrder />} />
            <Route path="addresses" element={<UserAddress />} />
            <Route path="saved-designs" element={<SavedDesigns />} />
            <Route path="order-history" element={<OrderHistory />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AccountDashboard;
