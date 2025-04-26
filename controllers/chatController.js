const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');

// Create or retrieve a chat between two users
exports.createOrGetChat = async (req, res) => {
  const { email1, email2 } = req.body;

  try {
    const user1 = await User.findOne({ email: email1 });
    const user2 = await User.findOne({ email: email2 });

    if (!user1 || !user2) {
      return res.status(404).json({ message: 'One or both users not found.' });
    }

    let chat = await Chat.findOne({
      participants: { $all: [user1._id, user2._id] }
    });

    if (!chat) {
      chat = new Chat({ participants: [user1._id, user2._id] });
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Send a message in a chat
exports.sendMessage = async (req, res) => {
  const { chatId, senderEmail, content } = req.body;

  try {
    const sender = await User.findOne({ email: senderEmail });
    if (!sender) {
      return res.status(404).json({ message: 'Sender not found.' });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found.' });
    }

    const message = new Message({
      chat: chat._id,
      sender: sender._id,
      content
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Retrieve messages from a chat
exports.getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chat: chatId })
      .sort({ timestamp: 1 })
      .populate('sender', 'email');

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};
