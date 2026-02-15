'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Organization {
  id: string;
  name: string;
  role: string;
}

export default function OrganizationSelector() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchOrganizations();
    // Get selected org from URL params or cookie
    const pathMatch = window.location.pathname.match(/\/organizations\/([^/]+)/);
    if (pathMatch) {
      setSelectedOrgId(pathMatch[1]);
    } else {
      const orgCookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('organization-id='));
      if (orgCookie) {
        setSelectedOrgId(orgCookie.split('=')[1]);
      }
    }
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await fetch('/api/organizations');
      if (response.ok) {
        const data = await response.json();
        setOrganizations(data.organizations || []);
        
        // Auto-select first org if none selected
        if (!selectedOrgId && data.organizations?.length > 0) {
          handleSelectOrg(data.organizations[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOrg = async (orgId: string) => {
    setSelectedOrgId(orgId);
    
    // Set cookie
    document.cookie = `organization-id=${orgId}; path=/; max-age=31536000`; // 1 year
    
    // Navigate to dashboard of selected organization
    router.push(`/organizations/${orgId}/dashboard`);
  };

  if (loading) {
    return (
      <div className="px-3 py-1.5 text-xs text-zinc-500 dark:text-zinc-400">
        Loading...
      </div>
    );
  }

  if (organizations.length === 0) {
    return (
      <div className="px-3 py-1.5 text-xs text-zinc-500 dark:text-zinc-400">
        No organizations
      </div>
    );
  }

  const selectedOrg = organizations.find((org) => org.id === selectedOrgId);

  return (
    <div className="relative">
      <select
        value={selectedOrgId || ''}
        onChange={(e) => handleSelectOrg(e.target.value)}
        className="px-3 py-1.5 text-sm font-medium bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
      >
        {organizations.map((org) => (
          <option key={org.id} value={org.id}>
            {org.name} ({org.role})
          </option>
        ))}
      </select>
    </div>
  );
}
