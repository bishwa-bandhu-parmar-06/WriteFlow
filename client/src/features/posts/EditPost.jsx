import React, { useState, useRef } from 'react';
import { updatePost } from '../posts/postsApi';
import { toast } from 'react-toastify';

const EditPost = ({ post, onCancel, onSave }) => {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [image, setImage] = useState(post.image);
  const [newImageFile, setNewImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (newImageFile) {
        formData.append('image', newImageFile);
      } else if (!image) {
        formData.append('removeImage', 'true');
      }
      
      await updatePost(post._id, formData);
      onSave();
      toast.success('Post updated successfully');
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6 w-full max-w-2xl mx-auto">
      <h3 className="text-lg font-bold mb-4">Edit Post</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            rows="4"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Image</label>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="w-full border rounded-lg px-3 py-2 text-left mb-2 hover:bg-gray-50"
          >
            {newImageFile ? 'Change Image' : 'Upload New Image'}
          </button>
          {image && (
            <div className="mt-2">
              <img src={image} alt="Current" className="max-h-40 rounded-lg mb-2" />
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setNewImageFile(null);
                }}
                className="text-red-600 text-sm hover:underline"
              >
                Remove Image
              </button>
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;