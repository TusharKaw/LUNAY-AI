'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiHome, FiMessageSquare, FiSettings, FiLogOut, FiMenu, FiX, FiUser } from 'react-icons/fi';
import { removeToken } from '../../utils/auth';

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          router.push('/auth/login');
          return;
        }
        
        const response = await fetch('/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/users/logout', {
        method: 'POST',
      });
      
      removeToken();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: <FiHome />, href: '/dashboard' },
    { name: 'Chat', icon: <FiMessageSquare />, href: '/chat' },
    { name: 'Settings', icon: <FiSettings />, href: '/settings' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-indigo-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <motion.aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform lg:translate-x-0 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:z-0`}
        initial={false}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-luna-primary to-luna-secondary flex items-center justify-center text-white font-bold text-xl">
                  L
                </div>
                <span className="ml-2 text-xl font-semibold bg-gradient-to-r from-luna-primary to-luna-secondary bg-clip-text text-transparent">
                  Luna AI
                </span>
              </Link>
              <button 
                className="lg:hidden text-gray-500 hover:text-gray-700"
                onClick={() => setIsSidebarOpen(false)}
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          {/* User info */}
          {user && (
            <div className="p-4 border-b">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  {user.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt={user.name} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <FiUser className="text-indigo-600" />
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-colors ${
                  typeof window !== 'undefined' && window.location.pathname === item.href
                    ? 'bg-indigo-50 text-indigo-700'
                    : ''
                }`}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <span className="text-xl mr-3"><FiLogOut /></span>
              Logout
            </button>
          </nav>
          
          {/* Subscription info */}
          <div className="p-4 border-t">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-4 text-white">
              <p className="text-sm font-medium mb-1">
                {user?.subscription?.type === 'free' ? 'Free Plan' : 'Premium Plan'}
              </p>
              {user?.subscription?.type === 'free' ? (
                <Link 
                  href="/subscription" 
                  className="text-xs bg-white text-indigo-700 px-2 py-1 rounded-full inline-block mt-1 hover:bg-indigo-100 transition-colors"
                >
                  Upgrade Now
                </Link>
              ) : (
                <p className="text-xs opacity-80">
                  {user?.subscription?.status === 'active' ? 'Active' : 'Inactive'}
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top navbar */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <button
              className="lg:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setIsSidebarOpen(true)}
            >
              <FiMenu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/subscription" 
                className={`text-sm px-3 py-1 rounded-full ${
                  user?.subscription?.type === 'free'
                    ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {user?.subscription?.type === 'free' ? 'Free Plan' : 'Premium Plan'}
              </Link>
              
              <div className="relative">
                <button className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  {user?.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt={user.name} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <FiUser className="text-indigo-600" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}