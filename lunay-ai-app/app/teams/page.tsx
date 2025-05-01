'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import ProtectedLayout from '../../components/layouts/ProtectedLayout';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}

interface Team {
  id: string;
  name: string;
  memberCount: number;
  createdAt: string;
  members: TeamMember[];
}

export default function TeamsPage() {
  const { data: session } = useSession();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch teams on component mount
  useEffect(() => {
    // In a real implementation, this would be an API call
    // For now, we'll use mock data
    const mockTeams = [
      {
        id: '1',
        name: 'Product Team',
        memberCount: 5,
        createdAt: '2023-04-10T08:30:00Z',
        members: [
          {
            id: '1',
            name: 'You',
            email: session?.user?.email || 'user@example.com',
            role: 'admin',
          },
          {
            id: '2',
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            role: 'editor',
          },
          {
            id: '3',
            name: 'Michael Chen',
            email: 'michael@example.com',
            role: 'viewer',
          },
        ],
      },
      {
        id: '2',
        name: 'Marketing',
        memberCount: 4,
        createdAt: '2023-04-15T14:45:00Z',
        members: [
          {
            id: '1',
            name: 'You',
            email: session?.user?.email || 'user@example.com',
            role: 'editor',
          },
          {
            id: '4',
            name: 'Jessica Smith',
            email: 'jessica@example.com',
            role: 'admin',
          },
        ],
      },
      {
        id: '3',
        name: 'Engineering',
        memberCount: 8,
        createdAt: '2023-05-02T09:20:00Z',
        members: [
          {
            id: '1',
            name: 'You',
            email: session?.user?.email || 'user@example.com',
            role: 'admin',
          },
          {
            id: '5',
            name: 'David Wilson',
            email: 'david@example.com',
            role: 'editor',
          },
        ],
      },
    ];
    
    setTeams(mockTeams);
    setIsLoading(false);
  }, [session]);

  // Filter teams based on search query
  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedLayout>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Teams</h1>
          <p className="mt-2 text-lg text-gray-600">
            Collaborate with others on agents and workspaces
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/teams/create"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5"
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
            Create Team
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="mt-6">
        <div className="relative flex-grow">
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search teams by name..."
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
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Teams grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600"></div>
        </div>
      ) : filteredTeams.length > 0 ? (
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredTeams.map((team) => (
              <li key={team.id}>
                <Link
                  href={`/teams/${team.id}`}
                  className="block hover:bg-gray-50"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-xl text-indigo-800 font-medium">
                            {team.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-indigo-600">{team.name}</p>
                          <p className="text-sm text-gray-500">
                            {team.memberCount} {team.memberCount === 1 ? 'member' : 'members'}
                          </p>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          team.members.find(m => m.email === session?.user?.email)?.role === 'admin'
                            ? 'bg-green-100 text-green-800'
                            : team.members.find(m => m.email === session?.user?.email)?.role === 'editor'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {team.members.find(m => m.email === session?.user?.email)?.role === 'admin'
                            ? 'Admin'
                            : team.members.find(m => m.email === session?.user?.email)?.role === 'editor'
                            ? 'Editor'
                            : 'Viewer'}
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
                          Team members: {team.members.slice(0, 2).map(m => m.name).join(', ')}
                          {team.members.length > 2 ? ` +${team.members.length - 2} more` : ''}
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
                          Created{' '}
                          <time dateTime={team.createdAt}>
                            {new Date(team.createdAt).toLocaleDateString()}
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
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No teams found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery
              ? `No teams match your search "${searchQuery}"`
              : "You don't have any teams yet."}
          </p>
          <div className="mt-6">
            <Link
              href="/teams/create"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
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
              Create your first team
            </Link>
          </div>
        </div>
      )}
    </ProtectedLayout>
  );
}
