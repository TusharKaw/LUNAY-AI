'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';

export default function SubscriptionSuccessPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/auth/login');
      return;
    }
    
    if (!sessionId) {
      router.push('/subscription');
      return;
    }
    
    const verifySubscription = async () => {
      try {
        // Fetch subscription details
        const response = await fetch('/api/subscriptions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to verify subscription');
        }
        
        const data = await response.json();
        setSubscription(data);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Wait a moment to allow webhook processing
    const timer = setTimeout(() => {
      verifySubscription();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [router, sessionId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-indigo-700">Verifying your subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-xl shadow-lg p-8"
      >
        {error ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">!</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/subscription')}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Subscription Successful!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for subscribing to the {subscription?.plan?.toUpperCase() || 'Premium'} plan. Your subscription is now active.
            </p>
            
            <div className="bg-indigo-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="text-lg font-semibold text-indigo-700 mb-2">Subscription Details</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex justify-between">
                  <span>Plan:</span>
                  <span className="font-medium capitalize">{subscription?.plan || 'Premium'}</span>
                </li>
                <li className="flex justify-between">
                  <span>Billing Cycle:</span>
                  <span className="font-medium capitalize">{subscription?.billingCycle || 'Monthly'}</span>
                </li>
                <li className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-medium capitalize">{subscription?.status || 'Active'}</span>
                </li>
                {subscription?.currentPeriodEnd && (
                  <li className="flex justify-between">
                    <span>Next Billing Date:</span>
                    <span className="font-medium">
                      {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                    </span>
                  </li>
                )}
              </ul>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => router.push('/chat')}
                className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                Start Chatting
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}