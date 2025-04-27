// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Get all chats for a user
router.get('/user/:userId', chatController.getUserChats);
// Start or retrieve a one-on-one chat
router.post('/start', chatController.startChat);
// Get a single chat
router.get('/:chatId', chatController.getChatById);
// Send a new message
router.post('/:chatId/message', chatController.postMessage);

module.exports = router;
