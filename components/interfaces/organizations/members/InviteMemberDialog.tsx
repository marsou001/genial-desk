'use client';

import { useParams } from "next/navigation";
import { useActionState, useState, useRef, useEffect } from "react"
import { InviteMemberActionState } from "@/types"
import { inviteMember } from "@/app/actions/organizations"

export default function InviteMemberDialog({ 
  handleClose 
}: { 
  handleClose: () => void 
}) {
  const [state, formAction, isPending] = useActionState<InviteMemberActionState, FormData>(
    inviteMember, 
    { error: null, email: "", role: "viewer" }
  )
  const [isEmailValid, setIsEmailValid] = useState(false)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const { id: organizationId } = useParams()

  function validateEmail() {
    const email = emailInputRef.current?.value.trim() || '';
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = regex.test(email);
    setIsEmailValid(isValid);
  }

  // Close dialog on successful invite
  useEffect(() => {
    if (state.error === null && !isPending && emailInputRef.current?.value) {
      const timer = setTimeout(() => {
        handleClose();
        if (formRef.current) {
          formRef.current.reset();
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state.error, isPending, handleClose]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
          Invite User
        </h2>
        
        <form ref={formRef} action={formAction} className="space-y-4">
          <input type="hidden" name="organization_id" value={organizationId} />
          <input type="hidden" name="role" value="viewer" />
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Email Address
            </label>
            <input
              onChange={validateEmail}
              ref={emailInputRef}
              id="email"
              type="email"
              name="email"
              required
              defaultValue={state.email}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="user@example.com"
              autoFocus
            />
          </div>
          
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Role
            </label>
            <select
              id="role"
              name="role"
              required
              defaultValue="viewer"
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
              <option value="analyst">Analyst</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          {!isPending && state.error !== null && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">{state.error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isPending || !isEmailValid}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {isPending ? 'Inviting...' : 'Invite'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-50 font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
