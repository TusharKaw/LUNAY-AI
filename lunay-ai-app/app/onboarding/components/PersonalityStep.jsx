'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const personalityTypes = [
  {
    id: 'romantic',
    name: 'Romantic',
    description: 'Affectionate, passionate, and emotionally expressive',
    icon: '❤️'
  },
  {
    id: 'friendly',
    name: 'Friendly',
    description: 'Warm, supportive, and easy to talk to',
    icon: '😊'
  },
  {
    id: 'sarcastic',
    name: 'Sarcastic',
    description: 'Witty, ironic, with a sharp sense of humor',
    icon: '😏'
  },
  {
    id: 'adventurous',
    name: 'Adventurous',
    description: 'Bold, spontaneous, and loves new experiences',
    icon: '🌟'
  },
  {
    id: 'intellectual',
    name: 'Intellectual',
    description: 'Thoughtful, curious, and loves deep conversations',
    icon: '🧠'
  },
  {
    id: 'supportive',
    name: 'Supportive',
    description: 'Encouraging, empathetic, and always there for you',
    icon: '🤗'
  }
];

export default function PersonalityStep({ companionData, updateCompanionData }) {
  const [selectedType, setSelectedType] = useState(companionData.personality?.type || 'friendly');
  const [traits, setTraits] = useState(companionData.personality?.traits || [
    { name: 'Extroversion', value: 50 },
    { name: 'Agreeableness', value: 50 },
    { name: 'Openness', value: 50 },
    { name: 'Conscientiousness', value: 50 },
    { name: 'Emotional Stability', value: 50 }
  ]);

  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId);
    
    // Adjust trait values based on personality type
    let newTraits = [...traits];
    
    switch(typeId) {
      case 'romantic':
        newTraits = adjustTraits(newTraits, { 'Extroversion': 70, 'Agreeableness': 80, 'Emotional Stability': 60 });
        break;
      case 'friendly':
        newTraits = adjustTraits(newTraits, { 'Extroversion': 70, 'Agreeableness': 90, 'Openness': 60 });
        break;
      case 'sarcastic':
        newTraits = adjustTraits(newTraits, { 'Extroversion': 60, 'Agreeableness': 30, 'Openness': 70 });
        break;
      case 'adventurous':
        newTraits = adjustTraits(newTraits, { 'Extroversion': 80, 'Openness': 90, 'Conscientiousness': 40 });
        break;
      case 'intellectual':
        newTraits = adjustTraits(newTraits, { 'Openness': 90, 'Conscientiousness': 80, 'Extroversion': 40 });
        break;
      case 'supportive':
        newTraits = adjustTraits(newTraits, { 'Agreeableness': 90, 'Emotional Stability': 80, 'Conscientiousness': 70 });
        break;
      default:
        break;
    }
    
    setTraits(newTraits);
    updateCompanionData({ 
      personality: {
        type: typeId,
        traits: newTraits
      }
    });
  };

  const adjustTraits = (currentTraits, adjustments) => {
    return currentTraits.map(trait => {
      if (adjustments[trait.name]) {
        return { ...trait, value: adjustments[trait.name] };
      }
      return trait;
    });
  };

  const handleTraitChange = (index, value) => {
    const newTraits = [...traits];
    newTraits[index].value = value;
    setTraits(newTraits);
    updateCompanionData({ 
      personality: {
        type: selectedType,
        traits: newTraits
      }
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Personality Type</h2>
      <p className="text-gray-600 mb-6">
        Choose a personality template and fine-tune individual traits to create your perfect companion.
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {personalityTypes.map((type) => (
          <motion.div
            key={type.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={`border rounded-lg p-3 cursor-pointer transition-all ${
              selectedType === type.id 
                ? 'border-indigo-500 bg-indigo-50' 
                : 'border-gray-200 hover:border-indigo-300'
            }`}
            onClick={() => handleTypeSelect(type.id)}
          >
            <div className="flex flex-col items-center">
              <div className="text-3xl mb-2">{type.icon}</div>
              <h3 className="text-md font-semibold text-gray-900">{type.name}</h3>
              <p className="text-xs text-gray-500 text-center mt-1">{type.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Fine-tune Personality Traits</h3>
      
      <div className="space-y-6">
        {traits.map((trait, index) => (
          <div key={index}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">{trait.name}</span>
              <span className="text-sm text-gray-500">{trait.value}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={trait.value}
              onChange={(e) => handleTraitChange(index, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}