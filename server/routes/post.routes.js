const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const authenticate = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const {getMyPosts} = require('../controllers/post.controller');

router.post('/create', authenticate, upload.single('image'), postController.createPost);
router.get('/', postController.getAllPosts);

router.get("/myposts", authenticate, getMyPosts);
// routes/posts.js
router.get('/user/:userId', postController.getUserPosts);
// router.put('/update/:id', authenticate, upload.single('image'), postController.updatePost);
router.put(
    '/update/:id', 
    authenticate, 
    upload.single('image'), // This handles the file upload
    postController.updatePost
  );
router.delete('/delete/:id', authenticate, postController.deletePost);
router.post('/like/:id', authenticate, postController.toggleLike);
router.post('/comment', authenticate, postController.createComment);

module.exports = router;
