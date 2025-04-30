'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiCheck, FiArrowLeft } from 'react-icons/fi';

export default function SubscriptionPage() {
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState('free');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/auth/login');
      return;
    }
    
    const fetchData = async () => {
      try {
        // Fetch subscription plans
        const plansResponse = await fetch('/api/subscriptions/plans');
        
        if (!plansResponse.ok) {
          throw new Error('Failed to fetch subscription plans');
        }
        
        const plansData = await plansResponse.json();
        setPlans(plansData);
        
        // Fetch user's current subscription
        const subscriptionResponse = await fetch('/api/subscriptions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (subscriptionResponse.ok) {
          const subscriptionData = await subscriptionResponse.json();
          setCurrentPlan(subscriptionData.plan);
          setBillingCycle(subscriptionData.billingCycle || 'monthly');
        }
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [router]);
  
  const handleSubscribe = async (planId) => {
    if (planId === 'free') {
      // No payment needed for free plan
      return;
    }
    
    setIsProcessing(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          plan: planId,
          billingCycle
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create checkout session');
      }
      
      // Redirect to Stripe checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const getPlanPrice = (plan) => {
    return plan.price[billingCycle];
  };
  
  const formatPrice = (price) => {
    return price === 0 ? 'Free' : `$${price.toFixed(2)}`;
  };
  
  const getYearlySavings = (plan) => {
    if (billingCycle === 'yearly' && plan.price.monthly > 0) {
      const monthlyCost = plan.price.monthly * 12;
      const yearlyCost = plan.price.yearly;
      const savings = ((monthlyCost - yearlyCost) / monthlyCost) * 100;
      return Math.round(savings);
    }
    return 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-indigo-700">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center">
          <button 
            onClick={() => router.push('/dashboard')}
            className="p-2 rounded-full hover:bg-white mr-2"
          >
            <FiArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Subscription Plans</h1>
            <p className="text-gray-600 mt-1">
              Choose the perfect plan for your AI companion experience
            </p>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {/* Billing cycle toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-1 shadow-sm inline-flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium ${
                billingCycle === 'monthly' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-medium ${
                billingCycle === 'yearly' 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Yearly
              <span className="ml-1 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>
        
        {/* Subscription plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const isCurrentPlan = currentPlan === plan.id;
            const yearlySavings = getYearlySavings(plan);
            
            return (
              <motion.div
                key={plan.id}
                whileHover={{ scale: 1.02 }}
                className={`bg-white rounded-xl shadow-lg overflow-hidden ${
                  plan.id === 'premium' ? 'border-2 border-indigo-500' : ''
                }`}
              >
                {plan.id === 'premium' && (
                  <div className="bg-indigo-500 text-white text-center py-1 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{formatPrice(getPlanPrice(plan))}</span>
                    {plan.price[billingCycle] > 0 && (
                      <span className="text-gray-500 ml-2">/ {billingCycle === 'monthly' ? 'month' : 'year'}</span>
                    )}
                    
                    {yearlySavings > 0 && (
                      <div className="mt-1 text-sm text-green-600">
                        Save {yearlySavings}% with yearly billing
                      </div>
                    )}
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start">
                      <FiCheck className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">
                        <span className="font-medium">{plan.features.maxCompanions}</span> AI companions
                      </span>
                    </li>
                    <li className="flex items-start">
                      <FiCheck className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">
                        <span className="font-medium">{plan.features.voiceMinutesPerMonth}</span> voice minutes/month
                      </span>
                    </li>
                    <li className="flex items-start">
                      <FiCheck className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">
                        {plan.features.advancedPersonality ? 'Advanced personality' : 'Basic personality'}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <FiCheck className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">
                        {plan.features.exclusiveAvatars ? 'Exclusive avatars' : 'Standard avatars'}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <FiCheck className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">
                        <span className="font-medium">{plan.features.memoryCapacity.toLocaleString()}</span> memory capacity
                      </span>
                    </li>
                  </ul>
                  
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isProcessing || isCurrentPlan}
                    className={`w-full py-3 rounded-lg font-medium ${
                      isCurrentPlan
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : plan.id === 'free'
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {isCurrentPlan 
                      ? 'Current Plan' 
                      : isProcessing && !isCurrentPlan 
                        ? 'Processing...' 
                        : plan.id === 'free' 
                          ? 'Downgrade to Free' 
                          : `Upgrade to ${plan.name}`}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* FAQ section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="divide-y divide-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">How do I change my subscription?</h3>
                <p className="text-gray-600">
                  You can upgrade or downgrade your subscription at any time. Changes will take effect immediately for upgrades, or at the end of your billing period for downgrades.
                </p>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Can I cancel my subscription?</h3>
                <p className="text-gray-600">
                  Yes, you can cancel your subscription at any time. Your subscription will remain active until the end of your current billing period.
                </p>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600">
                  We accept all major credit cards, including Visa, Mastercard, American Express, and Discover.
                </p>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Is my payment information secure?</h3>
                <p className="text-gray-600">
                  Yes, all payments are processed securely through Stripe. We never store your credit card information on our servers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}