require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  // Placeholder for message events
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Import routers
const messagesRouter = require('./routes/messages');
const aiChatRouter = require('./routes/aiChat')(io);

// Use routers
app.use('/api/messages', messagesRouter);
app.use('/api/ai-chat', aiChatRouter);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 