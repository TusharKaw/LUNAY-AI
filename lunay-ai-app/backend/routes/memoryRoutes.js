const express = require('express');
const router = express.Router();
const {
  getMemories,
  createMemory,
  updateMemory,
  deleteMemory,
  archiveMemory,
  searchMemories
} = require('../controllers/memoryController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.route('/')
  .post(protect, createMemory);

router.get('/search', protect, searchMemories);
router.get('/:companionId', protect, getMemories);

router.route('/:id')
  .put(protect, updateMemory)
  .delete(protect, deleteMemory);

router.put('/:id/archive', protect, archiveMemory);

module.exports = router;