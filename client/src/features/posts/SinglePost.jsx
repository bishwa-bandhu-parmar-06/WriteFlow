import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toggleLike, createComment, deletePost } from "../posts/postsApi";
import { useAuth } from "../../context/AuthContext";
import EditPost from "./EditPost";
import { toast } from "react-toastify";

const SinglePost = ({ post, onPostUpdated, onPostDeleted }) => {
  const { title, content, image, createdAt, userId, likes = [], _id } = post;
  const [isEditing, setIsEditing] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [showOptions, setShowOptions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const postDate = new Date(createdAt).toLocaleString();
  const isLiked = currentUser && likes.includes(currentUser._id);
  const isAuthor = currentUser && currentUser._id === userId?._id;

  // Determine the context
  const isHomePage = location.pathname === "/";
  const isProfilePage = location.pathname.includes("/profile") || 
                       location.pathname.includes("/user");

  const handleLike = async () => {
    if (!currentUser) {
      navigate("/auth");
      return;
    }
    try {
      await toggleLike(_id);
      // Update UI optimistically
      if (isLiked) {
        post.likes = likes.filter((id) => id !== currentUser._id);
      } else {
        post.likes.push(currentUser._id);
      }
      onPostUpdated?.();
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to toggle like");
      if (error.response?.status === 401) {
        navigate("/auth");
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate("/auth");
      return;
    }
    if (!commentText.trim()) return;

    try {
      const response = await createComment(_id, commentText);
      setComments([...comments, response.data.comment]);
      setCommentText("");
      onPostUpdated?.();
      toast.success("Comment added");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
      if (error.response?.status === 401) {
        navigate("/auth");
      }
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    setIsDeleting(true);
    try {
      await deletePost(_id);
      onPostDeleted?.(_id);
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    } finally {
      setIsDeleting(false);
      setShowOptions(false);
    }
  };

  const handleViewProfile = () => {
    if (userId?._id) {
      navigate(`/user/${userId._id}`);
    }
  };

  const toggleOptions = (e) => {
    e.stopPropagation();
    setShowOptions(!showOptions);
  };

  // Close options when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setShowOptions(false);
    if (showOptions) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showOptions]);

  if (isEditing) {
    return (
      <EditPost
        post={post}
        onCancel={() => setIsEditing(false)}
        onSave={(updatedPost) => {
          setIsEditing(false);
          // Update the local post data with the response
          Object.assign(post, updatedPost);
          onPostUpdated?.(updatedPost); // Pass the updated post to parent
          toast.success("Post updated successfully");
        }}
      />
    );
  }

  const renderOptionsMenu = () => {
    if (!showOptions) return null;
  
    
    return (
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Always show View Profile */}
        <button
          onClick={() => {
            handleViewProfile();
            setShowOptions(false);
          }}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
        >
          View Profile
        </button>
  
        {/* Show Edit/Delete when:
            1. On any page AND user is author
            2. OR specifically on profile pages regardless of author */}
        {(isAuthor || isProfilePage) && (
          <>
            <button
              onClick={() => {
                setIsEditing(true);
                setShowOptions(false);
              }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              Edit Post
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={`block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left ${
                isDeleting ? "opacity-50" : ""
              }`}
            >
              {isDeleting ? "Deleting..." : "Delete Post"}
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6 w-full max-w-2xl mx-auto">
      {/* User Info with Three Dots Menu */}
      <div className="flex items-center justify-between mb-4">
        <div
          className="flex items-center cursor-pointer group"
          onClick={handleViewProfile}
        >
          {userId?.profilePic ? (
            <img
              src={userId.profilePic}
              alt={userId.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-white group-hover:ring-blue-200 transition-all"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold text-lg group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
              {userId?.name?.[0]?.toUpperCase() || "U"}
            </div>
          )}
          <div className="ml-3">
            <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
              {userId?.name}
            </p>
            <p className="text-xs text-gray-500">{postDate}</p>
          </div>
        </div>

        {/* Three-dot menu */}
        <div className="relative">
          <button
            className="p-1.5 rounded-full hover:bg-gray-100 focus:outline-none transition-colors"
            onClick={toggleOptions}
            aria-label="Post options"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          {renderOptionsMenu()}
        </div>
      </div>

      {/* Post Content */}
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-700 mb-4 whitespace-pre-line">{content}</p>
      {image && (
        <img
          src={image}
          alt="Post"
          className="w-full rounded-lg object-cover mb-4 max-h-[400px] border border-gray-100"
          loading="lazy"
        />
      )}

      {/* Action Buttons */}
      <div className="flex justify-between text-gray-600 text-sm border-t border-gray-100 pt-3">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors ${
            isLiked ? "text-blue-600" : "hover:text-blue-600"
          }`}
          disabled={!currentUser}
        >
          <span>👍</span>
          <span>Like ({likes.length})</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-md hover:bg-gray-50 hover:text-blue-600 transition-colors`}
          disabled={!currentUser}
        >
          <span>💬</span>
          <span>Comment ({comments.length})</span>
        </button>
        <button
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-md hover:bg-gray-50 hover:text-blue-600 transition-colors`}
          disabled={!currentUser}
        >
          <span>🔖</span>
          <span>Save</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 border-t border-gray-100 pt-3">
          {currentUser ? (
            <form onSubmit={handleCommentSubmit} className="mb-3 flex rounded-lg overflow-hidden shadow-sm">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 border border-r-0 border-gray-200 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                disabled={!commentText.trim()}
              >
                Post
              </button>
            </form>
          ) : (
            <p className="text-sm text-gray-500 mb-3">
              Please{" "}
              <button
                onClick={() => navigate("/auth")}
                className="text-blue-600 hover:underline font-medium"
              >
                login
              </button>{" "}
              to comment
            </p>
          )}

          <div className="space-y-3">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="flex items-start">
                  <div className="flex-shrink-0">
                    <img
                      src={comment.userId?.profilePic || "/default-profile.png"}
                      alt={comment.userId?.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </div>
                  <div className="ml-2 flex-1">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="font-semibold text-sm text-gray-800">
                        {comment.userId?.name}
                      </p>
                      <p className="text-gray-700 mt-1">{comment.content}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No comments yet</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SinglePost;