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
