const asyncHandler = require('express-async-handler');
const axios = require('axios');
const Companion = require('../models/Companion');
const Subscription = require('../models/Subscription');

// @desc    Generate voice for companion message
// @route   POST /api/voice
// @access  Private
const generateVoice = asyncHandler(async (req, res) => {
  const { companionId, text } = req.body;
  
  if (!text) {
    res.status(400);
    throw new Error('Text content is required');
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
  
  // Check if companion has voice settings
  if (!companion.voice || companion.voice.provider === 'none') {
    res.status(400);
    throw new Error('This companion does not have voice capabilities');
  }
  
  // Check user's subscription for voice limits
  const subscription = await Subscription.findOne({ user: req.user._id });
  
  // Calculate approximate audio length (1 word ≈ 0.5 seconds)
  const wordCount = text.split(' ').length;
  const estimatedSeconds = wordCount * 0.5;
  
  // Check if user has enough voice minutes left
  // In a real implementation, you would track usage in the database
  if (estimatedSeconds > subscription.features.voiceMinutesPerMonth * 60) {
    res.status(403);
    throw new Error('You have reached your voice generation limit for this month');
  }
  
  try {
    // In a real implementation, this would call the voice API (ElevenLabs or PlayHT)
    // For now, we'll use a placeholder
    
    /*
    // Example for ElevenLabs
    if (companion.voice.provider === 'elevenlabs') {
      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${companion.voice.voiceId}`,
        {
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: companion.voice.settings.stability || 0.5,
            similarity_boost: companion.voice.settings.similarity || 0.5,
            style: companion.voice.settings.style || 0.0,
            use_speaker_boost: true
          }
        },
        {
          headers: {
            'xi-api-key': process.env.ELEVENLABS_API_KEY,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg'
          },
          responseType: 'arraybuffer'
        }
      );
      
      // Convert to base64
      const audioBase64 = Buffer.from(response.data).toString('base64');
      
      return res.json({
        audioContent: audioBase64,
        format: 'mp3',
        duration: estimatedSeconds
      });
    }
    
    // Example for PlayHT
    if (companion.voice.provider === 'playht') {
      const response = await axios.post(
        'https://api.play.ht/api/v1/convert',
        {
          voice: companion.voice.voiceId,
          content: [text],
          speed: companion.voice.settings.speed || 1.0,
          preset: 'high_quality'
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.PLAYHT_API_KEY}`,
            'X-User-ID': process.env.PLAYHT_USER_ID,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Get the URL from the response
      const audioUrl = response.data.audioUrl;
      
      // Fetch the audio file
      const audioResponse = await axios.get(audioUrl, {
        responseType: 'arraybuffer'
      });
      
      // Convert to base64
      const audioBase64 = Buffer.from(audioResponse.data).toString('base64');
      
      return res.json({
        audioContent: audioBase64,
        format: 'mp3',
        duration: estimatedSeconds
      });
    }
    */
    
    // Placeholder response for development
    res.json({
      audioContent: 'SGVsbG8sIHRoaXMgaXMgYSBwbGFjZWhvbGRlciBhdWRpbyBmaWxlLg==', // Base64 placeholder
      format: 'mp3',
      duration: estimatedSeconds
    });
    
  } catch (error) {
    console.error('Error generating voice:', error);
    res.status(500);
    throw new Error('Failed to generate voice audio');
  }
});

// @desc    Get available voice options
// @route   GET /api/voice/options
// @access  Private
const getVoiceOptions = asyncHandler(async (req, res) => {
  // Check user's subscription
  const subscription = await Subscription.findOne({ user: req.user._id });
  
  // In a real implementation, this would fetch from the voice API
  // For now, we'll use placeholder data
  
  const basicVoices = [
    { id: 'basic_female_1', name: 'Sarah', gender: 'female', preview: '/audio/sarah_preview.mp3' },
    { id: 'basic_female_2', name: 'Emma', gender: 'female', preview: '/audio/emma_preview.mp3' },
    { id: 'basic_male_1', name: 'Michael', gender: 'male', preview: '/audio/michael_preview.mp3' },
    { id: 'basic_male_2', name: 'David', gender: 'male', preview: '/audio/david_preview.mp3' },
  ];
  
  const premiumVoices = [
    { id: 'premium_female_1', name: 'Sophia', gender: 'female', preview: '/audio/sophia_preview.mp3' },
    { id: 'premium_female_2', name: 'Olivia', gender: 'female', preview: '/audio/olivia_preview.mp3' },
    { id: 'premium_male_1', name: 'James', gender: 'male', preview: '/audio/james_preview.mp3' },
    { id: 'premium_male_2', name: 'William', gender: 'male', preview: '/audio/william_preview.mp3' },
  ];
  
  const ultimateVoices = [
    { id: 'ultimate_female_1', name: 'Ava', gender: 'female', preview: '/audio/ava_preview.mp3' },
    { id: 'ultimate_female_2', name: 'Isabella', gender: 'female', preview: '/audio/isabella_preview.mp3' },
    { id: 'ultimate_male_1', name: 'Alexander', gender: 'male', preview: '/audio/alexander_preview.mp3' },
    { id: 'ultimate_male_2', name: 'Benjamin', gender: 'male', preview: '/audio/benjamin_preview.mp3' },
  ];
  
  let availableVoices = [...basicVoices];
  
  if (subscription.plan === 'premium' || subscription.plan === 'ultimate') {
    availableVoices = [...availableVoices, ...premiumVoices];
  }
  
  if (subscription.plan === 'ultimate') {
    availableVoices = [...availableVoices, ...ultimateVoices];
  }
  
  res.json({
    voices: availableVoices,
    providers: ['elevenlabs', 'playht'],
    minutesRemaining: subscription.features.voiceMinutesPerMonth // In a real app, subtract used minutes
  });
});

module.exports = {
  generateVoice,
  getVoiceOptions,
};