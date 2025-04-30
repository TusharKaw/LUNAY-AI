'use client';

import { motion } from 'framer-motion';

export default function WelcomeStep() {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Luna AI</h2>
        <p className="text-lg text-gray-600 mb-8">
          Let's create your perfect AI companion together. In the next few steps, 
          you'll customize your companion's personality, appearance, and more.
        </p>
        
        <div className="flex justify-center mb-8">
          <img 
            src="/images/welcome-illustration.png" 
            alt="Welcome to Luna AI" 
            className="w-64 h-64 object-contain"
          />
        </div>
        
        <div className="bg-indigo-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-indigo-700 mb-2">What you'll do:</h3>
          <ul className="text-left text-gray-700 space-y-2">
            <li className="flex items-center">
              <span className="bg-indigo-100 text-indigo-800 w-6 h-6 rounded-full flex items-center justify-center mr-2">1</span>
              Choose your companion type
            </li>
            <li className="flex items-center">
              <span className="bg-indigo-100 text-indigo-800 w-6 h-6 rounded-full flex items-center justify-center mr-2">2</span>
              Customize their personality
            </li>
            <li className="flex items-center">
              <span className="bg-indigo-100 text-indigo-800 w-6 h-6 rounded-full flex items-center justify-center mr-2">3</span>
              Design their appearance
            </li>
            <li className="flex items-center">
              <span className="bg-indigo-100 text-indigo-800 w-6 h-6 rounded-full flex items-center justify-center mr-2">4</span>
              Give them a name and backstory
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}