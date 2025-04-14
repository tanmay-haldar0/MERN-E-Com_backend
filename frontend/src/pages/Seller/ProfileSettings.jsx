import React, { useState } from 'react';
import SideNav from '../../Components/SideNav';

const dummyProfile = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  storeName: "John's Store",
  storeDescription: 'We offer the best products at affordable prices.',
  storeAddress: '123 Main Street, City, Country',
};

const ProfileSettings = () => {
  const [profile, setProfile] = useState(dummyProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState(dummyProfile);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setProfile(updatedProfile);
    setIsEditing(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideNav />
      <div className="flex-1 p-8 ml-64 mt-16">
        <h1 className="text-4xl font-bold text-gray-900">👤 Profile Settings</h1>
        <p className="text-gray-600 mb-6">Update your personal and store information.</p>

        <div className="bg-white p-8 rounded-lg shadow-md">
          {/* Personal Information */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-gray-600">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={updatedProfile.name}
                  onChange={handleInputChange}
                  className="p-2 border rounded-md w-64"
                />
              ) : (
                <span className="text-gray-800">{profile.name}</span>
              )}
            </div>

            <div className="flex justify-between items-center">
              <label className="text-gray-600">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={updatedProfile.email}
                  onChange={handleInputChange}
                  className="p-2 border rounded-md w-64"
                />
              ) : (
                <span className="text-gray-800">{profile.email}</span>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Store Information</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-gray-600">Store Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="storeName"
                    value={updatedProfile.storeName}
                    onChange={handleInputChange}
                    className="p-2 border rounded-md w-64"
                  />
                ) : (
                  <span className="text-gray-800">{profile.storeName}</span>
                )}
              </div>

              <div className="flex justify-between items-center">
                <label className="text-gray-600">Store Description</label>
                {isEditing ? (
                  <textarea
                    name="storeDescription"
                    value={updatedProfile.storeDescription}
                    onChange={handleInputChange}
                    className="p-2 border rounded-md w-64 h-24"
                  />
                ) : (
                  <p className="text-gray-800">{profile.storeDescription}</p>
                )}
              </div>

              <div className="flex justify-between items-center">
                <label className="text-gray-600">Store Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="storeAddress"
                    value={updatedProfile.storeAddress}
                    onChange={handleInputChange}
                    className="p-2 border rounded-md w-64"
                  />
                ) : (
                  <span className="text-gray-800">{profile.storeAddress}</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all duration-300"
              >
                Save Changes
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all duration-300"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
