const express = require('express');
const router = express.Router();
const {
  generateVoice,
  getVoiceOptions
} = require('../controllers/voiceController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.post('/', protect, generateVoice);
router.get('/options', protect, getVoiceOptions);

module.exports = router;