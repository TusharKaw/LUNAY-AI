'use client';

import { motion } from 'framer-motion';

export default function FinalStep({ companionData }) {
  // Get companion preview image based on type
  const getPreviewImage = () => {
    const type = companionData.type || 'female';
    return `/images/${type}-avatar.png`;
  };

  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Meet {companionData.name || 'Your Companion'}
        </h2>
        
        <div className="flex justify-center mb-6">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-indigo-100">
            <img 
              src={getPreviewImage()} 
              alt={companionData.name || 'Your Companion'} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="bg-indigo-50 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold text-indigo-700 mb-2">Companion Summary</h3>
          
          <div className="grid grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-sm font-medium text-gray-500">Name:</p>
              <p className="text-md text-gray-800">{companionData.name || 'Not set'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Type:</p>
              <p className="text-md text-gray-800 capitalize">{companionData.type || 'Not set'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Personality:</p>
              <p className="text-md text-gray-800 capitalize">{companionData.personality?.type || 'Friendly'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Avatar Style:</p>
              <p className="text-md text-gray-800">{companionData.appearance?.avatar?.type === '3d' ? '3D' : '2D'}</p>
            </div>
          </div>
          
          {companionData.backstory && (
            <div className="mt-4 text-left">
              <p className="text-sm font-medium text-gray-500">Backstory:</p>
              <p className="text-sm text-gray-700 mt-1">
                {companionData.backstory.length > 150 
                  ? `${companionData.backstory.substring(0, 150)}...` 
                  : companionData.backstory}
              </p>
            </div>
          )}
        </div>
        
        <p className="text-lg text-gray-600 mb-6">
          Your companion is ready to meet you! Click the button below to create your companion and start chatting.
        </p>
        
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <p className="text-sm text-green-800">
            <span className="font-medium">Tip:</span> You can always customize your companion further in the settings.
          </p>
        </div>
      </motion.div>
    </div>
  );
}