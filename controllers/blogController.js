// controllers/blogController.js
const Blog = require('../models/Blog');

// @desc    Create a new blog post
// @route   POST /api/blogs
// @access  Private
exports.createBlog = async (req, res, next) => {
  try {
    const { title, description, providerId } = req.body;
    if (!title || !description || !providerId) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const blog = await Blog.create({
      author: req.user._id,
      provider: providerId,
      title,
      description
    });
    res.status(201).json(blog);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
exports.getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'name')
      .populate('provider', 'service email');
    res.json(blogs);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
exports.getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name')
      .populate('provider', 'service email');
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    next(err);
  }
};