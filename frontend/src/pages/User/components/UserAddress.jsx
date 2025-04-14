import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const dummyAddresses = [
  {
    id: 1,
    name: "John Doe",
    phone: "9876543210",
    addressLine: "123 Park Street",
    city: "Kolkata",
    state: "West Bengal",
    postalCode: "700001",
  },
  {
    id: 2,
    name: "Jane Smith",
    phone: "9876543211",
    addressLine: "22 Elgin Road",
    city: "Kolkata",
    state: "West Bengal",
    postalCode: "700020",
  },
];

const UserAddress = () => {
  const [addresses, setAddresses] = useState(dummyAddresses);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (id) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
  };

  const handleAddDummyAddress = () => {
    const newAddress = {
      id: Date.now(),
      name: "New User",
      phone: "9999999999",
      addressLine: "New Street",
      city: "Delhi",
      state: "Delhi",
      postalCode: "110001",
    };
    setAddresses([...addresses, newAddress]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Saved Addresses</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-md"
        >
          <FaPlus /> Add New
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="p-4 border border-gray-300 rounded-md shadow-sm bg-gray-50"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{addr.name}</p>
                <p className="text-sm text-gray-600">{addr.phone}</p>
                <p className="text-sm mt-1">
                  {addr.addressLine}, {addr.city}, {addr.state} - {addr.postalCode}
                </p>
              </div>
              <div className="flex space-x-3 text-gray-600">
                <button>
                  <FaEdit className="hover:text-blue-500" />
                </button>
                <button onClick={() => handleDelete(addr.id)}>
                  <FaTrash className="hover:text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal (Dummy) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-md w-[90%] max-w-md p-6 space-y-4">
            <h3 className="text-lg font-semibold">Add New Address</h3>
            <p className="text-sm text-gray-500">This is a placeholder. Click below to add a dummy address.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDummyAddress}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-orange-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAddress;
