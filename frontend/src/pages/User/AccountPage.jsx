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
import { useNavigate } from "react-router-dom";
import { loadUser } from "../../redux/actions/user";
import { toast } from "react-toastify";
import UserAddress from "./components/UserAddress.jsx";
import SavedDesigns from "./components/SavedDesigns.jsx";
import OrderHistory from "./components/OrderHistory.jsx";

// ...[imports remain the same]
const AccountDashboard = () => {
  const { user } = useSelector((state) => ({
    user: state.user.user,
  }));

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeSection, setActiveSection] = useState("Personal Information");
  const [profileImage, setProfileImage] = useState(user?.avatar?.url || "");
  const [newImage, setNewImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result);
      };
      reader.readAsDataURL(file);
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

  const handleConfirmUpload = () => {
    if (newImage) {
      setProfileImage(newImage);
      setNewImage(null);
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

  const renderSection = () => {
    switch (activeSection) {
      case "Track Order":
        return <TrackOrder />;
      case "Addresses":
        return <UserAddress />;
      case "Saved Designs":
        return <SavedDesigns />;
      case "Order History":
        return <OrderHistory />;
      case "Personal Information":
      default:
        return (
          <PersonalInformation
            name={user.name}
            email={user.email}
            id={user._id}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex mt-14">
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

        {/* Updated Nav Menu */}
        <nav className="mt-6 space-y-4">
          {[
            "Personal Information",
            "Track Order",
            "Addresses",
            "Saved Designs",
            "Order History",
          ].map((item) => (
            <button
              key={item}
              className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-2 ${
                activeSection === item
                  ? "text-primary font-semibold"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveSection(item)}
            >
              {item === "Personal Information" && <FaUser />}
              {item === "Track Order" && <FaBox />}
              {item === "Addresses" && <FaMapMarkerAlt />}
              {item === "Saved Designs" && <FaHeart />}
              {item === "Order History" && <FaHistory />}
              <span>{item}</span>
            </button>
          ))}
        </nav>

        <button
          className="mt-6 w-full bg-primary hover:bg-orange-600 text-white py-2 rounded-md flex items-center justify-center space-x-2"
          onClick={handleLogout}
        >
          <FaSignOutAlt /> <span>Sign Out</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-6 bg-gray-50 min-h-screen">
        <div className="bg-white p-6 rounded-xl shadow-md">
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

export default AccountDashboard;
