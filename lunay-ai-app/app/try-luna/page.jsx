'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TryLuna = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'luna', text: 'Hi there! I\'m Luna. It\'s so nice to meet you! How are you feeling today?' },
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message to chat
    setChatHistory([...chatHistory, { sender: 'user', text: message }]);
    
    // Clear input
    setMessage('');
    
    // Simulate Luna's response after a short delay
    setTimeout(() => {
      let response;
      
      if (message.toLowerCase().includes('how are you')) {
        response = "I'm doing wonderfully today! Thanks for asking. I always enjoy our conversations. What's been on your mind lately?";
      } else if (message.toLowerCase().includes('sad') || message.toLowerCase().includes('depressed') || message.toLowerCase().includes('unhappy')) {
        response = "I'm sorry to hear you're feeling down. Remember that it's okay to have these feelings, and they won't last forever. Would you like to talk about what's bothering you? I'm here to listen.";
      } else if (message.toLowerCase().includes('happy') || message.toLowerCase().includes('good') || message.toLowerCase().includes('great')) {
        response = "That's wonderful to hear! Your happiness brightens my day too. What's been making you feel so good lately?";
      } else {
        response = "I appreciate you sharing that with me. I'm designed to be a supportive companion, and I'm learning more about you with every conversation. Would you like to tell me more?";
      }
      
      setChatHistory([...chatHistory, { sender: 'user', text: message }, { sender: 'luna', text: response }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-luna-primary to-luna-secondary bg-clip-text text-transparent">
                  Chat with Luna
                </span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                This is a simple demo of Luna's chat capabilities. In the full version, 
                you'll experience voice interaction, emotional intelligence, and much more.
              </p>
            </motion.div>
            
            <motion.div 
              className="luna-glass-card p-4 md:p-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="h-96 overflow-y-auto mb-4 p-2">
                {chatHistory.map((chat, index) => (
                  <motion.div
                    key={index}
                    className={`mb-4 flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div 
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        chat.sender === 'user' 
                          ? 'bg-luna-primary text-white' 
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {chat.text}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="luna-input flex-grow"
                />
                <button 
                  type="submit" 
                  className="luna-button-primary"
                  disabled={!message.trim()}
                >
                  Send
                </button>
              </form>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Ready to experience the full capabilities of Luna AI?
              </p>
              <Link href="/#pricing" className="luna-button-primary">
                Explore Full Features
              </Link>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TryLuna;