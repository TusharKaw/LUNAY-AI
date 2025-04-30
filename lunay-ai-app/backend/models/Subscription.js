const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  plan: {
    type: String,
    enum: ['free', 'premium', 'ultimate'],
    required: true,
    default: 'free'
  },
  status: {
    type: String,
    enum: ['active', 'canceled', 'past_due', 'trialing', 'unpaid'],
    default: 'active'
  },
  features: {
    maxCompanions: {
      type: Number,
      default: function() {
        return this.plan === 'free' ? 1 : 
               this.plan === 'premium' ? 3 : 10;
      }
    },
    voiceMinutesPerMonth: {
      type: Number,
      default: function() {
        return this.plan === 'free' ? 10 : 
               this.plan === 'premium' ? 100 : 500;
      }
    },
    advancedPersonality: {
      type: Boolean,
      default: function() {
        return this.plan !== 'free';
      }
    },
    exclusiveAvatars: {
      type: Boolean,
      default: function() {
        return this.plan === 'ultimate';
      }
    },
    memoryCapacity: {
      type: Number,
      default: function() {
        return this.plan === 'free' ? 100 : 
               this.plan === 'premium' ? 1000 : 10000;
      }
    }
  },
  paymentDetails: {
    provider: {
      type: String,
      enum: ['stripe', 'paddle', 'none'],
      default: 'none'
    },
    customerId: String,
    subscriptionId: String,
    priceId: String,
    currency: {
      type: String,
      default: 'usd'
    }
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly', 'none'],
    default: 'none'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  currentPeriodEnd: Date,
  cancelAtPeriodEnd: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp on save
SubscriptionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);