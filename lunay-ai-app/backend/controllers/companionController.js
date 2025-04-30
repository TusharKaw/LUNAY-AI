const asyncHandler = require('express-async-handler');
const Companion = require('../models/Companion');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

// @desc    Create a new companion
// @route   POST /api/companions
// @access  Private
const createCompanion = asyncHandler(async (req, res) => {
  const {
    name,
    gender,
    avatar,
    voice,
    personality,
    backstory
  } = req.body;

  // Check user's subscription for companion limits
  const subscription = await Subscription.findOne({ user: req.user._id });
  const userCompanions = await Companion.countDocuments({ user: req.user._id });
  
  if (userCompanions >= subscription.features.maxCompanions) {
    res.status(403);
    throw new Error(`Your ${subscription.plan} plan allows a maximum of ${subscription.features.maxCompanions} companions`);
  }

  // Create companion
  const companion = await Companion.create({
    user: req.user._id,
    name,
    gender,
    avatar,
    voice,
    personality,
    backstory
  });

  if (companion) {
    // Add companion to user's companions array
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { companions: companion._id } }
    );

    res.status(201).json(companion);
  } else {
    res.status(400);
    throw new Error('Invalid companion data');
  }
});

// @desc    Get all user's companions
// @route   GET /api/companions
// @access  Private
const getCompanions = asyncHandler(async (req, res) => {
  const companions = await Companion.find({ user: req.user._id });
  res.json(companions);
});

// @desc    Get companion by ID
// @route   GET /api/companions/:id
// @access  Private
const getCompanionById = asyncHandler(async (req, res) => {
  const companion = await Companion.findById(req.params.id);

  if (companion && companion.user.toString() === req.user._id.toString()) {
    res.json(companion);
  } else {
    res.status(404);
    throw new Error('Companion not found');
  }
});

// @desc    Update companion
// @route   PUT /api/companions/:id
// @access  Private
const updateCompanion = asyncHandler(async (req, res) => {
  const companion = await Companion.findById(req.params.id);

  if (companion && companion.user.toString() === req.user._id.toString()) {
    // Check if advanced personality features are allowed based on subscription
    const subscription = await Subscription.findOne({ user: req.user._id });
    
    if (req.body.personality && req.body.personality.traits && !subscription.features.advancedPersonality) {
      res.status(403);
      throw new Error('Advanced personality customization requires a premium subscription');
    }

    // Update fields
    companion.name = req.body.name || companion.name;
    companion.gender = req.body.gender || companion.gender;
    
    if (req.body.avatar) {
      // Check if exclusive avatars are allowed
      if (req.body.avatar.modelId && req.body.avatar.modelId.startsWith('exclusive_') && !subscription.features.exclusiveAvatars) {
        res.status(403);
        throw new Error('Exclusive avatars require an ultimate subscription');
      }
      
      companion.avatar = {
        ...companion.avatar,
        ...req.body.avatar
      };
    }
    
    if (req.body.voice) {
      companion.voice = {
        ...companion.voice,
        ...req.body.voice
      };
    }
    
    if (req.body.personality) {
      companion.personality = {
        ...companion.personality,
        ...req.body.personality
      };
    }
    
    companion.backstory = req.body.backstory || companion.backstory;
    companion.currentMood = req.body.currentMood || companion.currentMood;

    const updatedCompanion = await companion.save();
    res.json(updatedCompanion);
  } else {
    res.status(404);
    throw new Error('Companion not found');
  }
});

// @desc    Delete companion
// @route   DELETE /api/companions/:id
// @access  Private
const deleteCompanion = asyncHandler(async (req, res) => {
  const companion = await Companion.findById(req.params.id);

  if (companion && companion.user.toString() === req.user._id.toString()) {
    await companion.remove();
    
    // Remove companion from user's companions array
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { companions: companion._id } }
    );
    
    res.json({ message: 'Companion removed' });
  } else {
    res.status(404);
    throw new Error('Companion not found');
  }
});

// @desc    Update companion mood
// @route   PATCH /api/companions/:id/mood
// @access  Private
const updateCompanionMood = asyncHandler(async (req, res) => {
  const { mood } = req.body;
  
  if (!mood) {
    res.status(400);
    throw new Error('Mood is required');
  }
  
  const companion = await Companion.findById(req.params.id);

  if (companion && companion.user.toString() === req.user._id.toString()) {
    companion.currentMood = mood;
    companion.lastInteraction = Date.now();
    
    const updatedCompanion = await companion.save();
    res.json({
      _id: updatedCompanion._id,
      name: updatedCompanion.name,
      currentMood: updatedCompanion.currentMood,
      lastInteraction: updatedCompanion.lastInteraction
    });
  } else {
    res.status(404);
    throw new Error('Companion not found');
  }
});

module.exports = {
  createCompanion,
  getCompanions,
  getCompanionById,
  updateCompanion,
  deleteCompanion,
  updateCompanionMood,
};