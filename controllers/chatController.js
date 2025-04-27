// controllers/chatController.js
const Chat = require('../models/Chat');

exports.getUserChats = async (req, res) => {
  try {
    const { userId } = req.params;
    const chats = await Chat.find({ participants: userId })
      .populate('participants', 'name email')
      .populate('messages.sender', 'name');
    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.startChat = async (req, res) => {
  try {
    const { userIds } = req.body; // array of two user IDs
    let chat = await Chat.findOne({ participants: { $all: userIds, $size: 2 } });
    if (!chat) {
      chat = new Chat({ participants: userIds, messages: [] });
      await chat.save();
    }
    res.json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId)
      .populate('participants', 'name email')
      .populate('messages.sender', 'name');
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    res.json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.postMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { sender, content } = req.body;
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    chat.messages.push({ sender, content });
    await chat.save();
    const message = chat.messages[chat.messages.length - 1];
    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

