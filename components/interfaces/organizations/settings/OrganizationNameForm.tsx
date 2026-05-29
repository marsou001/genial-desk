"use client";

import { useState, useRef } from "react";
import { updateOrganization } from "@/app/actions/organizations";
import { UpdateOrganizationActionState } from "@/types/action-states";
import { useActionWithToast } from "@/hooks/useActionWithToast";

export default function OrganizationNameForm({
  organization,
}: {
  organization: { id: string; name: string };
}) {
  const { state, formAction, isPending } =
    useActionWithToast<UpdateOrganizationActionState>(
      updateOrganization,
      { isSuccess: false, error: null, name: organization.name },
      "Organization info has been successfully updated",
    );

  const [isOrganizationNameValid, setIsOrganizationNameValid] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  function validateName() {
    const isOrganizationNameValid =
      nameInputRef.current !== null &&
      nameInputRef.current.value.trim().length > 2 &&
      nameInputRef.current.value.trim() !== organization.name;
    setIsOrganizationNameValid(isOrganizationNameValid);
  }

  return (
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
            defaultValue={state.name}
            required
            minLength={3}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="My Company"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isPending || !isOrganizationNameValid}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 cursor-pointer disabled:bg-zinc-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
