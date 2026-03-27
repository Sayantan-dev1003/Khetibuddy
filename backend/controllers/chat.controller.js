const ChatQuery = require('../models/ChatQuery');
const { generateChatResponse, detectLanguage } = require('../services/llm.service');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

/**
 * Create a new chat session
 * POST /chat/session
 */
exports.createChatSession = async (req, res) => {
  try {
    const sessionId = uuidv4();

    res.status(201).json({
      success: true,
      sessionId,
      message: 'Chat session created'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create session'
    });
  }
};

/**
 * Send message & get bot reply
 * POST /chat/messages
 */
exports.sendMessage = async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({
        success: false,
        message: 'sessionId and message are required'
      });
    }

    console.log(`[Chat] Session ${sessionId}: User asked: ${message.substring(0, 50)}...`);

    const userId = req.user._id || req.user.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User ID missing from token'
      });
    }

    // Detect script/language (for logging)
    const detectedScript = detectLanguage(message);
    console.log(`[Chat] Detected script: ${detectedScript}`);

    // Get previous messages for context
    const previousMessages = await ChatQuery.find({ sessionId })
      .sort({ createdAt: 1 })
      .select('role content -_id');

    // Save user message
    const savedUserMessage = await ChatQuery.create({
      sessionId,
      userId: userId,
      role: 'user',
      content: message
    });
    console.log(`[Chat] Saved user message with ID: ${savedUserMessage._id}`);

    // Generate bot response
    const botReply = await generateChatResponse(
      message,
      previousMessages
    );

    // Save bot response
    const botMessage = await ChatQuery.create({
      sessionId,
      userId: userId,
      role: 'assistant',
      content: botReply
    });
    console.log(`[Chat] Saved bot response with ID: ${botMessage._id}`);

    res.status(200).json({
      success: true,
      data: {
        user: message,
        assistant: botReply
      }
    });

  } catch (error) {
    console.error('Chat error FULL:', error);
  
    res.status(500).json({
      success: false,
      message: 'Error processing message',
      error: error.message,
      stack: error.stack
    });
  }
};

/**
 * Get chat history
 * GET /chat/messages/:sessionId
 */
exports.getMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const userId = req.user._id || req.user.id;
    const messages = await ChatQuery.find({ sessionId, userId: userId })
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
};

/**
 * Get all chat sessions with summary
 * GET /chat/sessions
 */
exports.getChatSessions = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    // Get all unique sessionIds
    const sessions = await ChatQuery.aggregate([
      {
        $match: { role: 'user', userId: new mongoose.Types.ObjectId(userId) }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: '$sessionId',
          lastMessage: { $first: '$content' },
          lastMessageDate: { $first: '$createdAt' },
          messageCount: { $sum: 1 }
        }
      },
      {
        $sort: { lastMessageDate: -1 }
      },
      {
        $limit: 50
      },
      {
        $project: {
          sessionId: '$_id',
          preview: {
            $substr: ['$lastMessage', 0, 60]
          },
          lastMessageDate: 1,
          messageCount: 1,
          _id: 0
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: sessions
    });
  } catch (error) {
    console.error('Get chat sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chat sessions'
    });
  }
};

/**
 * Delete a chat session
 * DELETE /chat/sessions/:sessionId
 */
exports.deleteChatSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const userId = req.user._id || req.user.id;
    await ChatQuery.deleteMany({ sessionId, userId: userId });

    res.status(200).json({
      success: true,
      message: 'Chat session deleted successfully'
    });
  } catch (error) {
    console.error('Delete chat session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete chat session'
    });
  }
};
