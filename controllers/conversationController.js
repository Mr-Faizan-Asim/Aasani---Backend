// controllers/conversationController.js
const Conversation = require('../models/Conversation');

exports.initiateConversation = async (req, res) => {
  const { recipientId } = req.body;
  const senderId = req.user._id;

  try {
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] }
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, recipientId],
        messages: []
      });
      await conversation.save();
    }

    res.json(conversation);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


// controllers/conversationController.js
exports.sendMessage = async (req, res) => {
    const { conversationId } = req.params;
    const { content } = req.body;
    const senderId = req.user._id;
  
    try {
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) return res.status(404).json({ message: 'Conversation not found' });
  
      conversation.messages.push({ sender: senderId, content });
      conversation.lastUpdated = Date.now();
      await conversation.save();
  
      res.json(conversation);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  

  // controllers/conversationController.js
exports.getUserConversations = async (req, res) => {
    const userId = req.user._id;
  
    try {
      const conversations = await Conversation.find({
        participants: userId
      })
        .populate('participants', 'name email')
        .sort({ lastUpdated: -1 });
  
      res.json(conversations);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  