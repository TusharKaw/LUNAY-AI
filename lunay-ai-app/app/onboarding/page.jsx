'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

// Step components
import WelcomeStep from './components/WelcomeStep';
import CompanionTypeStep from './components/CompanionTypeStep';
import PersonalityStep from './components/PersonalityStep';
import AppearanceStep from './components/AppearanceStep';
import NameStep from './components/NameStep';
import FinalStep from './components/FinalStep';

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [companionData, setCompanionData] = useState({
    type: '', // 'female', 'male', 'anime'
    personality: {
      type: 'friendly',
      traits: [
        { name: 'Extroversion', value: 50 },
        { name: 'Agreeableness', value: 50 },
        { name: 'Openness', value: 50 },
        { name: 'Conscientiousness', value: 50 },
        { name: 'Emotional Stability', value: 50 }
      ]
    },
    appearance: {
      avatar: {
        type: '2d',
        modelId: '',
        customization: {
          skinTone: '',
          hairStyle: '',
          hairColor: '',
          eyeColor: '',
          outfitId: ''
        }
      }
    },
    name: '',
    gender: '',
    backstory: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    }
  }, [router]);

  const steps = [
    { component: WelcomeStep, title: 'Welcome' },
    { component: CompanionTypeStep, title: 'Choose Companion Type' },
    { component: PersonalityStep, title: 'Personality' },
    { component: AppearanceStep, title: 'Appearance' },
    { component: NameStep, title: 'Name Your Companion' },
    { component: FinalStep, title: 'Ready to Meet' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleCreateCompanion();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateCompanionData = (data) => {
    setCompanionData({ ...companionData, ...data });
  };

  const handleCreateCompanion = async () => {
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/companions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(companionData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create companion');
      }

      // Redirect to chat with the new companion
      router.push(`/chat/${data._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {steps.map((step, index) => (
                <div 
                  key={index} 
                  className={`text-xs font-medium ${index <= currentStep ? 'text-indigo-600' : 'text-gray-400'}`}
                >
                  {step.title}
                </div>
              ))}
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <motion.div 
                className="h-full bg-indigo-600 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Step content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <CurrentStepComponent 
              companionData={companionData} 
              updateCompanionData={updateCompanionData} 
            />

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 0 ? (
                <button
                  onClick={handleBack}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
              ) : (
                <div></div>
              )}
              
              <button
                onClick={handleNext}
                disabled={isLoading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {currentStep === steps.length - 1 
                  ? (isLoading ? 'Creating...' : 'Create Companion') 
                  : 'Next'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}