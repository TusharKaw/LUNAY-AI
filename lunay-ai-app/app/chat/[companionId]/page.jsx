'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiSend, FiMic, FiImage, FiMoreVertical, FiArrowLeft } from 'react-icons/fi';

export default function ChatPage({ params }) {
  const { companionId } = params;
  const [companion, setCompanion] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const router = useRouter();

  // Fetch companion data and chat history
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/auth/login');
      return;
    }
    
    const fetchData = async () => {
      try {
        // Fetch companion details
        const companionResponse = await fetch(`/api/companions/${companionId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!companionResponse.ok) {
          throw new Error('Failed to fetch companion details');
        }
        
        const companionData = await companionResponse.json();
        setCompanion(companionData);
        
        // Fetch chat history
        const chatResponse = await fetch(`/api/chat/${companionId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!chatResponse.ok) {
          throw new Error('Failed to fetch chat history');
        }
        
        const chatData = await chatResponse.json();
        setMessages(chatData.messages || []);
        
        // Add welcome message if no messages
        if (!chatData.messages || chatData.messages.length === 0) {
          const welcomeMessage = {
            _id: 'welcome',
            sender: 'companion',
            content: `Hi there! I'm ${companionData.name}. How can I help you today?`,
            contentType: 'text',
            timestamp: new Date().toISOString()
          };
          setMessages([welcomeMessage]);
        }
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [companionId, router]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    
    // Add user message to UI immediately
    const userMessage = {
      _id: Date.now().toString(),
      sender: 'user',
      content: newMessage,
      contentType: 'text',
      timestamp: new Date().toISOString()
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setNewMessage('');
    setIsSending(true);
    
    try {
      // Send message to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          companionId,
          content: userMessage.content,
          contentType: 'text'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const data = await response.json();
      
      // Add companion response to UI
      const companionMessage = {
        _id: data._id,
        sender: 'companion',
        content: data.content,
        contentType: data.contentType,
        timestamp: data.timestamp
      };
      
      setMessages((prevMessages) => [...prevMessages, companionMessage]);
    } catch (err) {
      setError('Failed to get response. Please try again.');
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-indigo-700">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Chat header */}
      <header className="bg-white shadow-sm py-3 px-4 flex items-center">
        <button 
          onClick={() => router.push('/dashboard')}
          className="p-2 rounded-full hover:bg-gray-100 mr-2"
        >
          <FiArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        {companion && (
          <div className="flex items-center flex-1">
            <div className="w-10 h-10 rounded-full bg-indigo-100 overflow-hidden mr-3">
              <img 
                src={`/images/${companion.type || 'female'}-avatar.png`}
                alt={companion.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{companion.name}</h2>
              <p className="text-xs text-gray-500 capitalize">{companion.personality?.type || 'Friendly'}</p>
            </div>
          </div>
        )}
        
        <button className="p-2 rounded-full hover:bg-gray-100">
          <FiMoreVertical className="w-5 h-5 text-gray-600" />
        </button>
      </header>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div 
              key={message._id || index}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.sender === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 rounded-tl-none shadow-sm'
                }`}
              >
                <div className="text-sm">{message.content}</div>
                <div 
                  className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-indigo-200' : 'text-gray-400'
                  }`}
                >
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {isSending && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 rounded-2xl rounded-tl-none shadow-sm px-4 py-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Message input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
            <button 
              type="button"
              className="p-2 rounded-full hover:bg-gray-200"
              title="Voice message"
            >
              <FiMic className="w-5 h-5 text-gray-600" />
            </button>
            
            <button 
              type="button"
              className="p-2 rounded-full hover:bg-gray-200 mr-2"
              title="Send image"
            >
              <FiImage className="w-5 h-5 text-gray-600" />
            </button>
            
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Message ${companion?.name || ''}...`}
              className="flex-1 bg-transparent border-none focus:outline-none px-2"
            />
            
            <button 
              type="submit"
              disabled={!newMessage.trim() || isSending}
              className={`p-2 rounded-full ${
                newMessage.trim() && !isSending
                  ? 'bg-indigo-600 hover:bg-indigo-700' 
                  : 'bg-gray-300'
              }`}
            >
              <FiSend className={`w-5 h-5 ${
                newMessage.trim() && !isSending ? 'text-white' : 'text-gray-500'
              }`} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}