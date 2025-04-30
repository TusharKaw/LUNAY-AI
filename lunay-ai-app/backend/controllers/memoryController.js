const asyncHandler = require('express-async-handler');
const Memory = require('../models/Memory');
const Companion = require('../models/Companion');
const Subscription = require('../models/Subscription');

// @desc    Get memories for a companion
// @route   GET /api/memory/:companionId
// @access  Private
const getMemories = asyncHandler(async (req, res) => {
  const { companionId } = req.params;
  const { type, limit = 20, page = 1 } = req.query;
  
  // Verify companion belongs to user
  const companion = await Companion.findOne({
    _id: companionId,
    user: req.user._id
  });
  
  if (!companion) {
    res.status(404);
    throw new Error('Companion not found');
  }
  
  // Build query
  const query = {
    companion: companionId,
    user: req.user._id,
    isArchived: false
  };
  
  if (type) {
    query.type = type;
  }
  
  // Get memories with pagination
  const memories = await Memory.find(query)
    .sort({ importance: -1, createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  
  // Get total count for pagination
  const total = await Memory.countDocuments(query);
  
  res.json({
    memories,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// @desc    Create a new memory
// @route   POST /api/memory
// @access  Private
const createMemory = asyncHandler(async (req, res) => {
  const { companionId, type, content, importance = 5, context } = req.body;
  
  if (!content) {
    res.status(400);
    throw new Error('Memory content is required');
  }
  
  // Verify companion belongs to user
  const companion = await Companion.findOne({
    _id: companionId,
    user: req.user._id
  });
  
  if (!companion) {
    res.status(404);
    throw new Error('Companion not found');
  }
  
  // Check memory capacity based on subscription
  const subscription = await Subscription.findOne({ user: req.user._id });
  const memoryCount = await Memory.countDocuments({
    companion: companionId,
    user: req.user._id
  });
  
  if (memoryCount >= subscription.features.memoryCapacity) {
    res.status(403);
    throw new Error(`You have reached the memory capacity limit for your ${subscription.plan} plan`);
  }
  
  // Create memory
  const memory = await Memory.create({
    companion: companionId,
    user: req.user._id,
    type,
    content,
    importance,
    context: context || {}
  });
  
  res.status(201).json(memory);
});

// @desc    Update a memory
// @route   PUT /api/memory/:id
// @access  Private
const updateMemory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content, importance, context } = req.body;
  
  const memory = await Memory.findById(id);
  
  if (!memory) {
    res.status(404);
    throw new Error('Memory not found');
  }
  
  // Verify memory belongs to user's companion
  const companion = await Companion.findOne({
    _id: memory.companion,
    user: req.user._id
  });
  
  if (!companion) {
    res.status(403);
    throw new Error('Not authorized to access this memory');
  }
  
  // Update memory
  if (content) memory.content = content;
  if (importance) memory.importance = importance;
  if (context) memory.context = { ...memory.context, ...context };
  
  const updatedMemory = await memory.save();
  
  res.json(updatedMemory);
});

// @desc    Delete a memory
// @route   DELETE /api/memory/:id
// @access  Private
const deleteMemory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const memory = await Memory.findById(id);
  
  if (!memory) {
    res.status(404);
    throw new Error('Memory not found');
  }
  
  // Verify memory belongs to user's companion
  const companion = await Companion.findOne({
    _id: memory.companion,
    user: req.user._id
  });
  
  if (!companion) {
    res.status(403);
    throw new Error('Not authorized to access this memory');
  }
  
  await memory.remove();
  
  res.json({ message: 'Memory removed' });
});

// @desc    Archive a memory
// @route   PUT /api/memory/:id/archive
// @access  Private
const archiveMemory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const memory = await Memory.findById(id);
  
  if (!memory) {
    res.status(404);
    throw new Error('Memory not found');
  }
  
  // Verify memory belongs to user's companion
  const companion = await Companion.findOne({
    _id: memory.companion,
    user: req.user._id
  });
  
  if (!companion) {
    res.status(403);
    throw new Error('Not authorized to access this memory');
  }
  
  memory.isArchived = true;
  await memory.save();
  
  res.json({ message: 'Memory archived' });
});

// @desc    Search memories
// @route   GET /api/memory/search
// @access  Private
const searchMemories = asyncHandler(async (req, res) => {
  const { companionId, query } = req.query;
  
  if (!query) {
    res.status(400);
    throw new Error('Search query is required');
  }
  
  // Verify companion belongs to user
  const companion = await Companion.findOne({
    _id: companionId,
    user: req.user._id
  });
  
  if (!companion) {
    res.status(404);
    throw new Error('Companion not found');
  }
  
  // Search memories using text index
  const memories = await Memory.find({
    companion: companionId,
    user: req.user._id,
    isArchived: false,
    $text: { $search: query }
  })
    .sort({ score: { $meta: 'textScore' } })
    .limit(20);
  
  res.json(memories);
});

module.exports = {
  getMemories,
  createMemory,
  updateMemory,
  deleteMemory,
  archiveMemory,
  searchMemories,
};