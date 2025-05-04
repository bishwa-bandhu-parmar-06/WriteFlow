// src/features/users/UsersEditDetailsForm.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { updateProfile } from './UsersApi';

const UsersEditDetailsForm = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    mobile: '',
    email: '',
    profilePic: null,
    bannerImage: null
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        mobile: user.mobile || '',
        email: user.email || '',
        profilePic: null,
        bannerImage: null
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('username', formData.username);
      formDataToSend.append('mobile', formData.mobile);
      formDataToSend.append('email', formData.email);
      if (formData.profilePic) formDataToSend.append('profilePic', formData.profilePic);
      if (formData.bannerImage) formDataToSend.append('bannerImage', formData.bannerImage);

      const response = await updateProfile(formDataToSend);
      toast.success('Profile updated successfully!');
      onUpdate(response.data.user);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Mobile</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Profile Picture</label>
            <input
              type="file"
              name="profilePic"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Banner Image</label>
            <input
              type="file"
              name="bannerImage"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsersEditDetailsForm;