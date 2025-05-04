

const User = require('../models/users.model');

module.exports.followUser = async (req, res) => {
    try {
        const { userIdToFollow } = req.body;
        const currentUserId = req.user.id;

        // Check if already following
        const currentUser = await User.findById(currentUserId);
        if (currentUser.following.includes(userIdToFollow)) {
            return res.status(400).json({ message: "Already following this user" });
        }

        // Follow the user
        currentUser.following.push(userIdToFollow);
        await currentUser.save();

        const userToFollow = await User.findById(userIdToFollow);
        userToFollow.followers.push(currentUserId);
        await userToFollow.save();

        res.status(200).json({ success: true, message: "Followed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.unfollowUser = async (req, res) => {
    try {
        const { userIdToUnfollow } = req.body;
        const currentUserId = req.user.id;

        // Check if currently following
        const currentUser = await User.findById(currentUserId);
        if (!currentUser.following.includes(userIdToUnfollow)) {
            return res.status(400).json({ message: "Not following this user" });
        }

        // Unfollow the user
        currentUser.following = currentUser.following.filter(id => id.toString() !== userIdToUnfollow);
        await currentUser.save();

        const userToUnfollow = await User.findById(userIdToUnfollow);
        userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== currentUserId);
        await userToUnfollow.save();

        res.status(200).json({ success: true, message: "Unfollowed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
