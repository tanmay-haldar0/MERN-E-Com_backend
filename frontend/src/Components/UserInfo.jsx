import React from "react";
import { FaUser, FaGlobe, FaEnvelope, FaCalendar } from "react-icons/fa";

const PersonalInformation = ({ name, email, id }) => {

  return (
    <div className="sm:p-6" key={id}>
      <h2 className="text-lg sm:2xl font-bold text-gray-800 mb-1">
        Personal Information
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Manage your personal details and contact information.
      </p>

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

      {/* Button */}
      <div className="flex justify-end mt-6">
        <button className="w-full sm:w-32 bg-primary hover:bg-blue-700 text-white py-2 px-4 rounded-md transition text-sm sm:text-base">
          Update
        </button>
      </div>
    </div>
  );
};

export default PersonalInformation;
