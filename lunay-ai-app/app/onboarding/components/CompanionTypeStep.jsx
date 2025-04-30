'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const companionTypes = [
  {
    id: 'female',
    name: 'Female',
    description: 'A female companion with realistic features',
    image: '/images/female-avatar.png',
    gender: 'female'
  },
  {
    id: 'male',
    name: 'Male',
    description: 'A male companion with realistic features',
    image: '/images/male-avatar.png',
    gender: 'male'
  },
  {
    id: 'anime',
    name: 'Anime',
    description: 'A stylized anime-inspired companion',
    image: '/images/anime-avatar.png',
    gender: 'non-binary'
  }
];

export default function CompanionTypeStep({ companionData, updateCompanionData }) {
  const [selectedType, setSelectedType] = useState(companionData.type || '');

  const handleTypeSelect = (type) => {
    setSelectedType(type.id);
    updateCompanionData({ 
      type: type.id,
      gender: type.gender
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Companion Type</h2>
      <p className="text-gray-600 mb-6">
        Select the type of companion you'd like to create. You can customize their appearance in later steps.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {companionTypes.map((type) => (
          <motion.div
            key={type.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={`border rounded-xl p-4 cursor-pointer transition-all ${
              selectedType === type.id 
                ? 'border-indigo-500 bg-indigo-50' 
                : 'border-gray-200 hover:border-indigo-300'
            }`}
            onClick={() => handleTypeSelect(type)}
          >
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-gray-100">
                <img 
                  src={type.image} 
                  alt={type.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{type.name}</h3>
              <p className="text-sm text-gray-500 text-center mt-1">{type.description}</p>
              
              {selectedType === type.id && (
                <div className="mt-3 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                  Selected
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      {!selectedType && (
        <p className="text-amber-600 text-sm">Please select a companion type to continue</p>
      )}
    </div>
  );
}