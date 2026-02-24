'use client';

import { useActionState, useState, useRef } from 'react';
import { updateOrganization } from '@/app/actions/organizations';
import { ErrorActionState } from '@/types';
import { redirect } from 'next/navigation';
import { assertIsError } from '@/types/typeguards';

interface OrganizationSettingsProps {
  organization: { id: number; name: string };
}

export default function OrganizationSettings({ organization }: OrganizationSettingsProps) {
  const [state, formAction, isPending] = useActionState<ErrorActionState, FormData>(
    updateOrganization,
    { error: null }
  );
  const [isOrganizationNameValid, setIsOrganizationNameValid] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const nameInputRef = useRef<HTMLInputElement>(null)

  function validateName() {
    const isOrganizationNameValid = 
      nameInputRef.current !== null &&
      nameInputRef.current.value.trim().length > 2 &&
      nameInputRef.current.value.trim() !== organization.name
    setIsOrganizationNameValid(isOrganizationNameValid);
  }

  async function deleteOrganization() {
    setIsDeleting(true)

    try {
      const response = await fetch("/api/organizations/" + organization.id, {
        method: "DELETE",
      })
  
      if (!response.ok) {
        // TODO: toast error
        const errorMessage = await response.json()
        console.log("yyy", errorMessage.error)
      } else {
        redirect("/organizations")
      }
    } catch {
      // TODO: toast error
      console.log("Failed to delete organization")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
    
      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 mb-6 p-6">
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
              onChange={validateName}
              ref={nameInputRef}
              id="name"
              type="text"
              name="name"
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
      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-red-200 dark:border-red-700 p-6">
        <h2 className="text-lg font-semibold text-red-900 dark:text-red-50 mb-4">
          Danger Zone
        </h2>
        <div className="flex gap-3">
          <button
            type="button"
            disabled={isDeleting}
            onClick={deleteOrganization}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {isDeleting ? 'Deleting...' : 'Delete Organization'}
          </button>
        </div>
      </div>
    </>
  );
}
