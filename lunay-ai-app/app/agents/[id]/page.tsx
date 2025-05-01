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

interface Agent {
  id: string;
  name: string;
  persona: {
    role: string;
    personality: string;
    goals?: string[];
  };
  config?: {
    systemPrompt?: string;
    tools?: string[];
  };
  createdAt: string;
}

interface MemoryItem {
  id: string;
  content: string;
  type: string;
  createdAt: string;
}

export default function AgentDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');

  // Fetch agent details, chat history, and memories
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real implementation, these would be API calls using tRPC
        // For now, we'll use mock data
        
        // Mock agent data
        const mockAgent = {
          id: params.id,
          name: 'Research Assistant',
          persona: {
            role: 'Research Assistant',
            personality: 'Helpful and detail-oriented',
            goals: ['Find relevant information', 'Provide accurate citations'],
          },
          config: {
            systemPrompt: 'You are a research assistant with expertise in academic research. Your goal is to help the user find credible information and analyze research papers.',
            tools: ['web_search', 'file_access'],
          },
          createdAt: '2023-04-15T10:30:00Z',
        };
        
        // Mock chat history
        const mockMessages = [
          {
            id: '1',
            role: 'system',
            content: 'I am initialized and ready to assist with research tasks.',
            createdAt: '2023-04-15T10:35:00Z',
          },
          {
            id: '2',
            role: 'user',
            content: 'Can you help me find recent research on climate change impacts?',
            createdAt: '2023-04-15T10:36:00Z',
          },
          {
            id: '3',
            role: 'assistant',
            content: 'I\'d be happy to help you find recent research on climate change impacts. Here are some key findings from recent studies:\n\n1. The IPCC\'s Sixth Assessment Report (2021) indicates that climate change is intensifying the water cycle, leading to more intense rainfall and associated flooding in some regions, and more intense drought in many others.\n\n2. A 2022 study in Nature Climate Change found that climate change is causing more frequent and intense extreme weather events globally.\n\n3. Research published in Science (2023) shows accelerating sea level rise that could affect coastal communities more rapidly than previously projected.\n\nWould you like me to focus on a specific aspect of climate change impacts, such as effects on biodiversity, agriculture, or human health?',
            createdAt: '2023-04-15T10:37:00Z',
          },
          {
            id: '4',
            role: 'user',
            content: 'Yes, please focus on biodiversity impacts.',
            createdAt: '2023-04-15T10:38:00Z',
          },
          {
            id: '5',
            role: 'assistant',
            content: 'Here are recent research findings on climate change impacts on biodiversity:\n\n1. A comprehensive global study in Science (2022) found that up to 50% of species may face extinction due to climate change by 2100 under high emission scenarios.\n\n2. Research in Nature Ecology & Evolution (2023) shows that climate change is disrupting migration patterns of birds and timing of seasonal behaviors, leading to mismatches between predators and prey.\n\n3. The latest IPBES report indicates that warming oceans are causing widespread coral bleaching events, threatening reef ecosystems that support about 25% of all marine species.\n\n4. A 2022 meta-analysis in PNAS found that tropical species are particularly vulnerable as they have narrower thermal tolerance ranges and fewer adaptation options.\n\n5. Studies in Conservation Biology show that climate change is interacting with other threats like habitat loss and invasive species, creating "threat multiplier" effects that accelerate biodiversity loss.\n\nWould you like me to provide more detailed information about any of these research areas or recommend specific papers for further reading?',
            createdAt: '2023-04-15T10:40:00Z',
          }
        ];
        
        // Mock memory items
        const mockMemories = [
          {
            id: '1',
            content: 'User is interested in climate change research',
            type: 'interest',
            createdAt: '2023-04-15T10:36:30Z',
          },
          {
            id: '2',
            content: 'User specifically interested in biodiversity impacts of climate change',
            type: 'interest',
            createdAt: '2023-04-15T10:38:30Z',
          }
        ];
        
        setAgent(mockAgent);
        setMessages(mockMessages);
        setMemories(mockMemories);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [params.id]);

  // Scroll to bottom of messages whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle send message
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isSending) return;
    
    const newUserMessage = {
      id: `temp-${Date.now()}`,
      role: 'user' as const,
      content: inputValue.trim(),
      createdAt: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue('');
    setIsSending(true);
    
    try {
      // In a real implementation, this would be an API call to send the message to the agent
      // For now, we'll simulate a response
      
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const mockResponse = {
        id: `response-${Date.now()}`,
        role: 'assistant' as const,
        content: `Thank you for your question about "${inputValue.trim()}". This is a simulated response. In a real implementation, this would come from the AI agent through an API call.`,
        createdAt: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, mockResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  // Edit agent handler (would navigate to edit page in a real implementation)
  const handleEditAgent = () => {
    console.log('Edit agent with ID:', params.id);
    // router.push(`/agents/${params.id}/edit`);
  };

  // Delete agent handler
  const handleDeleteAgent = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this agent? This action cannot be undone.'
    );
    
    if (confirmDelete) {
      try {
        // In a real implementation, this would be an API call
        console.log('Deleting agent with ID:', params.id);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Redirect to agents list after successful deletion
        router.push('/agents');
      } catch (error) {
        console.error('Error deleting agent:', error);
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

  // If agent not found
  if (!agent) {
    return (
      <ProtectedLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900">Agent not found</h2>
          <p className="mt-2 text-gray-600">
            The agent you are looking for does not exist or has been deleted.
          </p>
          <div className="mt-6">
            <Link
              href="/agents"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Back to Agents
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
            <h1 className="text-3xl font-semibold text-gray-900">{agent.name}</h1>
            <p className="mt-1 text-lg text-gray-600">{agent.persona.role}</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <button
              onClick={handleEditAgent}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit
            </button>
            <button
              onClick={handleDeleteAgent}
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

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('chat')}
            className={`${
              activeTab === 'chat'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`${
              activeTab === 'details'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('memory')}
            className={`${
              activeTab === 'memory'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Memory
          </button>
        </nav>
      </div>

      {/* Chat interface */}
      {activeTab === 'chat' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg flex flex-col h-[65vh]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
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
                    {new Date(message.createdAt).toLocaleTimeString()}
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
      )}

      {/* Agent details */}
      {activeTab === 'details' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Agent Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Details and configuration of your agent.
            </p>
          </div>
          <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{agent.name}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="mt-1 text-sm text-gray-900">{agent.persona.role}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(agent.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Tools</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {agent.config?.tools?.map((tool) => (
                    <span
                      key={tool}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mr-2 mb-2"
                    >
                      {tool.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  ))}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Personality</dt>
                <dd className="mt-1 text-sm text-gray-900">{agent.persona.personality}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Goals</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <ul className="pl-5 list-disc">
                    {agent.persona.goals?.map((goal, index) => (
                      <li key={index}>{goal}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">System Prompt</dt>
                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                  {agent.config?.systemPrompt}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}

      {/* Memory tab */}
      {activeTab === 'memory' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Agent Memory</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Long-term memory items stored by this agent.
            </p>
          </div>
          
          {memories.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {memories.map((memory) => (
                <li key={memory.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-indigo-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {memory.content}
                      </p>
                      <div className="mt-1 flex items-center">
                        <span className="text-sm text-gray-500">
                          {new Date(memory.createdAt).toLocaleString()}
                        </span>
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {memory.type}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button
                        type="button"
                        className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <svg
                          className="h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No memories yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                This agent hasn't stored any long-term memories yet.
              </p>
            </div>
          )}
          
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add Memory
            </button>
          </div>
        </div>
      )}
    </ProtectedLayout>
  );
}
