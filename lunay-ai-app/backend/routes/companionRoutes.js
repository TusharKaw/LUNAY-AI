const express = require('express');
const router = express.Router();
const {
  createCompanion,
  getCompanions,
  getCompanionById,
  updateCompanion,
  deleteCompanion,
  updateCompanionMood
} = require('../controllers/companionController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.route('/')
  .post(protect, createCompanion)
  .get(protect, getCompanions);

router.route('/:id')
  .get(protect, getCompanionById)
  .put(protect, updateCompanion)
  .delete(protect, deleteCompanion);

router.route('/:id/mood')
  .patch(protect, updateCompanionMood);

module.exports = router;