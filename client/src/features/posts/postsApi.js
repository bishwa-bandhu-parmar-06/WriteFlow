// src/features/posts/postsApi.js
import axios from "axios";

const API = axios.create({
  baseURL: `${VITE_BACKEND_URI}/posts`,
  withCredentials: true,
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createPost = (formData) => {
  return API.post('/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
export const getMyPosts = () => API.get('/myposts');
// console.log(API);
export const getAllPosts = () => API.get('/');
export const updatePost = (id, data) => API.put(`/update/${id}`, data);
export const deletePost = (id) => API.delete(`/delete/${id}`);
export const toggleLike = (id) => API.post(`/like/${id}`);
export const createComment = (postId, content) => API.post('/comment', { postId, content });