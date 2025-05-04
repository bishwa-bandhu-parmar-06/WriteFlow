// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getProfile,
  followUser,
  unfollowUser,
  deleteProfile,
  logout,
} from "./UsersApi";
import UsersEditDetailsForm from "./UsersEditDetailsForm";
import CreatePostForm from "../posts/CreatePost";
import SinglePost from "../posts/SinglePost";
import { getMyPosts } from "../posts/postsApi";

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [loading, setLoading] = useState(true);

  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        const currentUserId = currentUser?._id;

        if (!currentUserId && !userId) {
          toast.error("Please login to view profile");
          navigate("/auth");
          return;
        }

        const profileId = userId || currentUserId;
        const response = await getProfile(profileId);

        setUser(response.data.user);
        setIsCurrentUser(response.data.user._id === currentUserId);
        setIsFollowing(response.data.user.followers?.includes(currentUserId));
        setLoading(false);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load profile");
        navigate("/");
      }
    };

    fetchProfile();
  }, [userId, navigate]);
  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await getMyPosts();
        setMyPosts(res.data.posts);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);


  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(user._id);
        setIsFollowing(false);
        setUser((prev) => ({
          ...prev,
          followers: prev.followers.filter(
            (id) => id !== localStorage.getItem("userId")
          ),
        }));
        toast.success("Unfollowed successfully");
      } else {
        await followUser(user._id);
        setIsFollowing(true);
        setUser((prev) => ({
          ...prev,
          followers: [...prev.followers, localStorage.getItem("userId")],
        }));
        toast.success("Followed successfully");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update follow status"
      );
    }
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

  const handleUpdateProfile = (updatedUser) => {
    setUser(updatedUser);
    setShowEditForm(false);
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Banner Image */}
      <div className="h-78 bg-indigo-600 relative">
        {user.bannerImage && (
          <img
            src={user.bannerImage}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Profile Header */}
      <div className="px-4 md:px-6 lg:px-8 max-w-8xl mx-auto relative">
        <div className="flex items-end -mt-16 mb-6">
          <div className="relative">
            <img
              src={user.profilePic || "/default-profile.png"}
              alt="Profile"
              className="w-40 h-40 rounded-full border-4 border-white object-cover"
            />
          </div>
          <div className="ml-6 mb-8 flex-1">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-600">@{user.username}</p>
          </div>
          <div className="flex space-x-2">
            {isCurrentUser ? (
              <>
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                  Create Post
                </button>
                <button
                  onClick={() => setShowEditForm(true)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Logout
                </button>
                <button
                  onClick={handleDeleteProfile}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Delete Profile
                </button>
              </>
            ) : (
              <button
                onClick={handleFollow}
                className={`px-4 py-2 rounded ${
                  isFollowing ? "bg-gray-200" : "bg-indigo-600 text-white"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>
        </div>

        {/* Followers/Following Count */}
        <div className="flex space-x-4 mb-6">
          <div>
            <span className="font-bold">{user.followers.length}</span> Followers
          </div>
          <div>
            <span className="font-bold">{user.following.length}</span> Following
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="px-4 md:px-8 py-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
          My Posts
        </h2>

        {myPosts.length === 0 ? (
          <p className="text-gray-500">No posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myPosts.map((post) => (
              <SinglePost key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showEditForm && (
        <UsersEditDetailsForm
          user={user}
          onClose={() => setShowEditForm(false)}
          onUpdate={handleUpdateProfile}
        />
      )}

      {showCreatePost && (
        <CreatePostForm
          onClose={() => setShowCreatePost(false)}
          onPostCreated={() => {
            // Refresh posts or add to state
            setShowCreatePost(false);
          }}
        />
      )}
    </div>
  );
};

export default Profile;
