const mongoose = require('mongoose');

const PersonalityTraitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  }
});

const CompanionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Companion name is required'],
    trim: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'non-binary', 'other'],
    required: true
  },
  avatar: {
    type: {
      type: String,
      enum: ['2d', '3d'],
      default: '2d'
    },
    modelId: String, // Reference to avatar model in external service
    customization: {
      skinTone: String,
      hairStyle: String,
      hairColor: String,
      eyeColor: String,
      outfitId: String
    }
  },
  voice: {
    provider: {
      type: String,
      enum: ['elevenlabs', 'playht', 'none'],
      default: 'none'
    },
    voiceId: String,
    settings: {
      stability: Number,
      similarity: Number,
      style: Number,
      speed: Number
    }
  },
  personality: {
    type: {
      type: String,
      enum: ['romantic', 'friendly', 'sarcastic', 'adventurous', 'intellectual', 'supportive', 'playful', 'mysterious', 'custom'],
      required: true
    },
    traits: [PersonalityTraitSchema],
    description: String
  },
  backstory: {
    type: String,
    maxlength: 2000
  },
  memoryStrength: {
    type: Number,
    min: 1,
    max: 10,
    default: function() {
      // Memory strength depends on user subscription
      return this.user.subscription.type === 'free' ? 3 : 
             this.user.subscription.type === 'premium' ? 7 : 10;
    }
  },
  favoriteThings: [{
    category: String,
    items: [String]
  }],
  currentMood: {
    type: String,
    enum: ['happy', 'sad', 'excited', 'calm', 'anxious', 'loving', 'playful', 'thoughtful', 'neutral'],
    default: 'neutral'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastInteraction: {
    type: Date
  }
});

// Update the updatedAt timestamp on save
CompanionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Companion', CompanionSchema);