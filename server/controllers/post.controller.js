const Post = require('../models/post.model');
const Comment = require('../models/comment.model');
const { uploadToCloudinary } = require('../utils/cloudinaryConfig');
// Create Post
exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        let imageUrl = null;

        if (req.file) {
            imageUrl = await uploadToCloudinary(req.file.buffer, "post_images");
        }

        const newPost = await Post.create({
            userId: req.user.id,
            title,
            content,
            image: imageUrl
        });

        res.status(201).json({ success: true, post: newPost });
    } catch (error) {
        console.error('Create Post Error:', error); // Optional: helps in debugging
        res.status(500).json({ message: 'Something went wrong while creating the post' });
    }
};

//get my posts 
exports.getMyPosts = async (req, res) => {
    try {
      const posts = await Post.find({ userId: req.user.id }).populate('userId', 'name profilePic');
      res.status(200).json({ success: true, posts });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};
  


// Get All Posts
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('userId', 'name profilePic').sort({ createdAt: -1 });
        res.status(200).json({ success: true, posts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Post
exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: "Post not found" });

        if (!post.userId.equals(req.user.id)) {
            console.log("Post User ID:", post.userId);
            console.log("Request User ID:", req.user.id);
            return res.status(403).json({ message: "You can only update your own post" });
        }

        const { title, content } = req.body;
        post.title = title || post.title;
        post.content = content || post.content;

        if (req.file) {
            post.image = await cloudinaryUpload(req.file.buffer, "post_images");
        }

        await post.save();
        res.status(200).json({ success: true, post });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Delete Post
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: "Post not found" });
        if (!post.userId.equals(req.user.id))
            return res.status(403).json({ message: "You can only delete your own post" });

        await post.deleteOne();
        res.status(200).json({ success: true, message: "Post deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Like or Unlike Post
exports.toggleLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ message: "Post not found" });

        const index = post.likes.indexOf(req.user.id);

        if (index === -1) {
            post.likes.push(req.user.id);
            await post.save();
            return res.status(200).json({ message: "Liked" });
        } else {
            post.likes.splice(index, 1);
            await post.save();
            return res.status(200).json({ message: "Unliked" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Comment on Post
exports.createComment = async (req, res) => {
    try {
        const { content, postId } = req.body;
        const newComment = await Comment.create({
            content,
            postId,
            userId: req.user.id
        });

        res.status(201).json({ success: true, comment: newComment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// posts.controller.js
exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId })
      .populate('userId', 'name username profilePic')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};