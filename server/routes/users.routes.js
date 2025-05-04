const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller');
const {followUser, unfollowUser} = require('../controllers/followAndFollwers');
const authenticate = require('../middleware/authMiddleware');

const upload = require('../middleware/upload'); // adjust path if needed


// Register User
router.post('/register', userController.registerUser);
router.post('/verify-email', userController.verifyEmail);

// Login User
router.post('/login', userController.loginUser);
router.post('/verify-login-otp', userController.verifyLoginOTP);
router.post('/resend-otp', userController.resendOTP);
// Logout User (optional)
router.post('/logout', authenticate, userController.logoutUser);

// Update Profile (with images)
router.put(
    '/update-profile',
    authenticate,
    upload.fields([
      { name: 'profilePic', maxCount: 1 },
      { name: 'bannerImage', maxCount: 1 }
    ]),
    userController.updateProfile
  );

// Delete Profile
router.delete('/delete-profile', authenticate, userController.deleteProfile);


// Get Profiles
router.get('/profiles', userController.getAllProfiles); // public or use `protect` if needed
router.get('/profiles/:id', userController.getProfileById); // public or use `protect` if needed


// routes/users.js
router.get('/public-profile/:userId', userController.getPublicProfile);
// Follow User
router.post('/follow', authenticate,followUser);

// Unfollow User
router.post('/unfollow', authenticate, unfollowUser);

module.exports = router;
