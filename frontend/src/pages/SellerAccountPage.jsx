import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  FaBoxOpen,
  FaClipboardList,
  FaChartLine,
  FaUserCog,
  FaSignOutAlt,
  FaPlus,
  FaCamera,
} from "react-icons/fa";

const SellerAccountPage = () => {
  const { seller } = useSelector((state) => ({
    seller: state.seller.user,
  }));

  const [activeSection, setActiveSection] = useState("Dashboard");
  const [profileImage, setProfileImage] = useState(seller?.avatar?.url || "");
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    if (seller?.avatar?.url && !profileImage) {
      setProfileImage(seller.avatar.url);
    }
  }, [seller]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmUpload = () => {
    if (newImage) {
      setProfileImage(newImage);
      setNewImage(null);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "Add Product":
        return <AddProductSection />;
      case "All Products":
        return <AllProductsSection />;
      case "Orders":
        return <OrdersSection />;
      case "Analytics":
        return <AnalyticsSection />;
      case "Profile Settings":
        return <ProfileSettings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 mt-12 min-h-[90vh] flex flex-col md:flex-row">
      <aside className="w-full md:w-1/4 bg-white p-6 rounded-xl shadow-md">
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 bg-gray-300 rounded-full overflow-hidden group">
            {newImage ? (
              <img
                src={newImage}
                alt="New Profile Preview"
                className="w-full h-full rounded-full object-cover border-2 border-blue-500"
              />
            ) : profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600 text-2xl font-bold">
                SA
              </div>
            )}

            <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
              <FaCamera className="text-white text-2xl" />
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>

          {newImage && (
            <button
              onClick={handleConfirmUpload}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
            >
              Confirm Upload
            </button>
          )}
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mt-4 text-center">{seller?.shopName || "Seller Name"}</h2>
        <h5 className="text-sm  text-gray-400 text-center">{seller?.name || "Seller Name"}</h5>
        <nav className="mt-6 space-y-4">
          {["Dashboard", "Add Product", "All Products", "Orders", "Analytics", "Profile Settings"].map((item) => (
            <button
              key={item}
              className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-2 ${
                activeSection === item ? "text-primary font-semibold" : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveSection(item)}
            >
              {item === "Dashboard" && <FaChartLine />}
              {item === "Add Product" && <FaPlus />}
              {item === "All Products" && <FaBoxOpen />}
              {item === "Orders" && <FaClipboardList />}
              {item === "Analytics" && <FaChartLine />}
              {item === "Profile Settings" && <FaUserCog />}
              <span>{item}</span>
            </button>
          ))}
        </nav>

        <button className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md flex items-center justify-center space-x-2">
          <FaSignOutAlt />
          <span>Sign Out</span>
        </button>
      </aside>

      <main className="w-full md:w-3/4 bg-white p-6 rounded-xl shadow-md ml-0 md:ml-6 mt-6 md:mt-0">
        {renderSection()}
      </main>
    </div>
  );
};


// Dashboard Overview Section
const DashboardOverview = () => (
    <div>
      <h2 className="text-2xl font-semibold">Dashboard Overview</h2>
      <p className="text-gray-500 mt-2">
        Analytics and sales performance will be displayed here.
      </p>
    </div>
  );
  
  // Add Product Section
  const AddProductSection = () => (
    <div>
      <h2 className="text-2xl font-semibold">Add New Product</h2>
      <form className="mt-4 space-y-4">
        <input
          type="text"
          placeholder="Product Name"
          className="w-full p-2 border rounded-md"
        />
        <input
          type="number"
          placeholder="Price"
          className="w-full p-2 border rounded-md"
        />
        <textarea
          placeholder="Product Description"
          className="w-full p-2 border rounded-md"
        ></textarea>
        <input type="file" className="w-full p-2 border rounded-md" />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Add Product
        </button>
      </form>
    </div>
  );
  
  // All Products Section
  const AllProductsSection = () => (
    <div>
      <h2 className="text-2xl font-semibold">All Products</h2>
      <table className="w-full mt-4 border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Product Name</th>
            <th className="p-2">Price</th>
            <th className="p-2">Stock</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="p-2">Product 1</td>
            <td className="p-2">$19.99</td>
            <td className="p-2">50</td>
            <td className="p-2">
              <button className="text-blue-600 hover:underline">Edit</button> |{" "}
              <button className="text-red-600 hover:underline">Delete</button>
            </td>
          </tr>
          <tr className="border-t">
            <td className="p-2">Product 2</td>
            <td className="p-2">$39.99</td>
            <td className="p-2">30</td>
            <td className="p-2">
              <button className="text-blue-600 hover:underline">Edit</button> |{" "}
              <button className="text-red-600 hover:underline">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
  
  // Orders Section
  const OrdersSection = () => (
    <div>
      <h2 className="text-2xl font-semibold">Orders</h2>
      <p className="text-gray-500 mt-2">Orders will be displayed here.</p>
    </div>
  );
  
  // Analytics Section
  const AnalyticsSection = () => (
    <div>
      <h2 className="text-2xl font-semibold">Sales Analytics</h2>
      <p className="text-gray-500 mt-2">
        Charts and insights will be displayed here.
      </p>
    </div>
  );
  
  // Profile Settings Section
  const ProfileSettings = () => (
    <div>
      <h2 className="text-2xl font-semibold">Profile Settings</h2>
    </div>
  );

export default SellerAccountPage;
