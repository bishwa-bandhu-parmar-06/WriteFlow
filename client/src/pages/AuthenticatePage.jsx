import React, { useState } from 'react';
import Login from "../features/auth/Login";
import { toast } from 'react-toastify';
import Register from "../features/auth/Register";
import VerifyEmail from "../features/auth/VerifyEmail";
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, verifyEmail, verifyLoginOTP } from "../features/auth/authApi.js"

const AuthenticatePage = () => {
  const [step, setStep] = useState("login");
  const [email, setEmail] = useState("");
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const handleLoginSubmit = async (userEmail) => {
    try {
      // toast.info('Sending OTP to your email...');
      await loginUser({ email: userEmail });
      setEmail(userEmail);
      setStep("verifyLogin");
      toast.success('OTP sent successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to send OTP');
    }
  };

  const handleRegisterSubmit = async (formData) => {
    try {
      // toast.info('Registering your account...');
      await registerUser(formData);
      setEmail(formData.email);
      setUserData(formData);
      setStep("verifyEmail");
      toast.success('OTP sent to your email.');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    }
  };

  const handleVerifyEmail = async (otp) => {
    try {
      // toast.info('Verifying your email...');
      // Only verify email, don't try to login
      const response = await verifyEmail({ email, otp });
      
      // Store token from verification response
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      toast.success('Email verified successfully!');
      navigate("/profile");
    } catch (err) {
      toast.error(err.message || 'Verification failed');
    }
  };

  const handleVerifyLogin = async (otp) => {
    try {
      // toast.info('Verifying OTP...');
      const { token, user } = await verifyLoginOTP({ email, otp });
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      toast.success('Login successful!');
      navigate("/profile");
    } catch (err) {
      toast.error(err.message || 'Login verification failed');
    }
  };

  return (
    <div className="auth-container">
      {step === "login" && (
        <Login
          onRegisterClick={() => setStep("register")}
          onSubmit={handleLoginSubmit}
        />
      )}

      {step === "register" && (
        <Register
          onLoginClick={() => setStep("login")}
          onSubmit={handleRegisterSubmit}
        />
      )}

      {step === "verifyLogin" && (
        <VerifyEmail
          email={email}
          onSubmit={handleVerifyLogin}
          isLoginVerification={true}
        />
      )}

      {step === "verifyEmail" && (
        <VerifyEmail
          email={email}
          onSubmit={handleVerifyEmail}
          isLoginVerification={false}
        />
      )}
    </div>
  );
};

export default AuthenticatePage;