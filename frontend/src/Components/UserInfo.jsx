import React, { useState } from "react";
import { FaUser, FaBox, FaMapMarkerAlt, FaHeart, FaHistory, FaSignOutAlt, FaEdit, FaGlobe, FaEnvelope, FaCalendar } from "react-icons/fa";

const PersonalInformation = () => (
    <div>
        <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
        <p className="text-gray-500 text-sm mb-6">Manage your personal details and contact information.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl shadow flex items-center space-x-3 border border-gray-200">
                <FaUser className="text-primary" />
                <input type="text" placeholder="First Name" defaultValue="Tanmay" className="w-full p-2 bg-transparent outline-none" />
            </div>
            <div className="bg-white p-4 rounded-xl shadow flex items-center space-x-3 border border-gray-200">
                <FaUser className="text-primary" />
                <input type="text" placeholder="Last Name" defaultValue="Haldar" className="w-full p-2 bg-transparent outline-none" />
            </div>
            <div className="bg-white p-4 rounded-xl shadow flex items-center space-x-3 border border-gray-200">
                <FaCalendar className="text-primary" />
                <input type="date" defaultValue="2005-12-12" className="w-full p-2 bg-transparent outline-none" />
            </div>
            <div className="bg-white p-4 rounded-xl shadow flex items-center space-x-3 border border-gray-200">
                <FaGlobe className="text-primary" />
                <input type="text" placeholder="Country / Region" defaultValue="West Bengal, India" className="w-full p-2 bg-transparent outline-none" />
            </div>
            <div className="bg-white p-4 rounded-xl shadow flex items-center space-x-3 border border-gray-200 md:col-span-2">
                <FaEnvelope className="text-primary" />
                <input type="email" placeholder="Email Address" defaultValue="example123@gmail.com" className="w-full p-2 bg-transparent outline-none" />
            </div>
        </div>
        <div className="flex items-center justify-end">
            <button className="mt-6 w-24 bg-primary hover:bg-blue-700 text-white py-2 rounded-md">Update</button>
        </div>
    </div>
);

export default PersonalInformation;