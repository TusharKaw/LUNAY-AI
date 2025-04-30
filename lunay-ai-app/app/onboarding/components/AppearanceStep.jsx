'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Sample appearance options (in a real app, these would come from an API)
const appearanceOptions = {
  skinTones: [
    { id: 'light', name: 'Light', color: '#FFE0BD' },
    { id: 'medium', name: 'Medium', color: '#E5C298' },
    { id: 'tan', name: 'Tan', color: '#C68642' },
    { id: 'brown', name: 'Brown', color: '#8D5524' },
    { id: 'dark', name: 'Dark', color: '#5C3836' }
  ],
  hairStyles: [
    { id: 'short', name: 'Short' },
    { id: 'medium', name: 'Medium' },
    { id: 'long', name: 'Long' },
    { id: 'curly', name: 'Curly' },
    { id: 'wavy', name: 'Wavy' }
  ],
  hairColors: [
    { id: 'black', name: 'Black', color: '#000000' },
    { id: 'brown', name: 'Brown', color: '#6A4E42' },
    { id: 'blonde', name: 'Blonde', color: '#FFF5E1' },
    { id: 'red', name: 'Red', color: '#A52A2A' },
    { id: 'blue', name: 'Blue', color: '#6495ED' },
    { id: 'pink', name: 'Pink', color: '#FFC0CB' }
  ],
  eyeColors: [
    { id: 'brown', name: 'Brown', color: '#634E34' },
    { id: 'blue', name: 'Blue', color: '#3B83BD' },
    { id: 'green', name: 'Green', color: '#50C878' },
    { id: 'hazel', name: 'Hazel', color: '#AE734E' },
    { id: 'amber', name: 'Amber', color: '#FFBF00' }
  ],
  outfits: [
    { id: 'casual', name: 'Casual' },
    { id: 'formal', name: 'Formal' },
    { id: 'sporty', name: 'Sporty' },
    { id: 'elegant', name: 'Elegant' },
    { id: 'creative', name: 'Creative' }
  ]
};

export default function AppearanceStep({ companionData, updateCompanionData }) {
  const [avatarType, setAvatarType] = useState(companionData.appearance?.avatar?.type || '2d');
  const [skinTone, setSkinTone] = useState(companionData.appearance?.avatar?.customization?.skinTone || 'medium');
  const [hairStyle, setHairStyle] = useState(companionData.appearance?.avatar?.customization?.hairStyle || 'medium');
  const [hairColor, setHairColor] = useState(companionData.appearance?.avatar?.customization?.hairColor || 'brown');
  const [eyeColor, setEyeColor] = useState(companionData.appearance?.avatar?.customization?.eyeColor || 'brown');
  const [outfit, setOutfit] = useState(companionData.appearance?.avatar?.customization?.outfitId || 'casual');
  
  // Avatar preview URL (in a real app, this would be generated dynamically)
  const [previewUrl, setPreviewUrl] = useState('/images/avatar-preview.png');

  // Update companion data when appearance changes
  useEffect(() => {
    updateCompanionData({
      appearance: {
        avatar: {
          type: avatarType,
          modelId: `${companionData.type || 'female'}-${avatarType}`,
          customization: {
            skinTone,
            hairStyle,
            hairColor,
            eyeColor,
            outfitId: outfit
          }
        }
      }
    });
    
    // In a real app, you would generate a preview URL based on the selected options
    // For now, we'll just use a static image
    setPreviewUrl(`/images/${companionData.type || 'female'}-avatar.png`);
  }, [avatarType, skinTone, hairStyle, hairColor, eyeColor, outfit]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Customize Appearance</h2>
      <p className="text-gray-600 mb-6">
        Design how your companion looks. Choose their features to create your perfect match.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left column: Avatar preview */}
        <div className="flex flex-col items-center">
          <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-indigo-100 mb-4">
            <img 
              src={previewUrl} 
              alt="Avatar Preview" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setAvatarType('2d')}
              className={`px-4 py-2 rounded-full text-sm ${
                avatarType === '2d' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              2D Style
            </button>
            <button
              onClick={() => setAvatarType('3d')}
              className={`px-4 py-2 rounded-full text-sm ${
                avatarType === '3d' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              3D Style
            </button>
          </div>
          
          <p className="text-sm text-gray-500 text-center">
            Preview updates as you make changes
          </p>
        </div>
        
        {/* Right column: Customization options */}
        <div className="space-y-6">
          {/* Skin Tone */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Skin Tone</h3>
            <div className="flex space-x-2">
              {appearanceOptions.skinTones.map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => setSkinTone(tone.id)}
                  className={`w-8 h-8 rounded-full ${
                    skinTone === tone.id ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: tone.color }}
                  title={tone.name}
                />
              ))}
            </div>
          </div>
          
          {/* Hair Style */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Hair Style</h3>
            <div className="grid grid-cols-3 gap-2">
              {appearanceOptions.hairStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setHairStyle(style.id)}
                  className={`px-3 py-1 text-xs rounded ${
                    hairStyle === style.id 
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' 
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Hair Color */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Hair Color</h3>
            <div className="flex flex-wrap gap-2">
              {appearanceOptions.hairColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setHairColor(color.id)}
                  className={`w-8 h-8 rounded-full ${
                    hairColor === color.id ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: color.color }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
          
          {/* Eye Color */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Eye Color</h3>
            <div className="flex space-x-2">
              {appearanceOptions.eyeColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setEyeColor(color.id)}
                  className={`w-8 h-8 rounded-full ${
                    eyeColor === color.id ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: color.color }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
          
          {/* Outfit */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Outfit Style</h3>
            <div className="grid grid-cols-3 gap-2">
              {appearanceOptions.outfits.map((outfitOption) => (
                <button
                  key={outfitOption.id}
                  onClick={() => setOutfit(outfitOption.id)}
                  className={`px-3 py-1 text-xs rounded ${
                    outfit === outfitOption.id 
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' 
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {outfitOption.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}