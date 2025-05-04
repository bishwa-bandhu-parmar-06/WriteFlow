const User = require('../models/users.model');
const { generateToken } = require('../utils/jwtHelpers');
const { uploadToCloudinary } = require('../utils/cloudinaryConfig');
const sendEmail = require("../utils/nodemailer");
const mongoose = require('mongoose');
// const User = require('../models/users.model');
const Post = require('../models/post.model');

// Register User
module.exports.registerUser = async (req, res) => {
    const { username, name, email, mobile } = req.body;
  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
  
    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  
      const newUser = new User({
        username,
        name,
        email,
        mobile,
        otp,
        otpExpiry: Date.now() + 10 * 60 * 1000, // OTP valid for 10 mins
      });
  
      await newUser.save();
  
      await sendEmail(
        email,
        'Verify your email',
        `Your OTP to verify email is: ${otp}`
      );
  
      res.status(201).json({
        success: true,
        message: 'User registered. Please verify your email using the OTP sent.',
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };



  module.exports.verifyEmail = async (req, res) => {
    const { email, otp } = req.body;
  
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    if (user.verified) {
      return res.status(400).json({ message: 'Email already verified' });
    }
  
    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
  
    user.verified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
  
    // Generate token for automatic login after verification
    const token = generateToken(user._id, user.role);
    res.status(200).json({ 
      success: true, 
      token, 
      user, 
      message: 'Email verified successfully' 
    });
  };
  
// Login User
module.exports.loginUser = async (req, res) => {
    const { email } = req.body;
  
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    if (!user.verified) {
      return res.status(400).json({ message: 'Please verify your email before logging in' });
    }
  
    // Send OTP to email
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();
  
    await sendEmail(
      email,
      'Login OTP',
      `Your login OTP is: ${otp}`
    );
  
    res.status(200).json({ success: true, message: 'OTP sent to your email' });
  };

  module.exports.verifyLoginOTP = async (req, res) => {
    const { email, otp } = req.body;
  
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
  
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
  
    const token = generateToken(user._id, user.role);
    res.status(200).json({ success: true, token, user, message: 'Login successful' });
  };
  
// Resend OTP
module.exports.resendOTP = async (req, res) => {
  const { email, isLogin } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const emailSubject = isLogin ? 'Login OTP' : 'Email Verification OTP';
    await sendEmail(email, emailSubject, `Your OTP is: ${otp}`);

    res.status(200).json({ 
      success: true, 
      message: 'OTP resent successfully' 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Edit User Profile
module.exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { name, username, mobile } = req.body;
        let profilePicUrl = user.profilePic;
        let bannerImageUrl = user.bannerImage;

        // ✅ Optional chaining (safe access)
if (req.files?.profilePic?.[0]) {
    const profilePicResult = await uploadToCloudinary(req.files.profilePic[0].buffer, "profile_photos");
    profilePicUrl = profilePicResult;
}

if (req.files?.bannerImage?.[0]) {
    const bannerImageResult = await uploadToCloudinary(req.files.bannerImage[0].buffer, "banner_images");
    bannerImageUrl = bannerImageResult;
}

        user.name = name || user.name;
        user.username = username || user.username;
        user.mobile = mobile || user.mobile;
        user.profilePic = profilePicUrl;
        user.bannerImage = bannerImageUrl;

        await user.save();
        res.status(200).json({ success: true, message: "Profile updated", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete User Profile
module.exports.deleteProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ success: true, message: 'User profile deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Logout User (Optional, JWT-based logout)
module.exports.logoutUser = (req, res) => {
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};


// Get All User Profiles (Protected/Admin or Public depending on logic)
module.exports.getAllProfiles = async (req, res) => {
    try {
        const users = await User.find().select('-otp -otpExpiry'); // exclude sensitive fields
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Single User Profile by ID
module.exports.getProfileById = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId || userId === 'null' || userId === 'undefined') {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const user = await User.findById(userId)
      .select('-otp -otpExpiry -password')
      .populate('followers following', 'name username profilePic');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





// users.controller.js
// users.controller.js
exports.getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password -email -__v');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await Post.find({ userId: user._id })
      .populate('userId', 'name profilePic')
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      user,
      posts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};