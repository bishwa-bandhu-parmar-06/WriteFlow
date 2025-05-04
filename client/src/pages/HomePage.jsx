import React, { useEffect, useState } from "react";
import { getAllPosts } from "../features/posts/postsApi";
import { getAllUsers } from "../features/users/UsersApi";
import SinglePost from "../features/posts/SinglePost";
import { useAuth } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import { logout, deleteProfile } from "../features/users/UsersApi";
import UsersEditDetailsForm from "../features/users/UsersEditDetailsForm";
import CreatePostForm from "../features/posts/CreatePost";
const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const { user: currentUser, logout: authLogout } = useAuth();
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const response = await getAllPosts();
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchUsers();
  }, []);

  const handlePostUpdated = () => {
    fetchPosts();
  };

  const handlePostDeleted = (deletedPostId) => {
    setPosts(posts.filter((post) => post._id !== deletedPostId));
  };
  const handleUpdateProfile = (updatedUser) => {
    setUser(updatedUser);
    setShowEditForm(false);
  };
  const handleDeleteProfile = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your profile? This cannot be undone."
      )
    ) {
      try {
        await deleteProfile();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Profile deleted successfully");
        navigate("/");
      } catch (error) {
        toast.error("Failed to delete profile");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - User Profile */}
          {currentUser && (
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
                      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                    >
                      Create Post
                    </button>
                  <NavLink
                    to={`/user/${currentUser._id}`}
                    className="block w-full text-center bg-gray-200 py-2 rounded hover:bg-gray-300 transition"
                  >
                    View Profile
                  </NavLink>
                  {/* <NavLink
                    to="/edit-profile"
                    className="block w-full text-center bg-gray-200 py-2 rounded hover:bg-gray-300 transition"
                  >
                    Edit Profile
                  </NavLink> */}
                  <button
                    onClick={() => setShowEditForm(true)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
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
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Delete Profile
                    </button>
                </div>
              </div>
            </div>
          )}

          {/* Center Column - Posts */}
          <div
            className={`${
              currentUser ? "w-full lg:w-2/4" : "w-full lg:w-3/4 mx-auto"
            } order-2`}
          >
            <div>
              <h1 className="text-2xl font-bold mb-6">All Posts</h1>
              {loading ? (
                <p className="text-center text-gray-500">Loading posts...</p>
              ) : posts.length === 0 ? (
                <p className="text-center text-gray-500">No posts found.</p>
              ) : (
                posts.map((post) => (
                  <SinglePost
                    key={post._id}
                    post={post}
                    onPostUpdated={handlePostUpdated}
                    onPostDeleted={handlePostDeleted}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right Sidebar - Users List */}
          {currentUser && (
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
          )}
        </div>
      </div>
      {showEditForm && (
        <UsersEditDetailsForm
          user={currentUser}
          onClose={() => setShowEditForm(false)}
          onUpdate={handleUpdateProfile}
        />
      )}
      {showCreatePost && (
              <CreatePostForm
                onClose={() => setShowCreatePost(false)}
                onPostCreated={() => {
                  setShowCreatePost(false);
                }}
              />
            )}
    </div>
  );
};

export default HomePage;
