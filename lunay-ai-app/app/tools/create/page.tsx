'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedLayout from '../../../components/layouts/ProtectedLayout';

export default function CreateToolPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [handlerUrl, setHandlerUrl] = useState('');
  const [schema, setSchema] = useState('');
  
  // Validation state
  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
    handlerUrl?: string;
    schema?: string;
  }>({});

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: any = {};
    if (!name.trim()) newErrors.name = 'Tool name is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!handlerUrl.trim()) newErrors.handlerUrl = 'Handler URL is required';
    if (!schema.trim()) newErrors.schema = 'Schema is required';
    
    // Validate schema is valid JSON
    if (schema.trim()) {
      try {
        JSON.parse(schema);
      } catch (error) {
        newErrors.schema = 'Schema must be valid JSON';
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real implementation, this would be an API call using tRPC
      console.log('Registering tool with:', {
        name,
        description,
        handlerUrl,
        schema: JSON.parse(schema),
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to tools list after successful creation
      router.push('/tools');
    } catch (error) {
      console.error('Failed to register tool:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Register New Tool</h1>
            <p className="mt-2 text-lg text-gray-600">
              Extend your agents' capabilities with custom external tools
            </p>
          </div>
          <Link
            href="/tools"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </Link>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Tool Details</h3>
            <p className="mt-1 text-sm text-gray-500">
              Provide information about your external tool or API
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Tool Name
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
                  placeholder="e.g., Weather API"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                A clear, descriptive name for your tool
              </p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    errors.description ? 'border-red-300' : ''
                  }`}
                  placeholder="Get current weather and forecasts for any location"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                A brief description of what your tool does and when it should be used
              </p>
            </div>

            <div>
              <label htmlFor="handlerUrl" className="block text-sm font-medium text-gray-700">
                Handler URL
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="handlerUrl"
                  id="handlerUrl"
                  value={handlerUrl}
                  onChange={(e) => setHandlerUrl(e.target.value)}
                  className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    errors.handlerUrl ? 'border-red-300' : ''
                  }`}
                  placeholder="https://api.yourdomain.com/weather"
                />
                {errors.handlerUrl && (
                  <p className="mt-1 text-sm text-red-600">{errors.handlerUrl}</p>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                The URL that will be called when your tool is used
              </p>
            </div>

            <div>
              <label htmlFor="schema" className="block text-sm font-medium text-gray-700">
                Tool Schema (OpenAI Function Format)
              </label>
              <div className="mt-1">
                <textarea
                  id="schema"
                  name="schema"
                  rows={10}
                  value={schema}
                  onChange={(e) => setSchema(e.target.value)}
                  className={`font-mono shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    errors.schema ? 'border-red-300' : ''
                  }`}
                  placeholder={`{
  "name": "get_weather",
  "description": "Get the current weather in a given location",
  "parameters": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "The city and state, e.g. San Francisco, CA"
      },
      "unit": {
        "type": "string",
        "enum": ["celsius", "fahrenheit"],
        "description": "The temperature unit to use"
      }
    },
    "required": ["location"]
  }
}`}
                />
                {errors.schema && (
                  <p className="mt-1 text-sm text-red-600">{errors.schema}</p>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Define the function schema in OpenAI compatible format (see example)
              </p>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Registering...' : 'Register Tool'}
            </button>
          </div>
        </form>
      </div>
    </ProtectedLayout>
  );
}
