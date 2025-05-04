import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPublicProfile } from "../features/users/UsersApi";
import SinglePost from "../features/posts/SinglePost";

const PublicProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getPublicProfile(userId);
        setUser(response.data.user);
        setPosts(response.data.posts || []);
      } catch (error) {
        console.error("Error fetching public profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Banner */}
      <div className="h-60 bg-indigo-600 relative">
        {user.bannerImage && (
          <img
            src={user.bannerImage}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Profile Info */}
      <div className="px-4 md:px-6 lg:px-8 max-w-8xl mx-auto relative">
        <div className="flex items-end -mt-16 mb-6">
          <div className="relative">
            {user.profilePic ? (
              <img
                src={user.profilePic}
                alt="Profile"
                className="w-40 h-40 rounded-full border-4 border-white object-cover"
              />
            ) : (
              <div className="w-40 h-40 rounded-full bg-indigo-500 text-white flex items-center justify-center text-4xl font-bold border-4 border-white">
                {user.name[0].toUpperCase()}
              </div>
            )}
          </div>
          <div className="ml-6 mb-8 flex-1">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-600">@{user.username}</p>
          </div>
        </div>

        {/* Followers/Following Stats */}
        <div className="flex space-x-4 mb-6">
          <div>
            <span className="font-bold">{posts.length}</span> Posts
          </div>
          <div>
            <span className="font-bold">{user.followers?.length || 0}</span> Followers
          </div>
          <div>
            <span className="font-bold">{user.following?.length || 0}</span> Following
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="px-4 md:px-8 py-6 bg-white rounded-lg shadow-md max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
          Posts
        </h2>
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <SinglePost key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicProfile;
