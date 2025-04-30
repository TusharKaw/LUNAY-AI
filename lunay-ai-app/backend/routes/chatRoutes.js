const express = require('express');
const router = express.Router();
const {
  getConversationHistory,
  sendMessage,
  archiveConversation,
  createScenario
} = require('../controllers/chatController');
const { protect, checkSubscription } = require('../middleware/authMiddleware');

// All routes are protected
router.get('/:companionId', protect, getConversationHistory);
router.post('/', protect, sendMessage);
router.put('/:conversationId/archive', protect, archiveConversation);

// Scenario creation requires premium subscription
router.post('/scenario', protect, checkSubscription('premium'), createScenario);

module.exports = router;