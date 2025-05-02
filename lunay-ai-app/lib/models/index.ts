import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// User Schema
const userSchema = new mongoose.Schema({
  _id: { type: String, default: () => uuidv4() },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  name: { type: String, required: true },
  avatar_url: String,
  created_at: { type: Date, default: Date.now }
});

// Agent Schema
const agentSchema = new mongoose.Schema({
  _id: { type: String, default: () => uuidv4() },
  user_id: { type: String, required: true, ref: 'User' },
  workspace_id: { type: String, ref: 'Workspace' },
  name: { type: String, required: true },
  persona: mongoose.Schema.Types.Mixed,
  config: mongoose.Schema.Types.Mixed,
  created_at: { type: Date, default: Date.now }
});

// Message Schema
const messageSchema = new mongoose.Schema({
  _id: { type: String, default: () => uuidv4() },
  agent_id: { type: String, required: true, ref: 'Agent' },
  role: { type: String, required: true, enum: ['user', 'assistant', 'system'] },
  content: { type: String, required: true },
  tool_calls: mongoose.Schema.Types.Mixed,
  created_at: { type: Date, default: Date.now }
});

// Memory Items Schema
const memoryItemSchema = new mongoose.Schema({
  _id: { type: String, default: () => uuidv4() },
  agent_id: { type: String, required: true, ref: 'Agent' },
  type: { type: String, required: true },
  content: { type: String, required: true },
  metadata: mongoose.Schema.Types.Mixed,
  created_at: { type: Date, default: Date.now }
});

// Tools Schema
const toolSchema = new mongoose.Schema({
  _id: { type: String, default: () => uuidv4() },
  name: { type: String, required: true },
  description: { type: String, required: true },
  schema: mongoose.Schema.Types.Mixed,
  handler_url: { type: String, required: true },
  created_by: { type: String, required: true, ref: 'User' },
  created_at: { type: Date, default: Date.now }
});

// Workspaces Schema
const workspaceSchema = new mongoose.Schema({
  _id: { type: String, default: () => uuidv4() },
  user_id: { type: String, required: true, ref: 'User' },
  name: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

// Teams Schema
const teamSchema = new mongoose.Schema({
  _id: { type: String, default: () => uuidv4() },
  name: { type: String, required: true },
  created_by: { type: String, required: true, ref: 'User' },
  created_at: { type: Date, default: Date.now }
});

// Team Members Schema
const teamMemberSchema = new mongoose.Schema({
  _id: { type: String, default: () => uuidv4() },
  team_id: { type: String, required: true, ref: 'Team' },
  user_id: { type: String, required: true, ref: 'User' },
  role: { type: String, required: true, enum: ['admin', 'editor', 'viewer'] },
  created_at: { type: Date, default: Date.now }
});

// Create models
export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Agent = mongoose.models.Agent || mongoose.model('Agent', agentSchema);
export const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
export const MemoryItem = mongoose.models.MemoryItem || mongoose.model('MemoryItem', memoryItemSchema);
export const Tool = mongoose.models.Tool || mongoose.model('Tool', toolSchema);
export const Workspace = mongoose.models.Workspace || mongoose.model('Workspace', workspaceSchema);
export const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);
export const TeamMember = mongoose.models.TeamMember || mongoose.model('TeamMember', teamMemberSchema);
