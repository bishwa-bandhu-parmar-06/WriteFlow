import axios from "axios";
const backenduri = import.meta.env.VITE_BACKEND_URI;
const API = axios.create({
  baseURL: `${backenduri}/api/users`,
  withCredentials: true,
});

// Register new user
export const registerUser = async (formData) => {
  try {
    const res = await API.post("/register", formData);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Something went wrong during registration" };
  }
};

// Verify Email OTP
export const verifyEmail = async (data) => {
  try {
    const res = await API.post("/verify-email", data);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Invalid or expired OTP" };
  }
};

// Login User (sends OTP)
export const loginUser = async (data) => {
  try {
    const res = await API.post("/login", data);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Login failed" };
  }
};

// Verify Login OTP
export const verifyLoginOTP = async (data) => {
  try {
    const res = await API.post("/verify-login-otp", data);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Invalid or expired login OTP" };
  }
};

export const resendOTP = async (data) => {
  try {
    const res = await API.post("/resend-otp", data);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to resend OTP" };
  }
};