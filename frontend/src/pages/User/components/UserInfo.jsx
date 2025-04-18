import React, { useState } from "react";
import { FaUser, FaGlobe, FaEnvelope, FaCalendar, FaCamera } from "react-icons/fa";

const PersonalInformation = ({ name, email, id, img }) => {
  const [newImage, setNewImage] = useState(null);
  const [profileImage, setProfileImage] = useState(img);

  // Handle form submission (to update profile)
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("id", id);

    // If new image is selected, append it to the form data
    if (newImage) {
      const fileInput = document.querySelector('input[type="file"]');
      formData.append("profileImage", fileInput.files[0]);
    }

    // Placeholder: Make your request to backend here (once API is ready)
    console.log("Form Data to send:", formData);
    // e.g., axios.post('/api/update-profile', formData);
  };

  return (
    <div className="sm:p-6" key={id}>
      <h2 className="text-lg sm:2xl font-bold text-gray-800 mb-1">
        Personal Information
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Manage your personal details and contact information.
      </p>

      {/* Profile Image Upload */}
      <div className="flex sm:hidden justify-center mb-6">
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

      {/* Input Fields */}
      <form onSubmit={handleProfileUpdate}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* First Name */}
          <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3 border border-gray-200">
            <FaUser className="text-primary text-lg min-w-[20px]" />
            <input
              type="text"
              placeholder="First Name"
              defaultValue={name}
              className="w-full text-sm sm:text-base p-2 bg-transparent outline-none"
            />
          </div>

          {/* Date of Birth */}
          <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3 border border-gray-200">
            <FaCalendar className="text-primary text-lg min-w-[20px]" />
            <input
              type="date"
              defaultValue="2005-12-12"
              className="w-full text-sm sm:text-base p-2 bg-transparent outline-none"
            />
          </div>

          {/* Country */}
          <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3 border border-gray-200">
            <FaGlobe className="text-primary text-lg min-w-[20px]" />
            <input
              type="text"
              placeholder="Country / Region"
              defaultValue="West Bengal, India"
              className="w-full text-sm sm:text-base p-2 bg-transparent outline-none"
            />
          </div>

          {/* Email */}
          <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3 border border-gray-200 md:col-span-2">
            <FaEnvelope className="text-primary text-lg min-w-[20px]" />
            <input
              type="email"
              placeholder="Email Address"
              defaultValue={email}
              className="w-full text-sm sm:text-base p-2 bg-transparent outline-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-6">
          <button className="w-full sm:w-32 bg-primary hover:bg-blue-700 text-white py-2 px-4 rounded-md transition text-sm sm:text-base">
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInformation;
