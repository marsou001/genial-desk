'use client';

import { useState, useEffect } from 'react';
import { hasPermission, Permission } from '@/lib/permissions';

interface Organization {
  id: string;
  name: string;
  role: string;
  created_at: string;
}

interface Member {
  id: string;
  user_id: string;
  email: string | null;
  role: string;
}

export default function OrganizationManager() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateOrg, setShowCreateOrg] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');

  useEffect(() => {
    fetchOrganizations();
  }, []);

  useEffect(() => {
    if (selectedOrg) {
      fetchMembers();
    }
  }, [selectedOrg]);

  const fetchOrganizations = async () => {
    try {
      const response = await fetch('/api/organizations');
      if (response.ok) {
        const data = await response.json();
        setOrganizations(data.organizations || []);
        if (data.organizations?.length > 0 && !selectedOrg) {
          setSelectedOrg(data.organizations[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    if (!selectedOrg) return;
    
    try {
      const response = await fetch(`/api/organizations/${selectedOrg.id}/members`, {
        headers: {
          'x-organization-id': selectedOrg.id,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMembers(data.members || []);
      }
    } catch (error) {
      console.error('Failed to fetch members:', error);
    }
  };

  const handleCreateOrg = async () => {
    if (!newOrgName.trim()) return;

    try {
      const response = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newOrgName }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrganizations([...organizations, data.organization]);
        setSelectedOrg(data.organization);
        setNewOrgName('');
        setShowCreateOrg(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create organization');
      }
    } catch (error) {
      console.error('Failed to create organization:', error);
      alert('Failed to create organization');
    }
  };

  const userRole = selectedOrg?.role as any;
  const canManageMembers = hasPermission(userRole, 'org:members:read');

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Organizations
        </h2>
        <button
          onClick={() => setShowCreateOrg(!showCreateOrg)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + New Organization
        </button>
      </div>

      {showCreateOrg && (
        <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <input
            type="text"
            value={newOrgName}
            onChange={(e) => setNewOrgName(e.target.value)}
            placeholder="Organization name"
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 mb-3"
            onKeyDown={(e) => e.key === 'Enter' && handleCreateOrg()}
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreateOrg}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowCreateOrg(false);
                setNewOrgName('');
              }}
              className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-50 text-sm font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {organizations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            You don't belong to any organizations yet.
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            Create your first organization to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Organizations
            </h3>
            <div className="space-y-2">
              {organizations.map((org) => (
                <div
                  key={org.id}
                  onClick={() => setSelectedOrg(org)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedOrg?.id === org.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                      : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-zinc-50">
                        {org.name}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        Role: {org.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedOrg && (
            <div className="space-y-4">
              {canManageMembers && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                    Members ({members.length})
                  </h3>
                  <div className="space-y-2">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                              {member.email || member.user_id}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              {member.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
