'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import ProtectedLayout from '../../components/layouts/ProtectedLayout';

interface Agent {
  id: string;
  name: string;
  persona: {
    role: string;
    personality: string;
    goals?: string[];
  };
  createdAt: string;
  workspaceId: string | null;
}

export default function AgentsPage() {
  const { data: session } = useSession();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');

  // Fetch agents on component mount
  useEffect(() => {
    // In a real implementation, this would be an API call
    // For now, we'll use mock data
    const mockAgents = [
      {
        id: '1',
        name: 'Research Assistant',
        persona: {
          role: 'Research Assistant',
          personality: 'Helpful and detail-oriented',
          goals: ['Find relevant information', 'Organize research'],
        },
        createdAt: '2023-04-15T10:30:00Z',
        workspaceId: '1',
      },
      {
        id: '2',
        name: 'Code Reviewer',
        persona: {
          role: 'Code Reviewer',
          personality: 'Analytical and thorough',
          goals: ['Find bugs', 'Suggest improvements'],
        },
        createdAt: '2023-04-20T14:15:00Z',
        workspaceId: '1',
      },
      {
        id: '3',
        name: 'Content Writer',
        persona: {
          role: 'Content Writer',
          personality: 'Creative and articulate',
          goals: ['Generate engaging content', 'Adapt to different tones'],
        },
        createdAt: '2023-05-05T09:45:00Z',
        workspaceId: '2',
      },
      {
        id: '4',
        name: 'Data Analyst',
        persona: {
          role: 'Data Analyst',
          personality: 'Precise and methodical',
          goals: ['Analyze data patterns', 'Generate insights'],
        },
        createdAt: '2023-05-10T16:20:00Z',
        workspaceId: null,
      },
      {
        id: '5',
        name: 'Customer Support Agent',
        persona: {
          role: 'Customer Support',
          personality: 'Friendly and patient',
          goals: ['Resolve customer issues', 'Provide clear information'],
        },
        createdAt: '2023-05-18T11:10:00Z',
        workspaceId: '2',
      },
    ];
    
    setAgents(mockAgents);
    setIsLoading(false);
  }, []);

  // Filter agents based on search query and filter
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = 
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.persona.role.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (currentFilter === 'all') return matchesSearch;
    if (currentFilter === 'personal') return matchesSearch && !agent.workspaceId;
    return matchesSearch && agent.workspaceId === currentFilter;
  });

  return (
    <ProtectedLayout>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">AI Agents</h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage your custom AI agents
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/agents/create"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Create Agent
          </Link>
        </div>
      </div>

      {/* Search and filter */}
      <div className="mt-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-grow">
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search agents by name or role..."
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div>
          <select
            id="filter"
            name="filter"
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={currentFilter}
            onChange={(e) => setCurrentFilter(e.target.value)}
          >
            <option value="all">All Agents</option>
            <option value="personal">Personal Agents</option>
            <option value="1">Personal Projects Workspace</option>
            <option value="2">Work Workspace</option>
          </select>
        </div>
      </div>

      {/* Agents grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600"></div>
        </div>
      ) : filteredAgents.length > 0 ? (
        <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAgents.map((agent) => (
            <Link
              key={agent.id}
              href={`/agents/${agent.id}`}
              className="block hover:bg-gray-50 bg-white overflow-hidden shadow rounded-lg border border-gray-200 transition-shadow hover:shadow-md"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-xl text-indigo-800 font-medium">
                      {agent.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-indigo-600 truncate">{agent.name}</h3>
                    <p className="text-sm text-gray-500">{agent.persona.role}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    <span className="font-medium">Personality:</span> {agent.persona.personality}
                  </p>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(agent.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
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
          <h3 className="mt-2 text-lg font-medium text-gray-900">No agents found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery
              ? `No agents match your search "${searchQuery}"`
              : "You haven't created any agents yet."}
          </p>
          <div className="mt-6">
            <Link
              href="/agents/create"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create your first agent
            </Link>
          </div>
        </div>
      )}
    </ProtectedLayout>
  );
}
