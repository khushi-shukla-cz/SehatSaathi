const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { encrypt, decrypt } = require('../utils/encrypt');
const { sanitizeInput } = require('../utils/sanitize');
const { rateLimiter } = require('../utils/rateLimiter');

// Get messages between two users
router.get('/', rateLimiter, async (req, res) => {
  const { user1, user2 } = req.query;
  if (!user1 || !user2) return res.status(400).json({ error: 'Missing user IDs' });
  try {
    const messages = await Message.find({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 }
      ]
    }).sort({ timestamp: 1 });
    // Decrypt content
    const result = messages.map(msg => ({
      ...msg.toObject(),
      content: decrypt(msg.content)
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Save a new message
router.post('/', rateLimiter, async (req, res) => {
  const { senderId, receiverId, content, isAI } = req.body;
  if (!senderId || !receiverId || !content) return res.status(400).json({ error: 'Missing fields' });
  try {
    const cleanContent = sanitizeInput(content);
    const encryptedContent = encrypt(cleanContent);
    const message = await Message.create({
      senderId,
      receiverId,
      content: encryptedContent,
      isAI: !!isAI
    });
    res.status(201).json({ ...message.toObject(), content: cleanContent });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save message' });
  }
});

module.exports = router; 