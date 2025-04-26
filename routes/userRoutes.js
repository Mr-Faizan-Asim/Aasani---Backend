// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.post('/signup', userController.registerUser);
router.post('/signin', userController.authUser);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:token', userController.resetPassword);

router.get('/', protect, userController.getAllUsers);
router.get('/email/:email', protect, userController.getUserByEmail);
router.get('/id/:email', protect, userController.getUserIdByEmail);
router.put('/:id', protect, userController.updateUser);
router.delete('/:id', protect, userController.deleteUser);

module.exports = router;