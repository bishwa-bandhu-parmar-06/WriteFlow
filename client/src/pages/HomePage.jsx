import React, { useEffect, useState } from 'react';
import { getAllPosts } from '../features/posts/postsApi';
import SinglePost from '../features/posts/SinglePost';
// import CreatePostForm from '../features/posts/CreatePost';
const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await getAllPosts();
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostUpdated = () => {
    fetchPosts(); // Refresh after like, comment, or edit
  };

  const handlePostDeleted = (deletedPostId) => {
    setPosts(posts.filter(post => post._id !== deletedPostId));
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      
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
  );
};

export default HomePage;
