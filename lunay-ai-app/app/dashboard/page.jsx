'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiPlus, FiSettings, FiLogOut } from 'react-icons/fi';

export default function Dashboard() {
  const [companions, setCompanions] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/auth/login');
      return;
    }
    
    // Fetch user data and companions
    const fetchData = async () => {
      try {
        // Fetch user profile
        const userResponse = await fetch('/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user profile');
        }
        
        const userData = await userResponse.json();
        setUser(userData);
        
        // Fetch companions
        const companionsResponse = await fetch('/api/companions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!companionsResponse.ok) {
          throw new Error('Failed to fetch companions');
        }
        
        const companionsData = await companionsResponse.json();
        setCompanions(companionsData);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [router]);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-indigo-700">Loading your companions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            Luna AI
          </Link>
          
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                  {user.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt={user.name} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-indigo-700 font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="text-gray-700 font-medium hidden md:inline">
                  {user.name}
                </span>
              </div>
            )}
            
            <button 
              onClick={() => router.push('/settings')}
              className="p-2 rounded-full hover:bg-gray-100"
              title="Settings"
            >
              <FiSettings className="w-5 h-5 text-gray-600" />
            </button>
            
            <button 
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-gray-100"
              title="Logout"
            >
              <FiLogOut className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Companions</h1>
          <p className="text-gray-600 mt-2">
            Chat with your existing companions or create a new one
          </p>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {/* Companions grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Create new companion card */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-dashed border-indigo-200 flex flex-col items-center justify-center p-6 h-64 cursor-pointer"
            onClick={() => router.push('/onboarding')}
          >
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
              <FiPlus className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Create New Companion</h3>
            <p className="text-sm text-gray-500 text-center">
              Design a new AI companion to chat with
            </p>
          </motion.div>
          
          {/* Existing companions */}
          {companions.map((companion) => (
            <motion.div
              key={companion._id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
              onClick={() => router.push(`/chat/${companion._id}`)}
            >
              <div className="h-40 bg-indigo-100 relative">
                <img 
                  src={`/images/${companion.type || 'female'}-avatar.png`}
                  alt={companion.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{companion.name}</h3>
                <p className="text-sm text-gray-500 mb-2 capitalize">{companion.personality?.type || 'Friendly'}</p>
                <div className="flex items-center text-xs text-gray-400">
                  <span>Last chat: {companion.lastInteraction 
                    ? new Date(companion.lastInteraction).toLocaleDateString() 
                    : 'Never'}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Subscription upsell */}
        {user && user.subscription?.type === 'free' && companions.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-xl font-bold mb-2">Upgrade to Premium</h2>
                <p className="text-indigo-100">
                  Get more companions, advanced personalities, and exclusive features
                </p>
              </div>
              <button
                onClick={() => router.push('/subscription')}
                className="px-6 py-2 bg-white text-indigo-600 rounded-md font-medium hover:bg-indigo-50"
              >
                View Plans
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}