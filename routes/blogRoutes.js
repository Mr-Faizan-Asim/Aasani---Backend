// routes/blogRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createBlog,
  getAllBlogs,
  getBlogById
} = require('../controllers/blogController');

router.route('/')
  .get(getAllBlogs)
  .post(protect, createBlog);

router.get('/:id', getBlogById);

module.exports = router;