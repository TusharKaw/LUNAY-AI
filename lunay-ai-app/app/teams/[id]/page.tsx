'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedLayout from '../../../components/layouts/ProtectedLayout';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  joinedAt: string;
}

interface Team {
  id: string;
  name: string;
  createdAt: string;
  members: TeamMember[];
}

export default function TeamPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('members');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'admin' | 'editor' | 'viewer'>('editor');

  // Fetch team details
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        // In a real implementation, this would be an API call
        // For now, we'll use mock data
        const mockTeam = {
          id: params.id,
          name: 'Product Team',
          createdAt: '2023-04-10T08:30:00Z',
          members: [
            {
              id: '1',
              name: 'Jane Doe',
              email: 'jane@example.com',
              role: 'admin',
              joinedAt: '2023-04-10T08:30:00Z',
            },
            {
              id: '2',
              name: 'Sarah Johnson',
              email: 'sarah@example.com',
              role: 'editor',
              joinedAt: '2023-04-12T14:15:00Z',
            },
            {
              id: '3',
              name: 'Michael Chen',
              email: 'michael@example.com',
              role: 'viewer',
              joinedAt: '2023-04-15T09:22:00Z',
            },
          ],
        };
        
        setTeam(mockTeam);
      } catch (error) {
        console.error('Error fetching team:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTeam();
  }, [params.id]);

  // Handle team deletion
  const handleDeleteTeam = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this team? This action cannot be undone.'
    );
    
    if (confirmDelete) {
      try {
        // In a real implementation, this would be an API call
        console.log('Deleting team with ID:', params.id);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Redirect to teams list after successful deletion
        router.push('/teams');
      } catch (error) {
        console.error('Error deleting team:', error);
      }
    }
  };

  // Handle adding a new member
  const handleAddMember = async () => {
    if (!newMemberEmail) return;
    
    try {
      // In a real implementation, this would be an API call
      console.log('Inviting new member:', {
        email: newMemberEmail,
        role: newMemberRole,
        teamId: params.id,
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state with new member (in a real app this would come from the API)
      if (team) {
        const newMember = {
          id: `temp-${Date.now()}`,
          name: newMemberEmail.split('@')[0],
          email: newMemberEmail,
          role: newMemberRole,
          joinedAt: new Date().toISOString(),
        };
        
        setTeam({
          ...team,
          members: [...team.members, newMember],
        });
        
        setNewMemberEmail('');
      }
    } catch (error) {
      console.error('Error inviting member:', error);
    }
  };

  // Handle changing a member's role
  const handleChangeRole = async (memberId: string, newRole: 'admin' | 'editor' | 'viewer') => {
    if (!team) return;
    
    try {
      // In a real implementation, this would be an API call
      console.log('Changing member role:', {
        memberId,
        newRole,
        teamId: params.id,
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setTeam({
        ...team,
        members: team.members.map(member => 
          member.id === memberId ? { ...member, role: newRole } : member
        ),
      });
    } catch (error) {
      console.error('Error changing member role:', error);
    }
  };

  // Handle removing a member
  const handleRemoveMember = async (memberId: string) => {
    if (!team) return;
    
    const confirmRemove = window.confirm(
      'Are you sure you want to remove this member from the team?'
    );
    
    if (confirmRemove) {
      try {
        // In a real implementation, this would be an API call
        console.log('Removing member:', {
          memberId,
          teamId: params.id,
        });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update local state
        setTeam({
          ...team,
          members: team.members.filter(member => member.id !== memberId),
        });
      } catch (error) {
        console.error('Error removing member:', error);
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

  // If team not found
  if (!team) {
    return (
      <ProtectedLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900">Team not found</h2>
          <p className="mt-2 text-gray-600">
            The team you are looking for does not exist or has been deleted.
          </p>
          <div className="mt-6">
            <Link
              href="/teams"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Back to Teams
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
            <h1 className="text-3xl font-semibold text-gray-900">{team.name}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Created on {new Date(team.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <Link
              href={`/teams/${team.id}/edit`}
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
              onClick={handleDeleteTeam}
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
            onClick={() => setActiveTab('members')}
            className={`${
              activeTab === 'members'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Members
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

      {/* Members tab */}
      {activeTab === 'members' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Team Members</h3>
            <p className="mt-1 text-sm text-gray-500">
              Manage members and their permissions
            </p>
          </div>
          
          {/* Add new member form */}
          <div className="px-4 py-5 sm:p-6 border-b border-gray-200">
            <h4 className="text-sm font-medium text-gray-500">Add New Member</h4>
            <div className="mt-2 flex flex-wrap sm:flex-nowrap items-start space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="w-full sm:w-3/5">
                <label htmlFor="new-member-email" className="sr-only">
                  Email address
                </label>
                <input
                  type="email"
                  id="new-member-email"
                  name="new-member-email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="team.member@example.com"
                />
              </div>
              <div className="w-full sm:w-1/5">
                <label htmlFor="new-member-role" className="sr-only">
                  Role
                </label>
                <select
                  id="new-member-role"
                  name="new-member-role"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as any)}
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
                  Invite
                </button>
              </div>
            </div>
          </div>
          
          {/* Members list */}
          <div className="px-4 py-5 sm:p-6">
            <h4 className="text-sm font-medium text-gray-500 mb-4">Current Members</h4>
            <div className="overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {team.members.map((member) => (
                    <tr key={member.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-800 font-medium">
                              {member.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{member.name}</div>
                            <div className="text-sm text-gray-500">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={member.role}
                          onChange={(e) => handleChangeRole(
                            member.id,
                            e.target.value as 'admin' | 'editor' | 'viewer'
                          )}
                          className="block w-full pl-3 pr-10 py-1 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                        >
                          <option value="admin">Admin</option>
                          <option value="editor">Editor</option>
                          <option value="viewer">Viewer</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(member.joinedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Settings tab */}
      {activeTab === 'settings' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Team Settings</h3>
            <p className="mt-1 text-sm text-gray-500">
              Manage team name and other settings
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="team-name" className="block text-sm font-medium text-gray-700">
                  Team Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="team-name"
                    id="team-name"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    defaultValue={team.name}
                    disabled
                  />
                </div>
              </div>
              
              <div className="pt-5">
                <div className="flex justify-end">
                  <Link
                    href={`/teams/${team.id}/edit`}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Edit Team
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProtectedLayout>
  );
}
