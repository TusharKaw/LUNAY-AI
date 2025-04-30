'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function NameStep({ companionData, updateCompanionData }) {
  const [name, setName] = useState(companionData.name || '');
  const [backstory, setBackstory] = useState(companionData.backstory || '');
  const [nameError, setNameError] = useState('');
  
  // Suggested names based on companion type and gender
  const [suggestedNames, setSuggestedNames] = useState([]);
  
  useEffect(() => {
    // Generate suggested names based on companion type
    const type = companionData.type || '';
    const gender = companionData.gender || '';
    
    let names = [];
    
    if (gender === 'female') {
      names = ['Sophia', 'Emma', 'Olivia', 'Ava', 'Mia', 'Luna', 'Aria'];
    } else if (gender === 'male') {
      names = ['Liam', 'Noah', 'Ethan', 'Lucas', 'Mason', 'Oliver', 'Aiden'];
    } else if (type === 'anime') {
      names = ['Yuki', 'Haru', 'Sakura', 'Kai', 'Rin', 'Akira', 'Yuna'];
    } else {
      names = ['Alex', 'Jordan', 'Riley', 'Taylor', 'Casey', 'Morgan', 'Avery'];
    }
    
    setSuggestedNames(names);
  }, [companionData.type, companionData.gender]);
  
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    
    if (newName.trim() === '') {
      setNameError('Name is required');
    } else if (newName.length > 20) {
      setNameError('Name must be 20 characters or less');
    } else {
      setNameError('');
      updateCompanionData({ name: newName });
    }
  };
  
  const handleBackstoryChange = (e) => {
    const newBackstory = e.target.value;
    setBackstory(newBackstory);
    updateCompanionData({ backstory: newBackstory });
  };
  
  const handleSuggestedName = (suggestedName) => {
    setName(suggestedName);
    setNameError('');
    updateCompanionData({ name: suggestedName });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Name Your Companion</h2>
      <p className="text-gray-600 mb-6">
        Give your companion a name and optionally create a backstory to make them unique.
      </p>
      
      <div className="space-y-6">
        {/* Name input */}
        <div>
          <label htmlFor="companion-name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="companion-name"
            value={name}
            onChange={handleNameChange}
            className={`w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
              nameError ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter a name"
          />
          {nameError && (
            <p className="mt-1 text-sm text-red-600">{nameError}</p>
          )}
        </div>
        
        {/* Suggested names */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Suggested names:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedNames.map((suggestedName) => (
              <button
                key={suggestedName}
                onClick={() => handleSuggestedName(suggestedName)}
                className="px-3 py-1 text-sm bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100"
              >
                {suggestedName}
              </button>
            ))}
          </div>
        </div>
        
        {/* Backstory textarea */}
        <div>
          <label htmlFor="backstory" className="block text-sm font-medium text-gray-700 mb-1">
            Backstory (Optional)
          </label>
          <textarea
            id="backstory"
            rows="5"
            value={backstory}
            onChange={handleBackstoryChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Create a backstory for your companion (up to 2000 characters)"
            maxLength={2000}
          ></textarea>
          <p className="mt-1 text-xs text-gray-500 text-right">
            {backstory.length}/2000 characters
          </p>
        </div>
        
        {/* Backstory suggestions */}
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm font-medium text-gray-700 mb-2">Backstory ideas:</p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Where are they from?</li>
            <li>• What are their interests and hobbies?</li>
            <li>• What kind of personality do they have?</li>
            <li>• What are their dreams and aspirations?</li>
            <li>• What makes them unique?</li>
          </ul>
        </div>
      </div>
    </div>
  );
}