const asyncHandler = require('express-async-handler');
const axios = require('axios');
const Conversation = require('../models/Conversation');
const Companion = require('../models/Companion');
const Memory = require('../models/Memory');
const Subscription = require('../models/Subscription');

// Helper function to analyze emotions in text
const analyzeEmotions = async (text) => {
  try {
    // This would typically call an emotion analysis API or use a local model
    // For now, we'll use a simple placeholder implementation
    const emotions = ['happy', 'sad', 'angry', 'excited', 'calm', 'anxious', 'loving'];
    const primary = emotions[Math.floor(Math.random() * emotions.length)];
    const secondary = emotions[Math.floor(Math.random() * emotions.length)];
    const intensity = Math.floor(Math.random() * 10) + 1;
    
    return { primary, secondary, intensity };
  } catch (error) {
    console.error('Error analyzing emotions:', error);
    return { primary: 'neutral', secondary: null, intensity: 5 };
  }
};

// Helper function to generate AI response using GPT-4
const generateAIResponse = async (prompt, companion, context, memories) => {
  try {
    // In a real implementation, this would call the OpenAI API
    // For now, we'll use a placeholder
    
    // Construct system prompt with companion personality and memories
    const personalityTraits = companion.personality.traits
      .map(trait => `${trait.name}: ${trait.value}/100`)
      .join(', ');
    
    const memoryContext = memories
      .map(memory => memory.content)
      .join('\n');
    
    const systemPrompt = `
      You are ${companion.name}, a virtual companion with the following traits:
      ${personalityTraits}
      
      Your current mood is: ${companion.currentMood}
      
      Your backstory: ${companion.backstory || 'No specific backstory.'}
      
      Important memories about your user:
      ${memoryContext || 'You are still getting to know your user.'}
      
      Respond in a way that reflects your personality and current mood.
      Keep responses concise (1-3 sentences) unless the conversation requires depth.
    `;
    
    // In a real implementation, this would be the API call:
    /*
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        ...context.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 150
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data.choices[0].message.content;
    */
    
    // Placeholder response for development
    const responses = [
      `I'm feeling ${companion.currentMood} today! What about you?`,
      `That's interesting! Tell me more about it.`,
      `I've been thinking about you. How has your day been?`,
      `I remember you mentioned that before. It's nice to talk about it again.`,
      `Based on what I know about you, I think you'd enjoy discussing this further.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  } catch (error) {
    console.error('Error generating AI response:', error);
    return 'I seem to be having trouble processing that right now. Can we try again?';
  }
};

// Helper function to extract and save memories from conversation
const extractMemories = async (conversation, companionId, userId) => {
  try {
    // In a real implementation, this would use NLP or call an API to extract important facts
    // For now, we'll use a simple placeholder implementation
    
    // Get the last 5 messages
    const recentMessages = conversation.messages.slice(-5);
    
    // Check if there are any user messages
    const userMessages = recentMessages.filter(msg => msg.sender === 'user');
    
    if (userMessages.length > 0) {
      // Randomly decide if this should be a memory (for demo purposes)
      if (Math.random() > 0.7) {
        const randomMessage = userMessages[Math.floor(Math.random() * userMessages.length)];
        
        // Create a new memory
        await Memory.create({
          companion: companionId,
          user: userId,
          type: 'fact',
          content: `User said: ${randomMessage.content}`,
          importance: Math.floor(Math.random() * 5) + 1,
          associatedConversation: conversation._id
        });
      }
    }
  } catch (error) {
    console.error('Error extracting memories:', error);
  }
};

// @desc    Get conversation history with a companion
// @route   GET /api/chat/:companionId
// @access  Private
const getConversationHistory = asyncHandler(async (req, res) => {
  const { companionId } = req.params;
  const { limit = 50, before } = req.query;
  
  // Verify companion belongs to user
  const companion = await Companion.findOne({
    _id: companionId,
    user: req.user._id
  });
  
  if (!companion) {
    res.status(404);
    throw new Error('Companion not found');
  }
  
  // Find or create conversation
  let conversation = await Conversation.findOne({
    companion: companionId,
    user: req.user._id,
    isArchived: false
  }).sort({ updatedAt: -1 });
  
  if (!conversation) {
    conversation = await Conversation.create({
      companion: companionId,
      user: req.user._id,
      messages: []
    });
  }
  
  // If 'before' parameter is provided, get messages before that timestamp
  let messages;
  if (before) {
    const beforeDate = new Date(before);
    messages = conversation.messages
      .filter(msg => new Date(msg.timestamp) < beforeDate)
      .slice(-limit);
  } else {
    messages = conversation.messages.slice(-limit);
  }
  
  res.json({
    conversationId: conversation._id,
    companionId,
    messages
  });
});

// @desc    Send message to companion
// @route   POST /api/chat
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { companionId, content, contentType = 'text' } = req.body;
  
  if (!content) {
    res.status(400);
    throw new Error('Message content is required');
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
  
  // Find or create conversation
  let conversation = await Conversation.findOne({
    companion: companionId,
    user: req.user._id,
    isArchived: false
  }).sort({ updatedAt: -1 });
  
  if (!conversation) {
    conversation = await Conversation.create({
      companion: companionId,
      user: req.user._id,
      messages: []
    });
  }
  
  // Analyze emotions in the message
  const emotions = await analyzeEmotions(content);
  
  // Add user message to conversation
  const userMessage = {
    sender: 'user',
    content,
    contentType,
    emotions,
    timestamp: Date.now(),
    isRead: true
  };
  
  conversation.messages.push(userMessage);
  
  // Get relevant memories for context
  const memories = await Memory.find({
    companion: companionId,
    user: req.user._id
  })
    .sort({ importance: -1, lastRecalled: -1 })
    .limit(5);
  
  // Generate AI response
  const recentMessages = conversation.messages.slice(-10);
  const aiResponse = await generateAIResponse(content, companion, recentMessages, memories);
  
  // Add companion response to conversation
  const companionMessage = {
    sender: 'companion',
    content: aiResponse,
    contentType: 'text',
    emotions: await analyzeEmotions(aiResponse),
    timestamp: Date.now(),
    isRead: false
  };
  
  conversation.messages.push(companionMessage);
  
  // Update conversation context
  conversation.context = `Recent conversation about: ${content.substring(0, 100)}...`;
  
  // Save conversation
  await conversation.save();
  
  // Extract and save memories from the conversation
  await extractMemories(conversation, companionId, req.user._id);
  
  // Update companion's last interaction time
  companion.lastInteraction = Date.now();
  await companion.save();
  
  res.json({
    conversationId: conversation._id,
    userMessage,
    companionMessage
  });
});

// @desc    Archive a conversation
// @route   PUT /api/chat/:conversationId/archive
// @access  Private
const archiveConversation = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  
  const conversation = await Conversation.findOne({
    _id: conversationId,
    user: req.user._id
  });
  
  if (!conversation) {
    res.status(404);
    throw new Error('Conversation not found');
  }
  
  conversation.isArchived = true;
  await conversation.save();
  
  res.json({ message: 'Conversation archived' });
});

// @desc    Create a new conversation with scenario
// @route   POST /api/chat/scenario
// @access  Private
const createScenario = asyncHandler(async (req, res) => {
  const { companionId, scenario } = req.body;
  
  if (!scenario) {
    res.status(400);
    throw new Error('Scenario is required');
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
  
  // Check if user's subscription allows scenarios
  const subscription = await Subscription.findOne({ user: req.user._id });
  if (subscription.plan === 'free') {
    res.status(403);
    throw new Error('Scenarios require a premium subscription');
  }
  
  // Create new conversation with scenario
  const conversation = await Conversation.create({
    companion: companionId,
    user: req.user._id,
    scenario,
    messages: [],
    context: `Roleplay scenario: ${scenario}`
  });
  
  // Generate initial message from companion based on scenario
  const initialMessage = {
    sender: 'companion',
    content: `I'd love to try this ${scenario} scenario with you! Let's begin.`,
    contentType: 'text',
    emotions: { primary: 'excited', secondary: 'happy', intensity: 8 },
    timestamp: Date.now(),
    isRead: false
  };
  
  conversation.messages.push(initialMessage);
  await conversation.save();
  
  res.status(201).json({
    conversationId: conversation._id,
    scenario,
    initialMessage
  });
});

module.exports = {
  getConversationHistory,
  sendMessage,
  archiveConversation,
  createScenario,
};