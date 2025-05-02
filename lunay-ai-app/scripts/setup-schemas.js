const mongoose = require('mongoose');

const uri = 'mongodb+srv://luna64:Luna%401234@companion-db.g5suray.mongodb.net/?retryWrites=true&w=majority&appName=companion-db';

// User Schema
const userSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // UUID
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  name: { type: String, required: true },
  avatar_url: String,
  created_at: { type: Date, default: Date.now }
});

// Agent Schema
const agentSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // UUID
  user_id: { type: String, required: true, ref: 'User' }, // UUID reference
  workspace_id: { type: String, ref: 'Workspace' }, // Optional UUID reference
  name: { type: String, required: true },
  persona: mongoose.Schema.Types.Mixed, // JSONB for personality/role config
  config: mongoose.Schema.Types.Mixed, // JSONB for system prompt, settings, tools
  created_at: { type: Date, default: Date.now }
});

// Message Schema
const messageSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // UUID
  agent_id: { type: String, required: true, ref: 'Agent' }, // UUID reference
  role: { 
    type: String, 
    required: true,
    enum: ['user', 'assistant', 'system']
  },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

async function setupDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Successfully connected to MongoDB');

    // Create models
    const User = mongoose.model('User', userSchema);
    const Agent = mongoose.model('Agent', agentSchema);
    const Message = mongoose.model('Message', messageSchema);

    // Create collections
    await User.createCollection();
    console.log('Created users collection');
    
    await Agent.createCollection();
    console.log('Created agents collection');
    
    await Message.createCollection();
    console.log('Created messages collection');

    // Create indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    console.log('Created index on users.email');

    await Agent.collection.createIndex({ user_id: 1 });
    console.log('Created index on agents.user_id');

    await Message.collection.createIndex({ agent_id: 1 });
    console.log('Created index on messages.agent_id');

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Helper function to generate UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

setupDatabase();
