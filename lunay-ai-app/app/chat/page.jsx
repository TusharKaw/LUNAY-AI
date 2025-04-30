'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiMessageSquare, FiSearch } from 'react-icons/fi';
import DashboardLayout from '../components/DashboardLayout';

export default function ChatIndex() {
  const [companions, setCompanions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchCompanions = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          router.push('/auth/login');
          return;
        }
        
        const response = await fetch('/api/companions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch companions');
        }
        
        const data = await response.json();
        setCompanions(data);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCompanions();
  }, [router]);

  // Filter companions based on search query
  const filteredCompanions = companions.filter(companion => 
    companion.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Conversations</h1>
        <p className="text-gray-600 mt-2">
          Chat with your AI companions
        </p>
      </div>
      
      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search companions..."
            className="luna-input pl-10 w-full"
          />
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {/* No companions message */}
      {companions.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiMessageSquare className="w-10 h-10 text-indigo-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No companions yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first AI companion to start chatting
          </p>
          <button
            onClick={() => router.push('/onboarding')}
            className="luna-button-primary"
          >
            Create Companion
          </button>
        </div>
      )}
      
      {/* Companions list */}
      {companions.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredCompanions.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No companions match your search</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredCompanions.map((companion) => (
                <motion.li
                  key={companion._id}
                  whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
                  className="cursor-pointer"
                  onClick={() => router.push(`/chat/${companion._id}`)}
                >
                  <div className="px-6 py-4 flex items-center">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 overflow-hidden mr-4">
                      <img 
                        src={`/images/${companion.type || 'female'}-avatar.png`}
                        alt={companion.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{companion.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{companion.personality?.type || 'Friendly'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">
                        {companion.lastInteraction 
                          ? new Date(companion.lastInteraction).toLocaleDateString() 
                          : 'No chats yet'}
                      </p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}