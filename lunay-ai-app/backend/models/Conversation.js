const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'companion'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    enum: ['text', 'voice', 'image'],
    default: 'text'
  },
  mediaUrl: String, // For voice messages or images
  emotions: {
    primary: String,
    secondary: String,
    intensity: Number
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  }
});

const ConversationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Companion',
    required: true
  },
  messages: [MessageSchema],
  context: {
    type: String, // Current conversation context for AI
    maxlength: 10000
  },
  scenario: {
    type: String, // Optional roleplay scenario
    default: 'casual'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isArchived: {
    type: Boolean,
    default: false
  }
});

// Update the updatedAt timestamp on save
ConversationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create a compound index for efficient queries
ConversationSchema.index({ user: 1, companion: 1, createdAt: -1 });

module.exports = mongoose.model('Conversation', ConversationSchema);