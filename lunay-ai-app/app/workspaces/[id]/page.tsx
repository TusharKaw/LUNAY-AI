'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedLayout from '../../../components/layouts/ProtectedLayout';

interface Agent {
  id: string;
  name: string;
  persona: {
    role: string;
  };
  createdAt: string;
}

interface Workspace {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export default function WorkspaceDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('agents');

  // Fetch workspace details and agents
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real implementation, these would be API calls using tRPC
        // For now, we'll use mock data
        
        // Mock workspace
        const mockWorkspace = {
          id: params.id,
          name: 'Research Projects',
          description: 'A workspace for all research-related agents and conversations',
          createdAt: '2023-04-10T08:30:00Z',
        };
        
        // Mock agents in this workspace
        const mockAgents = [
          {
            id: '1',
            name: 'Research Assistant',
            persona: {
              role: 'Research Assistant',
              personality: 'Helpful and detail-oriented',
            },
            createdAt: '2023-04-15T10:30:00Z',
          },
          {
            id: '2',
            name: 'Literature Reviewer',
            persona: {
              role: 'Literature Reviewer',
              personality: 'Thorough and analytical',
            },
            createdAt: '2023-04-20T14:15:00Z',
          },
          {
            id: '3',
            name: 'Data Analyst',
            persona: {
              role: 'Data Analyst',
              personality: 'Precise and methodical',
            },
            createdAt: '2023-05-05T09:45:00Z',
          },
        ];
        
        setWorkspace(mockWorkspace);
        setAgents(mockAgents);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [params.id]);

  // Handle workspace deletion
  const handleDeleteWorkspace = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this workspace? This will not delete the agents in the workspace, but they will no longer be associated with this workspace.'
    );
    
    if (confirmDelete) {
      try {
        // In a real implementation, this would be an API call
        console.log('Deleting workspace with ID:', params.id);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Redirect to workspaces list after successful deletion
        router.push('/workspaces');
      } catch (error) {
        console.error('Error deleting workspace:', error);
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

  // If workspace not found
  if (!workspace) {
    return (
      <ProtectedLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900">Workspace not found</h2>
          <p className="mt-2 text-gray-600">
            The workspace you are looking for does not exist or has been deleted.
          </p>
          <div className="mt-6">
            <Link
              href="/workspaces"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Back to Workspaces
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
            <h1 className="text-3xl font-semibold text-gray-900">{workspace.name}</h1>
            {workspace.description && (
              <p className="mt-1 text-lg text-gray-600">{workspace.description}</p>
            )}
            <p className="mt-2 text-sm text-gray-500">
              Created on {new Date(workspace.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <Link
              href={`/workspaces/${workspace.id}/edit`}
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
            </Link>
            <button
              onClick={handleDeleteWorkspace}
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
            onClick={() => setActiveTab('agents')}
            className={`${
              activeTab === 'agents'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Agents
          </button>
          <button
            onClick={() => setActiveTab('conversations')}
            className={`${
              activeTab === 'conversations'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Conversations
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`${
              activeTab === 'settings'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Settings
          </button>
        </nav>
      </div>

      {/* Agents tab */}
      {activeTab === 'agents' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium text-gray-900">Agents in this Workspace</h2>
            <Link
              href={`/agents/create?workspace=${workspace.id}`}
              className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                className="-ml-1 mr-1 h-4 w-4"
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
              Add Agent
            </Link>
          </div>

          {agents.length > 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {agents.map((agent) => (
                  <li key={agent.id}>
                    <Link
                      href={`/agents/${agent.id}`}
                      className="block hover:bg-gray-50"
                    >
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="text-lg text-indigo-800 font-medium">
                                {agent.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-indigo-600">{agent.name}</p>
                              <p className="text-sm text-gray-500">{agent.persona.role}</p>
                            </div>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <svg
                                className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Created by you
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <svg
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <p>
                              Created on{' '}
                              <time dateTime={agent.createdAt}>
                                {new Date(agent.createdAt).toLocaleDateString()}
                              </time>
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
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
              <h3 className="mt-2 text-lg font-medium text-gray-900">No agents in this workspace</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new agent in this workspace.</p>
              <div className="mt-6">
                <Link
                  href={`/agents/create?workspace=${workspace.id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
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
                  Create an agent
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Conversations tab */}
      {activeTab === 'conversations' && (
        <div>
          <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
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
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No conversations yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Chat with agents in this workspace to start conversations.
            </p>
            <div className="mt-6">
              <Link
                href={`/agents/${agents.length > 0 ? agents[0].id : ''}`}
                className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 ${
                  agents.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={(e) => {
                  if (agents.length === 0) {
                    e.preventDefault();
                  }
                }}
              >
                Start a conversation
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Settings tab */}
      {activeTab === 'settings' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Workspace Settings</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Manage workspace details and preferences
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <form className="space-y-6">
              <div>
                <label htmlFor="workspace-name" className="block text-sm font-medium text-gray-700">
                  Workspace Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="workspace-name"
                    id="workspace-name"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    defaultValue={workspace.name}
                    disabled
                  />
                </div>
              </div>

              <div>
                <label htmlFor="workspace-description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="workspace-description"
                    name="workspace-description"
                    rows={3}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    defaultValue={workspace.description}
                    disabled
                  />
                </div>
              </div>

              <div className="pt-5">
                <div className="flex justify-end">
                  <Link
                    href={`/workspaces/${workspace.id}/edit`}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Edit Settings
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </ProtectedLayout>
  );
}
