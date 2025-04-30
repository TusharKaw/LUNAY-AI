'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiAlertCircle } from 'react-icons/fi';

export default function SubscriptionCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-xl shadow-lg p-8"
      >
        <div className="text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiAlertCircle className="w-12 h-12 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Subscription Canceled</h2>
          <p className="text-gray-600 mb-6">
            Your subscription process was canceled. No charges have been made to your account.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">What happens next?</h3>
            <p className="text-gray-600">
              You can continue using Luna AI with your current subscription level. If you'd like to try again or choose a different plan, you can return to the subscription page.
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => router.push('/subscription')}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}