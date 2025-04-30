const mongoose = require('mongoose');

const MemorySchema = new mongoose.Schema({
  companion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Companion',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['fact', 'preference', 'event', 'relationship', 'mood'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  importance: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  associatedConversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
  },
  context: {
    location: String,
    activity: String,
    relatedMemories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Memory'
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastRecalled: {
    type: Date
  },
  recallCount: {
    type: Number,
    default: 0
  },
  isArchived: {
    type: Boolean,
    default: false
  }
});

// Create indexes for efficient querying
MemorySchema.index({ companion: 1, type: 1, importance: -1 });
MemorySchema.index({ companion: 1, createdAt: -1 });
MemorySchema.index({ content: 'text' }); // Text index for searching memory content

module.exports = mongoose.model('Memory', MemorySchema);