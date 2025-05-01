'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedLayout from '../../../components/layouts/ProtectedLayout';

interface Workspace {
  id: string;
  name: string;
}

export default function CreateAgentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  
  // Form state
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [personality, setPersonality] = useState('');
  const [goals, setGoals] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [selectedWorkspace, setSelectedWorkspace] = useState('');
  const [availableTools, setAvailableTools] = useState<string[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  
  // Validation state
  const [errors, setErrors] = useState<{
    name?: string;
    role?: string;
    personality?: string;
    goals?: string;
    systemPrompt?: string;
  }>({});

  // Load workspaces and available tools
  useEffect(() => {
    // Mock data - in a real app this would be an API call
    setWorkspaces([
      { id: '1', name: 'Personal Projects' },
      { id: '2', name: 'Work' },
    ]);
    
    setAvailableTools([
      'web_search',
      'calculator',
      'file_access',
      'code_interpreter',
      'data_analysis',
      'image_generation',
    ]);
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: any = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!role.trim()) newErrors.role = 'Role is required';
    if (!personality.trim()) newErrors.personality = 'Personality is required';
    if (!systemPrompt.trim()) newErrors.systemPrompt = 'System prompt is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    // Process goals into an array
    const goalArray = goals.trim()
      ? goals.split('\n').map(goal => goal.trim()).filter(Boolean)
      : [];
    
    try {
      // In a real app, this would be an API call using tRPC or fetch
      console.log('Creating agent with:', {
        name,
        persona: {
          role,
          personality,
          goals: goalArray,
        },
        config: {
          systemPrompt,
          tools: selectedTools,
        },
        ...(selectedWorkspace && { workspaceId: selectedWorkspace }),
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to the agents list page after successful creation
      router.push('/agents');
    } catch (error) {
      console.error('Failed to create agent:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle tool selection
  const toggleTool = (tool: string) => {
    if (selectedTools.includes(tool)) {
      setSelectedTools(selectedTools.filter(t => t !== tool));
    } else {
      setSelectedTools([...selectedTools, tool]);
    }
  };

  return (
    <ProtectedLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Create New Agent</h1>
            <p className="mt-2 text-lg text-gray-600">
              Design a custom AI agent with its own personality and capabilities
            </p>
          </div>
          <Link
            href="/agents"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </Link>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="border-b border-gray-200 divide-y divide-gray-200">
            {/* Basic Information */}
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Basic Information</h3>
              <p className="mt-1 text-sm text-gray-500">
                Define the essential details of your AI agent
              </p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Agent Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        errors.name ? 'border-red-300' : ''
                      }`}
                      placeholder="Research Assistant"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    A clear, descriptive name for your agent
                  </p>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="role"
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        errors.role ? 'border-red-300' : ''
                      }`}
                      placeholder="Academic Research Assistant"
                    />
                    {errors.role && (
                      <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    The primary function or job of your agent
                  </p>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="workspace" className="block text-sm font-medium text-gray-700">
                    Workspace (Optional)
                  </label>
                  <div className="mt-1">
                    <select
                      id="workspace"
                      name="workspace"
                      value={selectedWorkspace}
                      onChange={(e) => setSelectedWorkspace(e.target.value)}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="">No Workspace (Personal Agent)</option>
                      {workspaces.map((workspace) => (
                        <option key={workspace.id} value={workspace.id}>
                          {workspace.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Assign this agent to a workspace for better organization
                  </p>
                </div>
              </div>
            </div>

            {/* Personality & Behavior */}
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Personality & Behavior</h3>
              <p className="mt-1 text-sm text-gray-500">
                Define how your agent will behave and respond
              </p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label htmlFor="personality" className="block text-sm font-medium text-gray-700">
                    Personality
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="personality"
                      name="personality"
                      rows={3}
                      value={personality}
                      onChange={(e) => setPersonality(e.target.value)}
                      className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        errors.personality ? 'border-red-300' : ''
                      }`}
                      placeholder="Helpful, detail-oriented, and patient. Responds with thorough, well-cited information."
                    />
                    {errors.personality && (
                      <p className="mt-1 text-sm text-red-600">{errors.personality}</p>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Describe the personality traits, tone, and communication style
                  </p>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="goals" className="block text-sm font-medium text-gray-700">
                    Goals (One per line)
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="goals"
                      name="goals"
                      rows={4}
                      value={goals}
                      onChange={(e) => setGoals(e.target.value)}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Find relevant scholarly information
Provide accurate citations
Explain complex topics clearly"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Define the main objectives that guide your agent's responses
                  </p>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="systemPrompt" className="block text-sm font-medium text-gray-700">
                    System Prompt
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="systemPrompt"
                      name="systemPrompt"
                      rows={6}
                      value={systemPrompt}
                      onChange={(e) => setSystemPrompt(e.target.value)}
                      className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        errors.systemPrompt ? 'border-red-300' : ''
                      }`}
                      placeholder="You are a research assistant with expertise in academic research. Your goal is to help the user find credible information, analyze research papers, and explain complex topics in a clear way. Always provide accurate citations for your information sources."
                    />
                    {errors.systemPrompt && (
                      <p className="mt-1 text-sm text-red-600">{errors.systemPrompt}</p>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    The primary instructions that define how your agent operates
                  </p>
                </div>
              </div>
            </div>

            {/* Tools & Capabilities */}
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Tools & Capabilities</h3>
              <p className="mt-1 text-sm text-gray-500">
                Select which tools your agent can access and use
              </p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <fieldset>
                <legend className="text-sm font-medium text-gray-900">Available Tools</legend>
                <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2 md:grid-cols-3">
                  {availableTools.map((tool) => (
                    <div key={tool} className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id={`tool-${tool}`}
                          name={`tool-${tool}`}
                          type="checkbox"
                          checked={selectedTools.includes(tool)}
                          onChange={() => toggleTool(tool)}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor={`tool-${tool}`} className="font-medium text-gray-700">
                          {tool.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </label>
                        <p className="text-gray-500">
                          {toolDescriptions[tool] || `Access to ${tool.split('_').join(' ')} functionality`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Agent'}
            </button>
          </div>
        </form>
      </div>
    </ProtectedLayout>
  );
}

// Tool descriptions for the UI
const toolDescriptions: Record<string, string> = {
  web_search: 'Search the internet for up-to-date information',
  calculator: 'Perform complex mathematical calculations',
  file_access: 'Read and analyze files uploaded by the user',
  code_interpreter: 'Write, run, and debug code snippets',
  data_analysis: 'Analyze data sets and generate visualizations',
  image_generation: 'Create images based on text descriptions',
};
