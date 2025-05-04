import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { resendOTP } from './authApi';

const VerifyEmail = ({ email, onSubmit, isLoginVerification }) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    
    setIsLoading(true);
    try {
      await onSubmit(otp);
    } catch (error) {
      // Error is handled in parent component
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setResendDisabled(true);
      await resendOTP({ email, isLogin: isLoginVerification });
      toast.success('OTP resent successfully!');
      
      // Start countdown
      let seconds = 30;
      setCountdown(seconds);
      const timer = setInterval(() => {
        seconds -= 1;
        setCountdown(seconds);
        if (seconds <= 0) {
          clearInterval(timer);
          setResendDisabled(false);
        }
      }, 1000);
    } catch (err) {
      toast.error(err.message || 'Failed to resend OTP');
      setResendDisabled(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLoginVerification ? 'Login Verification' : 'Email Verification'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full border rounded p-2 bg-gray-100"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">OTP</label>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              className="w-full border rounded p-2"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={handleResendOTP}
            disabled={resendDisabled}
            className={`text-indigo-600 hover:text-indigo-800 ${resendDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {resendDisabled ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
          </button>
        </div>
        <p className="mt-2 text-center text-sm text-gray-600">
          Didn't receive OTP? Check your spam folder.
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;