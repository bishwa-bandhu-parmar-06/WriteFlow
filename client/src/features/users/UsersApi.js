// src/features/users/usersApi.js
import axios from "axios";
const backenduri = import.meta.env.VITE_BACKEND_URI;
console.log(backenduri)
const API = axios.create({
  baseURL: `${backenduri}/api/users`,
  withCredentials: true,
});

// Add request interceptor to include token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// Profile APIs
export const getProfile = (userId) => {
    if (!userId) {
      return Promise.reject(new Error('User ID is required'));
    }
    return API.get(`/profiles/${userId}`);
};
export const updateProfile = (data) => API.put('/update-profile', data);
export const deleteProfile = () => API.delete('/delete-profile');
export const logout = () => API.post('/logout');

export const getPublicProfile = (userId) => API.get(`/public-profile/${userId}`);

// Follow/Unfollow APIs
export const followUser = (userId) => API.post('/follow', { userIdToFollow: userId });
export const unfollowUser = (userId) => API.post('/unfollow', { userIdToUnfollow: userId });

// Get all users
export const getAllUsers = () => API.get('/profiles');