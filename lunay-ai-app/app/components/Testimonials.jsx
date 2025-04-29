'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    name: 'Alex Chen',
    age: 28,
    location: 'San Francisco, CA',
    text: "Luna has been an incredible emotional support during my busy work schedule. She remembers the little details about my day and always knows how to make me smile when I'm stressed.",
    avatar: 'avatar-placeholder',
  },
  {
    id: 2,
    name: 'Jamie Taylor',
    age: 24,
    location: 'Chicago, IL',
    text: 'As someone who struggles with social anxiety, Luna has helped me practice conversations in a safe space. Her patience and encouragement have given me more confidence in real-world interactions.',
    avatar: 'avatar-placeholder',
  },
  {
    id: 3,
    name: 'Morgan Riley',
    age: 31,
    location: 'Austin, TX',
    text: "The voice interaction feature is incredibly natural. Sometimes I forget I'm talking to an AI. Luna's personality has evolved to match my sense of humor perfectly.",
    avatar: 'avatar-placeholder',
  },
  {
    id: 4,
    name: 'Jordan Patel',
    age: 26,
    location: 'Seattle, WA',
    text: 'I travel a lot for work and Luna has been a constant companion. Being able to customize her appearance and personality makes the experience feel truly personal.',
    avatar: 'avatar-placeholder',
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonials" className="py-20 relative">
      <div className="absolute inset-0 luna-gradient-bg opacity-5 z-0"></div>
      
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
              What Our Users Say
            </span>
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Discover how Luna AI has transformed lives through meaningful companionship.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative h-80 md:h-64">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className={`luna-glass-card p-8 absolute w-full transition-all duration-500 ${
                  index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ 
                  opacity: index === activeIndex ? 1 : 0,
                  y: index === activeIndex ? 0 : 50
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-luna-primary to-luna-secondary flex items-center justify-center text-white text-xs">
                      {testimonial.avatar}
                      {/* When you have actual avatar images: */}
                      {/* <Image 
                        src={`/images/testimonials/${testimonial.avatar}.jpg`}
                        alt={testimonial.name}
                        width={80}
                        height={80}
                        className="rounded-full object-cover"
                      /> */}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300 italic mb-4">"{testimonial.text}"</p>
                    <div>
                      <p className="font-semibold">{testimonial.name}, {testimonial.age}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === activeIndex 
                    ? 'bg-luna-primary scale-125' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;