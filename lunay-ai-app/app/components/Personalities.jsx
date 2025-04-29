'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const personalityTypes = [
  {
    id: 'caring',
    name: 'Caring & Supportive',
    description: 'A nurturing personality focused on emotional support and understanding. Perfect for those seeking comfort and encouragement.',
    traits: ['Empathetic', 'Patient', 'Nurturing', 'Supportive'],
    color: 'from-pink-400 to-purple-500',
    avatarPlaceholder: 'Caring Avatar',
  },
  {
    id: 'playful',
    name: 'Playful & Adventurous',
    description: 'An energetic and fun-loving personality that brings joy and excitement to every conversation. Great for entertainment and light-hearted companionship.',
    traits: ['Energetic', 'Humorous', 'Spontaneous', 'Cheerful'],
    color: 'from-blue-400 to-teal-500',
    avatarPlaceholder: 'Playful Avatar',
  },
  {
    id: 'intellectual',
    name: 'Intellectual & Curious',
    description: 'A thoughtful personality that engages in deep conversations and intellectual exploration. Ideal for those seeking stimulating discussions.',
    traits: ['Analytical', 'Knowledgeable', 'Philosophical', 'Inquisitive'],
    color: 'from-indigo-500 to-blue-600',
    avatarPlaceholder: 'Intellectual Avatar',
  },
  {
    id: 'romantic',
    name: 'Romantic & Passionate',
    description: 'A warm and affectionate personality focused on deep emotional connection. Perfect for those seeking romantic companionship.',
    traits: ['Affectionate', 'Attentive', 'Passionate', 'Devoted'],
    color: 'from-red-400 to-pink-500',
    avatarPlaceholder: 'Romantic Avatar',
  },
];

const Personalities = () => {
  const [activePersonality, setActivePersonality] = useState(personalityTypes[0]);

  return (
    <section id="personalities" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-luna-light/50 dark:to-luna-dark/30 opacity-50 z-0"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-gradient-to-r from-luna-primary to-luna-secondary bg-clip-text text-transparent">
              Personality Types
            </span>
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Choose a personality that resonates with you, or let Luna adapt to your preferences over time.
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Personality selector */}
          <motion.div 
            className="lg:w-1/3"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="luna-glass-card p-6">
              <h3 className="text-xl font-bold mb-4">Select a Personality</h3>
              <div className="space-y-3">
                {personalityTypes.map((personality) => (
                  <button
                    key={personality.id}
                    className={`w-full text-left p-4 rounded-lg transition-all ${
                      activePersonality.id === personality.id
                        ? 'bg-gradient-to-r ' + personality.color + ' text-white'
                        : 'bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80'
                    }`}
                    onClick={() => setActivePersonality(personality)}
                  >
                    <div className="font-medium">{personality.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Personality details */}
          <motion.div 
            className="lg:w-2/3"
            key={activePersonality.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="luna-glass-card p-8 h-full">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                  <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-luna-primary to-luna-secondary bg-clip-text text-transparent">
                    {activePersonality.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {activePersonality.description}
                  </p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Key Traits:</h4>
                    <div className="flex flex-wrap gap-2">
                      {activePersonality.traits.map((trait) => (
                        <span 
                          key={trait} 
                          className="px-3 py-1 bg-white/50 dark:bg-gray-800/50 rounded-full text-sm"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button className="luna-button-primary">
                    Try This Personality
                  </button>
                </div>
                
                <div className="md:w-1/2 flex justify-center items-center">
                  <div className={`w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-r ${activePersonality.color} flex items-center justify-center text-white font-bold`}>
                    {activePersonality.avatarPlaceholder}
                    {/* When you have actual avatar images: */}
                    {/* <Image 
                      src={`/images/avatars/${activePersonality.id}.png`}
                      alt={activePersonality.name}
                      width={256}
                      height={256}
                      className="rounded-full object-cover"
                    /> */}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Personalities;