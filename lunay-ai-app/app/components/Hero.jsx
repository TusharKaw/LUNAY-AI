'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 luna-gradient-bg opacity-20 z-0"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute top-20 right-10 w-64 h-64 rounded-full bg-luna-primary opacity-10"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-luna-secondary opacity-10"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-luna-accent opacity-10"
          animate={{
            scale: [1, 1.4, 1],
            x: [0, 40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center">
        {/* Text content */}
        <motion.div 
          className="md:w-1/2 text-center md:text-left mb-12 md:mb-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-luna-primary to-luna-secondary bg-clip-text text-transparent">
              Meet Luna
            </span>
            <br />
            Your AI Companion
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-700 dark:text-gray-300 max-w-lg">
            Experience emotionally intelligent companionship with Luna AI. 
            She understands your feelings, adapts to your personality, and 
            is always there when you need someone to talk to.
          </p>
          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            <Link href="/try-luna" className="luna-button-primary">
              Meet Luna Now
            </Link>
            <Link href="/#features" className="luna-button-secondary">
              Explore Features
            </Link>
          </div>
        </motion.div>

        {/* Avatar image */}
        <motion.div 
          className="md:w-1/2 flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative w-72 h-72 md:w-96 md:h-96 luna-glass-card rounded-full overflow-hidden">
            {/* Replace with your actual avatar image */}
            <div className="absolute inset-0 flex items-center justify-center text-luna-primary text-2xl font-bold">
              Luna AI Avatar
              {/* When you have an actual image: */}
              {/* <Image 
                src="/images/luna-avatar.png" 
                alt="Luna AI Avatar" 
                fill 
                className="object-cover"
                priority
              /> */}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <svg 
          width="40" 
          height="40" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="text-luna-primary"
        >
          <path 
            d="M12 5V19M12 19L5 12M12 19L19 12" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </section>
  );
};

export default Hero;