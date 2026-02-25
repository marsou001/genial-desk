import { useActionState, useState, useRef } from "react"
import { CreateOrganizationrActionState } from "@/types"
import { createOrganization } from "@/app/actions/organizations"

export default function CreateOrganizationDialog({ handleClose } : { handleClose: () => void }) {
  const [state, formAction, isPending] = useActionState<CreateOrganizationrActionState, FormData>(
    createOrganization, { error: null, name: "" }
  )
  const [isOrganizationNameValid, setIsOrganizationNameValid] = useState(false)
  const nameInputRef = useRef<HTMLInputElement>(null)

  function validateName() {
    const isOrganizationNameValid = nameInputRef.current !== null && nameInputRef.current.value.trim().length > 2
    setIsOrganizationNameValid(isOrganizationNameValid);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
          Create Organization
        </h2>
        
        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Organization Name
            </label>
            <input
              onChange={validateName}
              ref={nameInputRef}
              id="name"
              type="text"
              name="name"
              required
              minLength={3}
              defaultValue={state.name}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="My Company"
              autoFocus
            />
          </div>

          {!isPending && state.error !== null && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">{state.error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isPending || !isOrganizationNameValid}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {isPending ? 'Creating...' : 'Create'}
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