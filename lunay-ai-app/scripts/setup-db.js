const mongoose = require('mongoose');

const uri = 'mongodb+srv://luna64:Luna%401234@companion-db.g5suray.mongodb.net/?retryWrites=true&w=majority&appName=companion-db';

// Define schemas
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: String,
  loginMethod: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const companionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  appearance: {
    avatar: String,
    style: String
  },
  personality: {
    traits: [String],
    background: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const conversationSchema = new mongoose.Schema({
  companionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Companion', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [{
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    voiceMetadata: {
      audioUrl: String,
      duration: Number
    },
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const moodSchema = new mongoose.Schema({
  companionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Companion', required: true },
  currentMood: String,
  memories: [{
    type: String,
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tier: { type: String, enum: ['free', 'premium', 'pro'], default: 'free' },
  status: { type: String, enum: ['active', 'inactive', 'cancelled'], default: 'active' },
  billingInfo: {
    nextBillingDate: Date,
    amount: Number,
    currency: { type: String, default: 'USD' }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

async function setupDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Successfully connected to MongoDB');

    // Create models
    const User = mongoose.model('User', userSchema);
    const Companion = mongoose.model('Companion', companionSchema);
    const Conversation = mongoose.model('Conversation', conversationSchema);
    const Mood = mongoose.model('Mood', moodSchema);
    const Subscription = mongoose.model('Subscription', subscriptionSchema);

    // Create collections
    await User.createCollection();
    console.log('Created users collection');
    
    await Companion.createCollection();
    console.log('Created companions collection');
    
    await Conversation.createCollection();
    console.log('Created conversations collection');
    
    await Mood.createCollection();
    console.log('Created moods collection');
    
    await Subscription.createCollection();
    console.log('Created subscriptions collection');

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

setupDatabase();
