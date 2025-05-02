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
  user_id: { type: String, required: true, ref: 'User' },
  workspace_id: { type: String, ref: 'Workspace' },
  name: { type: String, required: true },
  persona: mongoose.Schema.Types.Mixed, // JSONB
  config: mongoose.Schema.Types.Mixed, // JSONB
  created_at: { type: Date, default: Date.now }
});

// Message Schema
const messageSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // UUID
  agent_id: { type: String, required: true, ref: 'Agent' },
  role: { 
    type: String,
    required: true,
    enum: ['user', 'assistant', 'system']
  },
  content: { type: String, required: true },
  tool_calls: mongoose.Schema.Types.Mixed, // JSONB
  created_at: { type: Date, default: Date.now }
});

// Memory Items Schema
const memoryItemSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // UUID
  agent_id: { type: String, required: true, ref: 'Agent' },
  type: { type: String, required: true },
  content: { type: String, required: true },
  metadata: mongoose.Schema.Types.Mixed, // JSONB
  created_at: { type: Date, default: Date.now }
});

// Tools Schema
const toolSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // UUID
  name: { type: String, required: true },
  description: { type: String, required: true },
  schema: mongoose.Schema.Types.Mixed, // JSONB
  handler_url: { type: String, required: true },
  created_by: { type: String, required: true, ref: 'User' },
  created_at: { type: Date, default: Date.now }
});

// Workspaces Schema
const workspaceSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // UUID
  user_id: { type: String, required: true, ref: 'User' },
  name: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

// Teams Schema
const teamSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // UUID
  name: { type: String, required: true },
  created_by: { type: String, required: true, ref: 'User' },
  created_at: { type: Date, default: Date.now }
});

// Team Members Schema
const teamMemberSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // UUID
  team_id: { type: String, required: true, ref: 'Team' },
  user_id: { type: String, required: true, ref: 'User' },
  role: { 
    type: String,
    required: true,
    enum: ['admin', 'editor', 'viewer']
  },
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
    const MemoryItem = mongoose.model('MemoryItem', memoryItemSchema);
    const Tool = mongoose.model('Tool', toolSchema);
    const Workspace = mongoose.model('Workspace', workspaceSchema);
    const Team = mongoose.model('Team', teamSchema);
    const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

    // Create collections
    await User.createCollection();
    console.log('Created users collection');
    
    await Agent.createCollection();
    console.log('Created agents collection');
    
    await Message.createCollection();
    console.log('Created messages collection');

    await MemoryItem.createCollection();
    console.log('Created memory_items collection');

    await Tool.createCollection();
    console.log('Created tools collection');

    await Workspace.createCollection();
    console.log('Created workspaces collection');

    await Team.createCollection();
    console.log('Created teams collection');

    await TeamMember.createCollection();
    console.log('Created team_members collection');

    // Create indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    console.log('Created index on users.email');

    await Agent.collection.createIndex({ user_id: 1 });
    console.log('Created index on agents.user_id');
    await Agent.collection.createIndex({ workspace_id: 1 });
    console.log('Created index on agents.workspace_id');

    await Message.collection.createIndex({ agent_id: 1 });
    console.log('Created index on messages.agent_id');

    await MemoryItem.collection.createIndex({ agent_id: 1 });
    console.log('Created index on memory_items.agent_id');

    await Tool.collection.createIndex({ created_by: 1 });
    console.log('Created index on tools.created_by');

    await Workspace.collection.createIndex({ user_id: 1 });
    console.log('Created index on workspaces.user_id');

    await Team.collection.createIndex({ created_by: 1 });
    console.log('Created index on teams.created_by');

    await TeamMember.collection.createIndex({ team_id: 1, user_id: 1 }, { unique: true });
    console.log('Created unique index on team_members.team_id and user_id');

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

setupDatabase();
