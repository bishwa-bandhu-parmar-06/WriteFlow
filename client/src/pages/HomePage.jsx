import React, { useEffect, useState } from "react";
import { getAllPosts } from "../features/posts/postsApi";
import { getAllUsers } from "../features/users/UsersApi";
import SinglePost from "../features/posts/SinglePost";
import { useAuth } from "../context/AuthContext";
import { logout, deleteProfile } from "../features/users/UsersApi";
import UsersEditDetailsForm from "../features/users/UsersEditDetailsForm";
import CreatePostForm from "../features/posts/CreatePost";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LeftSideHomePage from "../components/LeftSidHomePage";
import RightSideHomePage from "../components/RightSideHomePage";
import Loader from "../components/Loader";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const { user: currentUser, logout: authLogout, updateUser } = useAuth();
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

  const handlePostUpdated = (updatedPost) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  const handlePostDeleted = (deletedPostId) => {
    setPosts(posts.filter((post) => post._id !== deletedPostId));
  };

  const handleUpdateProfile = (updatedUser) => {
    updateUser(updatedUser);
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
        authLogout();
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
      authLogout();
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <Loader />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Sidebar - User Profile */}
            {currentUser && (
              <LeftSideHomePage
                setShowCreatePost={setShowCreatePost}
                setShowEditForm={setShowEditForm}
                handleLogout={handleLogout}
                handleDeleteProfile={handleDeleteProfile}
              />
            )}

            {/* Center Column - Posts */}
            <div
              className={`${
                currentUser ? "w-full lg:w-2/4" : "w-full lg:w-3/4 mx-auto"
              } order-2`}
            >
              <div>
                <h1 className="text-2xl font-bold mb-6">All Posts</h1>
                {posts.length === 0 ? (
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
              <RightSideHomePage users={users} loading={loading} />
            )}
          </div>
        )}
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
            fetchPosts();
          }}
        />
      )}
    </div>
  );
};

export default HomePage;