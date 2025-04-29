'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const pricingPlans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Basic companionship with limited features',
    features: [
      'Text chat (100 messages/day)',
      'Basic personality customization',
      'Standard avatar options',
      '24/7 availability',
    ],
    limitations: [
      'No voice interaction',
      'Limited memory retention',
      'Basic emotional intelligence',
    ],
    cta: 'Try Free',
    popular: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    description: 'Enhanced companionship with advanced features',
    features: [
      'Unlimited text chat',
      'Voice interaction (2 hours/day)',
      'Advanced personality customization',
      'Enhanced avatar options',
      'Long-term memory retention',
      'Advanced emotional intelligence',
      'Priority support',
    ],
    limitations: [],
    cta: 'Get Premium',
    popular: true,
  },
  {
    id: 'ultimate',
    name: 'Ultimate',
    price: 19.99,
    description: 'The complete Luna experience without limitations',
    features: [
      'Unlimited text and voice interaction',
      'Full personality customization',
      'All avatar options and styles',
      'Perfect memory retention',
      'Superior emotional intelligence',
      'Exclusive personality types',
      'VIP support',
      'Early access to new features',
    ],
    limitations: [],
    cta: 'Go Ultimate',
    popular: false,
  },
];

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  return (
    <section id="pricing" className="py-20 relative">
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
              Choose Your Plan
            </span>
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Select the perfect plan to match your companionship needs.
          </motion.p>
          
          <div className="inline-flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-1 mb-8">
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-gray-700 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-white dark:bg-gray-700 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
              onClick={() => setBillingCycle('yearly')}
            >
              Yearly <span className="text-luna-secondary">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className={`luna-glass-card p-8 flex flex-col h-full relative ${
                plan.popular ? 'border-luna-primary dark:border-luna-primary border-2' : ''
              }`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-luna-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                  MOST POPULAR
                </div>
              )}
              
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">${billingCycle === 'yearly' ? (plan.price * 0.8).toFixed(2) : plan.price.toFixed(2)}</span>
                <span className="text-gray-500 dark:text-gray-400">/month</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{plan.description}</p>
              
              <div className="mb-6 flex-grow">
                <h4 className="font-semibold mb-2">Features:</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {plan.limitations.length > 0 && (
                  <>
                    <h4 className="font-semibold mt-4 mb-2">Limitations:</h4>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation) => (
                        <li key={limitation} className="flex items-start">
                          <svg className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="text-sm">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
              
              <button 
                className={`w-full py-3 rounded-lg font-medium transition-all ${
                  plan.popular 
                    ? 'bg-luna-primary text-white hover:bg-opacity-90' 
                    : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-gray-500 dark:text-gray-400">
            All plans include a 7-day free trial. No credit card required to start.
            <br />
            Need a custom solution? <a href="#" className="text-luna-primary underline">Contact us</a> for enterprise options.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;