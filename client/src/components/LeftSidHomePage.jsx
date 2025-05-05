import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LeftSideHomePage = ({ 
  setShowCreatePost, 
  setShowEditForm, 
  handleLogout, 
  handleDeleteProfile 
}) => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="w-full lg:w-1/4 order-1">
      <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
        <div className="flex flex-col items-center mb-4">
          {currentUser.profilePic ? (
            <img
              src={currentUser.profilePic}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mb-3"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-indigo-500 text-white flex items-center justify-center text-3xl font-bold mb-3">
              {currentUser.name?.[0]?.toUpperCase() || "U"}
            </div>
          )}
          <h2 className="text-xl font-bold">{currentUser.name}</h2>
          <p className="text-gray-600">@{currentUser.username}</p>
          <p className="text-gray-500 text-sm mt-1">
            {currentUser.email}
          </p>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => setShowCreatePost(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition w-full"
          >
            Create Post
          </button>
          <NavLink
            to={`/user/${currentUser._id}`}
            className="block w-full text-center bg-gray-200 py-2 rounded hover:bg-gray-300 transition"
          >
            View Profile
          </NavLink>
          <button
            onClick={() => setShowEditForm(true)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition w-full"
          >
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="block w-full text-center bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
          <button
            onClick={handleDeleteProfile}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition w-full"
          >
            Delete Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftSideHomePage;