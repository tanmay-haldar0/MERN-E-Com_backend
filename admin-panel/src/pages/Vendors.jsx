import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { server } from "../server";
import axios from "axios";

const Vendors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const { data } = await axios.get(`${server}/seller/admin-seller`, {
          withCredentials: true,
        });
        setVendors(data.sellers);
      } catch (error) {
        console.error("Failed to fetch vendors:", error);
      } finally {
        setLoading(false); // Stop loading once done
      }
    };

    fetchVendors();
  }, []);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this vendor?")) {
      setVendors(vendors.filter((vendor) => vendor.id !== id));
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-600";
      case "Pending":
        return "bg-yellow-100 text-yellow-600";
      case "Suspended":
        return "bg-red-100 text-red-600";
      default:
        return "bg-green-100 text-green-600";
    }
  };

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const SkeletonRow = () => (
    <tr className="animate-pulse bg-gray-50">
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-300 rounded w-4/5"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="h-4 bg-gray-300 rounded w-1/4 mx-auto"></div>
      </td>
    </tr>
  );

  return (
    <div className="pl-64 pr-8 py-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Vendor Management</h1>

      <input
        type="text"
        placeholder="🔍 Search vendors by name or email..."
        className="w-full mb-6 px-5 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-gray-700 placeholder-gray-400"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="w-full bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-blue-50 text-gray-700 text-left">
            <tr>
              <th className="px-6 py-4 font-semibold">Vendor Name</th>
              <th className="px-6 py-4 font-semibold">Email</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading
              ? Array(6)
                  .fill(0)
                  .map((_, index) => <SkeletonRow key={index} />)
              : filteredVendors.map((vendor, index) => (
                  <tr
                    key={vendor.id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } transition hover:bg-blue-50`}
                  >
                    <td className="px-6 py-4 text-gray-800 font-medium">{vendor.name}</td>
                    <td className="px-6 py-4 text-gray-600">{vendor.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full font-semibold text-xs ${getStatusStyle(
                          vendor.status
                        )}`}
                      >
                        {vendor.status || "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center space-x-4">
                      <button
                        className="text-blue-500 hover:text-blue-700 transition transform hover:scale-110"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(vendor.id)}
                        className="text-red-500 hover:text-red-700 transition transform hover:scale-110"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
            {!loading && filteredVendors.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-6 text-center text-gray-500 italic">
                  No vendors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Vendors;
