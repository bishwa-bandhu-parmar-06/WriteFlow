import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RightSideHomePage = ({ users, loading }) => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="w-full lg:w-1/4 order-3">
      <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
        <h2 className="text-xl font-bold mb-4">People You May Know</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-500">No users found.</p>
        ) : (
          <div className="space-y-3">
            {users
              .filter((u) => u._id !== currentUser._id)
              .map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    {user.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-bold mr-3">
                        {user.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">
                        @{user.username}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/user/${user._id}`)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    View
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RightSideHomePage;