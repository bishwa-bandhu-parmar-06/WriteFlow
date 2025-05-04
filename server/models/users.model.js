const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true
    },
    profilePic: {
        type: String, // URL of profile pic (can be stored in Cloudinary)
        default: ''
    },
    bannerImage: {
        type: String, // URL of banner image (can be stored in Cloudinary)
        default: ''
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Role can be user or admin
        default: 'user'
    },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    verified: {
        type: Boolean,
        default: false
      },
      otp: {
        type: String,
      },
      otpExpiry: {
        type: Date,
      }
      
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
