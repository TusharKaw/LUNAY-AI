'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedLayout from '../../../components/layouts/ProtectedLayout';

interface InviteMember {
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}

export default function CreateTeamPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Invitation management
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'editor' | 'viewer'>('editor');
  const [invites, setInvites] = useState<InviteMember[]>([]);

  // Add member to invitation list
  const handleAddMember = () => {
    // Basic email validation
    if (!inviteEmail.trim() || !/\S+@\S+\.\S+/.test(inviteEmail)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Check for duplicates
    if (invites.some(invite => invite.email === inviteEmail.trim())) {
      setError('This email has already been added');
      return;
    }
    
    setInvites([...invites, { email: inviteEmail.trim(), role: inviteRole }]);
    setInviteEmail('');
    setError('');
  };

  // Remove member from invitation list
  const handleRemoveMember = (email: string) => {
    setInvites(invites.filter(invite => invite.email !== email));
  };

  // Update member role
  const handleUpdateRole = (email: string, newRole: 'admin' | 'editor' | 'viewer') => {
    setInvites(
      invites.map(invite => 
        invite.email === email ? { ...invite, role: newRole } : invite
      )
    );
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Team name is required');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // In a real implementation, this would be an API call
      console.log('Creating team with:', {
        name,
        members: invites,
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to teams list after successful creation
      router.push('/teams');
    } catch (error) {
      console.error('Failed to create team:', error);
      setError('Failed to create team. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Create New Team</h1>
            <p className="mt-2 text-lg text-gray-600">
              Collaborate with others on agents and workspaces
            </p>
          </div>
          <Link
            href="/teams"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </Link>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Team Details</h3>
            <p className="mt-1 text-sm text-gray-500">
              Set your team name and invite members
            </p>
          </div>
          
          {error && (
            <div className="mx-4 mt-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <div className="px-4 py-5 sm:p-6 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Team Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="e.g., Product Team"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Choose a descriptive name for your team
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Invite Team Members</h3>
              <p className="mt-1 text-sm text-gray-500">
                Invite collaborators to your team by email
              </p>
              
              <div className="mt-4 flex flex-wrap sm:flex-nowrap items-start space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="w-full sm:w-3/5">
                  <label htmlFor="invite-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="invite-email"
                    name="invite-email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="team.member@example.com"
                  />
                </div>
                <div className="w-full sm:w-1/5">
                  <label htmlFor="invite-role" className="sr-only">
                    Role
                  </label>
                  <select
                    id="invite-role"
                    name="invite-role"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
                <div className="w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleAddMember}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              {/* Invited members list */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500">Invited Members</h4>
                <div className="mt-2">
                  {invites.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No members invited yet</p>
                  ) : (
                    <ul className="divide-y divide-gray-200 border-t border-b border-gray-200">
                      {invites.map((invite) => (
                        <li key={invite.email} className="py-3 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="text-sm text-indigo-800 font-medium">
                                {invite.email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{invite.email}</p>
                              <div className="mt-1">
                                <select
                                  value={invite.role}
                                  onChange={(e) => handleUpdateRole(
                                    invite.email,
                                    e.target.value as 'admin' | 'editor' | 'viewer'
                                  )}
                                  className="block w-full pl-3 pr-10 py-1 text-xs border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                                >
                                  <option value="admin">Admin</option>
                                  <option value="editor">Editor</option>
                                  <option value="viewer">Viewer</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(invite.email)}
                            className="ml-2 text-red-600 hover:text-red-900"
                          >
                            <svg
                              className="h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Note:</span> You'll be automatically added as an Admin to the team.
                </p>
              </div>
            </div>
          </div>
          
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Team'}
            </button>
          </div>
        </form>
      </div>
    </ProtectedLayout>
  );
}
