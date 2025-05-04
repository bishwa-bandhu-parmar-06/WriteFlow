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

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!user) return <div className="flex justify-center items-center h-screen">User not found</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Banner Image with fallback */}
      <div className={`relative ${user.bannerImage ? 'h-48 md:h-64' : 'h-24 md:h-32 bg-indigo-600'}`}>
        {user.bannerImage ? (
          <img
            src={user.bannerImage}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
        )}
      </div>

      {/* Profile Header */}
      <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 mb-6 gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-white overflow-hidden">
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-indigo-500 flex items-center justify-center text-white text-4xl font-bold">
                  {user.name[0].toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{user.name}</h1>
                <p className="text-gray-600">@{user.username}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {isCurrentUser ? (
                  <>
                    <button
                      onClick={() => setShowCreatePost(true)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                    >
                      Create Post
                    </button>
                    <button
                      onClick={() => setShowEditForm(true)}
                      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Logout
                    </button>
                    <button
                      onClick={handleDeleteProfile}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Delete Profile
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleFollow}
                    className={`px-4 py-2 rounded transition ${
                      isFollowing ? "bg-gray-200 hover:bg-gray-300" : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                )}
              </div>
            </div>

            {/* Followers/Following Count */}
            <div className="flex gap-4 mt-4">
              <div className="text-center">
                <span className="font-bold block">{user.followers.length}</span>
                <span className="text-gray-600 text-sm">Followers</span>
              </div>
              <div className="text-center">
                <span className="font-bold block">{user.following.length}</span>
                <span className="text-gray-600 text-sm">Following</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6 text-indigo-600">
            {isCurrentUser ? "My Posts" : `${user.name}'s Posts`}
          </h2>

          {myPosts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No posts yet.</p>
              {isCurrentUser && (
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  Create Your First Post
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myPosts.map((post) => (
                <SinglePost key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
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
            fetchMyPosts();
            setShowCreatePost(false);
          }}
        />
      )}
    </div>
  );
};

export default Profile;