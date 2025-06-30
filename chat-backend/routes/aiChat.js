module.exports = (io) => {
  const express = require('express');
  const router = express.Router();
  const axios = require('axios');
  const Message = require('../models/Message');
  const { encrypt } = require('../utils/encrypt');
  const { sanitizeInput } = require('../utils/sanitize');
  const { rateLimiter } = require('../utils/rateLimiter');

  // POST /api/ai-chat
  router.post('/', rateLimiter, async (req, res) => {
    const { userId, message } = req.body;
    if (!userId || !message) return res.status(400).json({ error: 'Missing userId or message' });
    try {
      const cleanMessage = sanitizeInput(message);
      // Save user message
      await Message.create({
        senderId: userId,
        receiverId: 'ai',
        content: encrypt(cleanMessage),
        isAI: false
      });

      // Set up SSE
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      // Stream LLM response (Ollama example)
      const llmStream = await axios({
        method: 'post',
        url: 'http://localhost:11434/api/generate', // Change for your LLM
        data: { prompt: cleanMessage, stream: true },
        responseType: 'stream',
        timeout: 60000
      });

      let aiResponse = '';
      llmStream.data.on('data', chunk => {
        const text = chunk.toString();
        aiResponse += text;
        res.write(`data: ${text}\n\n`);
        // Emit to user's Socket.IO room
        io.to(userId).emit('ai_stream', { content: text });
      });
      llmStream.data.on('end', async () => {
        // Save AI response
        await Message.create({
          senderId: 'ai',
          receiverId: userId,
          content: encrypt(aiResponse),
          isAI: true
        });
        res.end();
      });
      llmStream.data.on('error', () => res.end());
    } catch (err) {
      res.status(500).json({ error: 'AI chat failed' });
    }
  });

  return router;
}; 