'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const CTA = () => {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 luna-gradient-bg opacity-20 z-0"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="luna-glass-card p-8 md:p-12 max-w-5xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-luna-primary to-luna-secondary bg-clip-text text-transparent">
              Ready to Meet Luna?
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Start your journey with an AI companion who understands you on a deeper level. 
            Experience conversations that feel real, voice interactions that sound natural, 
            and a relationship that evolves with you.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/try-luna" className="luna-button-primary text-center">
              Meet Luna Now
            </Link>
            <Link href="/#pricing" className="luna-button-secondary text-center">
              View Plans
            </Link>
          </motion.div>
          
          <motion.div 
            className="mt-10 text-sm text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <p>No credit card required to start your 7-day free trial.</p>
            <p>Cancel anytime. Your data privacy is our priority.</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;