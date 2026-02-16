'use client';

import { useActionState, useRef } from 'react';
import { updateOrganization } from '@/app/actions/organizations';
import { ErrorActionState } from '@/types';

interface OrganizationSettingsProps {
  organization: { id: number; name: string };
}

export default function OrganizationSettings({ organization }: OrganizationSettingsProps) {
  const [state, formAction, isPending] = useActionState<ErrorActionState, FormData>(
    updateOrganization,
    { error: null }
  );
  const nameInputRef = useRef<HTMLInputElement>(null)
  const isOrganizationNameValid = nameInputRef.current !== null && nameInputRef.current.value.trim().length > 2

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
        Organization Information
      </h2>
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="organization_id" value={organization.id} />
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            Organization Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            ref={nameInputRef}
            defaultValue={organization.name}
            required
            minLength={3}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="My Company"
          />
        </div>

        {state.error !== null && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200">{state.error}</p>
          </div>
        )}

        {/* TODO: toast success message */}
        {state.error === null && !isPending && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200">
              Organization updated successfully!
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isPending || !isOrganizationNameValid}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
