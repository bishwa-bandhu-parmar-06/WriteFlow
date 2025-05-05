import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const postDate = new Date(createdAt).toLocaleString();
  const isLiked = currentUser && likes.includes(currentUser._id);
  const isAuthor = currentUser && currentUser._id === userId?._id;

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
        onSave={() => {
          setIsEditing(false);
          onPostUpdated?.();
          toast.success("Post updated successfully");
        }}
      />
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6 w-full max-w-2xl mx-auto">
      {/* User Info with Three Dots Menu */}
      <div className="flex items-center justify-between mb-4">
        <div
          className="flex items-center cursor-pointer"
          onClick={handleViewProfile}
        >
          {userId?.profilePic ? (
            <img
              src={userId.profilePic}
              alt={userId.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
              {userId?.name?.[0]?.toUpperCase() || "U"}
            </div>
          )}
          <div className="ml-3">
            <p className="text-sm font-semibold">{userId?.name}</p>
            <p className="text-xs text-gray-500">{postDate}</p>
          </div>
        </div>

        {/* Three-dot menu */}
        <div className="relative">
          <button
            className="p-1 rounded-full hover:bg-gray-200 focus:outline-none"
            onClick={toggleOptions}
            aria-label="Post options"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {showOptions && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  handleViewProfile();
                  setShowOptions(false);
                }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                View Profile
              </button>

              {(currentUser?._id === userId?._id?.toString() ||
                currentUser?._id === userId?.toString()) && (
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
          )}
        </div>
      </div>

      {/* Post Content */}
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-700 mb-4 whitespace-pre-line">{content}</p>
      {image && (
        <img
          src={image}
          alt="Post"
          className="w-full rounded-lg object-cover mb-4 max-h-[400px]"
          loading="lazy"
        />
      )}

      {/* Action Buttons */}
      <div className="flex justify-between text-gray-600 text-sm border-t pt-3">
        <button
          onClick={handleLike}
          className={`flex items-center hover:text-indigo-600 transition duration-150 ${
            isLiked ? "text-indigo-600" : ""
          }`}
          disabled={!currentUser}
        >
          👍 Like ({likes.length})
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="hover:text-indigo-600 transition duration-150"
          disabled={!currentUser}
        >
          💬 Comment ({comments.length})
        </button>
        <button
          className="hover:text-indigo-600 transition duration-150"
          disabled={!currentUser}
        >
          🔖 Save
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 border-t pt-3">
          {currentUser ? (
            <form onSubmit={handleCommentSubmit} className="mb-3 flex">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 disabled:opacity-50"
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
                className="text-indigo-600 hover:underline"
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
                  <img
                    src={comment.userId?.profilePic || "/default-profile.png"}
                    alt={comment.userId?.name}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <div className="bg-gray-100 rounded-lg p-2 flex-1">
                    <p className="font-semibold text-sm">
                      {comment.userId?.name}
                    </p>
                    <p className="text-gray-800">{comment.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-2">
                No comments yet
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SinglePost;
