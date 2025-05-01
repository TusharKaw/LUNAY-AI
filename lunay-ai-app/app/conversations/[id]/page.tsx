'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedLayout from '../../../components/layouts/ProtectedLayout';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
  toolCalls?: any[];
}

interface Conversation {
  id: string;
  agentId: string;
  agentName: string;
  agentRole: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export default function ConversationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // Fetch conversation details
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real implementation, this would be an API call using tRPC
        // For now, we'll use mock data
        
        // Mock messages with correct typing
        const mockMessages: Message[] = [
          {
            id: '1',
            role: 'system' as const,
            content: 'I am initialized and ready to assist with research tasks.',
            createdAt: '2023-04-15T10:35:00Z',
          },
          {
            id: '2',
            role: 'user' as const,
            content: 'Can you help me find recent research on climate change impacts?',
            createdAt: '2023-04-15T10:36:00Z',
          },
          {
            id: '3',
            role: 'assistant' as const,
            content: 'I\'d be happy to help you find recent research on climate change impacts. Here are some key findings from recent studies:\n\n1. The IPCC\'s Sixth Assessment Report (2021) indicates that climate change is intensifying the water cycle, leading to more intense rainfall and associated flooding in some regions, and more intense drought in many others.\n\n2. A 2022 study in Nature Climate Change found that climate change is causing more frequent and intense extreme weather events globally.\n\n3. Research published in Science (2023) shows accelerating sea level rise that could affect coastal communities more rapidly than previously projected.\n\nWould you like me to focus on a specific aspect of climate change impacts, such as effects on biodiversity, agriculture, or human health?',
            createdAt: '2023-04-15T10:37:00Z',
          },
          {
            id: '4',
            role: 'user' as const,
            content: 'Yes, please focus on biodiversity impacts.',
            createdAt: '2023-04-15T10:38:00Z',
          },
          {
            id: '5',
            role: 'assistant' as const,
            content: 'Here are recent research findings on climate change impacts on biodiversity:\n\n1. A comprehensive global study in Science (2022) found that up to 50% of species may face extinction due to climate change by 2100 under high emission scenarios.\n\n2. Research in Nature Ecology & Evolution (2023) shows that climate change is disrupting migration patterns of birds and timing of seasonal behaviors, leading to mismatches between predators and prey.\n\n3. The latest IPBES report indicates that warming oceans are causing widespread coral bleaching events, threatening reef ecosystems that support about 25% of all marine species.\n\n4. A 2022 meta-analysis in PNAS found that tropical species are particularly vulnerable as they have narrower thermal tolerance ranges and fewer adaptation options.\n\n5. Studies in Conservation Biology show that climate change is interacting with other threats like habitat loss and invasive species, creating "threat multiplier" effects that accelerate biodiversity loss.\n\nWould you like me to provide more detailed information about any of these research areas or recommend specific papers for further reading?',
            createdAt: '2023-04-15T10:40:00Z',
          }
        ];
        
        // Explicitly type the conversation
        const mockConversation: Conversation = {
          id: params.id,
          agentId: '1',
          agentName: 'Research Assistant',
          agentRole: 'Academic Research Assistant',
          messages: mockMessages,
          createdAt: '2023-04-15T10:35:00Z',
          updatedAt: '2023-04-15T10:40:00Z',
        };
        
        setConversation(mockConversation);
      } catch (error) {
        console.error('Error fetching conversation:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [params.id]);

  // Scroll to bottom of messages whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  // Handle send message
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isSending || !conversation) return;
    
    const newUserMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user' as const,
      content: inputValue.trim(),
      createdAt: new Date().toISOString(),
    };
    
    setConversation(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        messages: [...prev.messages, newUserMessage],
        updatedAt: new Date().toISOString(),
      };
    });
    setInputValue('');
    setIsSending(true);
    
    try {
      // In a real implementation, this would be an API call to send the message to the agent
      // For now, we'll simulate a response
      
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const mockResponse: Message = {
        id: `response-${Date.now()}`,
        role: 'assistant' as const,
        content: `Thank you for your question about "${inputValue.trim()}". This is a simulated response. In a real implementation, this would come from the AI agent through an API call.`,
        createdAt: new Date().toISOString(),
      };
      
      setConversation(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: [...prev.messages, mockResponse],
          updatedAt: new Date().toISOString(),
        };
      });
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  // Delete conversation handler
  const handleDeleteConversation = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this conversation? This action cannot be undone.'
    );
    
    if (confirmDelete) {
      try {
        // In a real implementation, this would be an API call
        console.log('Deleting conversation with ID:', params.id);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Redirect to conversations list after successful deletion
        router.push('/conversations');
      } catch (error) {
        console.error('Error deleting conversation:', error);
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center h-64">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600"></div>
        </div>
      </ProtectedLayout>
    );
  }

  // If conversation not found
  if (!conversation) {
    return (
      <ProtectedLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900">Conversation not found</h2>
          <p className="mt-2 text-gray-600">
            The conversation you are looking for does not exist or has been deleted.
          </p>
          <div className="mt-6">
            <Link
              href="/conversations"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Back to Conversations
            </Link>
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Conversation with {conversation.agentName}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Started on {new Date(conversation.createdAt).toLocaleDateString()} at{' '}
              {new Date(conversation.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <Link
              href={`/agents/${conversation.agentId}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              View Agent
            </Link>
            <button
              onClick={handleDeleteConversation}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Chat interface */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg flex flex-col h-[70vh]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {conversation.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-lg px-4 py-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : message.role === 'system'
                    ? 'bg-gray-300 text-gray-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div
                  className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-indigo-200' : 'text-gray-500'
                  }`}
                >
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Type your message..."
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isSending}
            />
            <button
              type="button"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isSending}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSending ? (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              Send
            </button>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
