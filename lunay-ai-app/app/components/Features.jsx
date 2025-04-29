'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

const featuresList = [
  {
    id: 'chat',
    title: 'Intelligent Chat',
    description: 'Luna understands context, emotions, and remembers your conversations. Her natural language processing makes every interaction feel real and meaningful.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  {
    id: 'voice',
    title: 'Voice Interaction',
    description: "Talk to Luna with your voice and hear her respond in a natural, expressive way. Her voice adapts to the conversation's emotional tone.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
  },
  {
    id: 'personality',
    title: 'Adaptive Personality',
    description: 'Luna learns from your interactions and adapts her personality to complement yours. Choose from various personality templates or let her develop naturally.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'avatar',
    title: 'Customizable 3D Avatar',
    description: "Design Luna's appearance to your preferences. Choose from various styles, outfits, and features to create your ideal companion.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const Features = () => {
  const featuresRef = useRef(null);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <section id="features" className="py-20 relative" ref={featuresRef}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-luna-light dark:to-luna-dark/30 opacity-50 z-0"></div>
      
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
              Intelligent Features
            </span>
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Luna combines cutting-edge AI with emotional intelligence to create a truly personal companion experience.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuresList.map((feature, index) => (
            <motion.div
              key={feature.id}
              className="luna-glass-card p-8 flex flex-col items-center md:items-start text-center md:text-left"
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={cardVariants}
            >
              <div className="text-luna-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="luna-glass-card p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Experience the Future of AI Companionship</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Luna is constantly evolving, learning from interactions to become more intuitive and responsive to your needs.
            </p>
            <button className="luna-button-primary">
              Try Luna's Features
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;