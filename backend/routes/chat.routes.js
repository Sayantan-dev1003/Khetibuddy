const express = require('express');
const router = express.Router();

const {
  createChatSession,
  sendMessage,
  getMessages,
  getChatSessions,
  deleteChatSession
} = require('../controllers/chat.controller');
const { protect } = require('../middlewares/auth.middleware');

// Apply protection to all chat routes
router.use(protect);


// Create a new chat session
router.post('/session', createChatSession);

// Send a message
router.post('/messages', sendMessage);

// Get all chat sessions
router.get('/sessions', getChatSessions);

// Get messages by sessionId
router.get('/messages/:sessionId', getMessages);

// Delete a chat session
router.delete('/sessions/:sessionId', deleteChatSession);

module.exports = router;
