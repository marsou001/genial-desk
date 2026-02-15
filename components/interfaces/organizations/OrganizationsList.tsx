'use client';

import { useState } from 'react';
import Link from 'next/link';
import { OrganizationView } from '@/types';
import CreateOrganizationDialog from './CreateOrganizationDialog';

export default function OrganizationsList({ organizations }: { organizations: OrganizationView[] }) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <>
      {organizations.length === 0 ? (
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-8 text-center">
          <div className="text-6xl mb-4">🏢</div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
            No organizations yet
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Create your first organization to start managing customer feedback.
          </p>
          <button
            onClick={() => setShowCreateDialog(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Create Organization
          </button>
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          {organizations.map((org) => (
            <Link
              key={org.id}
              href={`/organizations/${org.id}/projects`}
              className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    {org.name}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Role: <span className="capitalize">{org.role}</span>
                  </p>
                </div>
                <div className="text-blue-600 dark:text-blue-400">
                  →
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {organizations.length > 0 && (
        <button
          onClick={() => setShowCreateDialog(true)}
          className="w-full px-6 py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-50 font-medium rounded-lg transition-colors border border-zinc-300 dark:border-zinc-700"
        >
          + Create New Organization
        </button>
      )}

      {showCreateDialog && <CreateOrganizationDialog handleClose={() => setShowCreateDialog(false)} />}
    </>
  );
}
