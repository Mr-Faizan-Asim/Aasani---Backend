const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Create or retrieve a chat
router.post('/chat', chatController.createOrGetChat);

// Send a message
router.post('/message', chatController.sendMessage);

// Get messages from a chat
router.get('/messages/:chatId', chatController.getMessages);

module.exports = router;
