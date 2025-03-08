import React, { useState } from "react";
import { FaUser, FaBox, FaMapMarkerAlt, FaHeart, FaHistory, FaSignOutAlt, FaEdit, FaGlobe, FaEnvelope, FaCalendar } from "react-icons/fa";
import PersonalInformation from "../Components/UserInfo";
import TrackOrder from "../Components/TrackOrder";



const AccountDashboard = () => {
  const [activeSection, setActiveSection] = useState("Personal Information");

  const renderSection = () => {
    switch (activeSection) {
      case "Track Order":
        return <TrackOrder />;
      case "Addresses":
        return <Addresses />;
      case "Saved Designs":
        return <SavedDesigns />;
      case "Order History":
        return <OrderHistory />;
      case "Edit Account":
        return <EditAccount />;
      default:
        return <PersonalInformation />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 mt-12 min-h-[90vh] flex flex-col md:flex-row">
      <aside className="w-full md:w-1/4 bg-white p-6 rounded-xl shadow-md">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-300 rounded-full mb-3"></div>
          <h1 className="text-xl font-bold text-gray-800">Irakli Talavadze</h1>
          <p className="text-gray-500 text-sm">ikakodesign@gmail.com</p>
        </div>
        <nav className="mt-6 space-y-4">
          {["Personal Information", "Track Order", "Addresses", "Saved Designs", "Order History", "Edit Account"].map((item) => (
            <button
              key={item}
              className={` w-full text-left px-3 py-2 rounded-md flex items-center space-x-2 ${
                activeSection === item ? "text-primary font-semibold" : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveSection(item)}
            >
              {item === "Personal Information" && <FaUser />}
              {item === "Track Order" && <FaBox />}
              {item === "Addresses" && <FaMapMarkerAlt />}
              {item === "Saved Designs" && <FaHeart />}
              {item === "Order History" && <FaHistory />}
              {item === "Edit Account" && <FaEdit />}
              <span>{item}</span>
            </button>
          ))}
        </nav>
        <button className="mt-6 w-full bg-primary hover:bg-orange-600 text-white py-2 rounded-md flex items-center justify-center space-x-2">
          <FaSignOutAlt /> <span>Sign Out</span>
        </button>
      </aside>
      <main className="w-full md:w-3/4 bg-white p-6 rounded-xl shadow-md ml-0 md:ml-6 mt-6 md:mt-0">
        {renderSection()}
      </main>
    </div>
  );
};

export default AccountDashboard;
