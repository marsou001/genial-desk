"use client";

import { useActionState, useState, useRef } from "react";
import { toast } from "sonner";
import { updateOrganization } from "@/app/actions/organizations";
import { CreateOrganizationrActionState } from "@/types/action-states";
import { reload } from "@/lib/utils";
import PermissionGate from "@/components/common/PermissionGate";
import { deleteOrganization } from "@/lib/api/organizations";

interface OrganizationSettingsProps {
  organization: { id: number; name: string };
}

export default function OrganizationSettings({
  organization,
}: OrganizationSettingsProps) {
  const [state, formAction, isPending] = useActionState<
    CreateOrganizationrActionState,
    FormData
  >(updateOrganization, { isSuccess: false, error: null, name: "" });
  const [isOrganizationNameValid, setIsOrganizationNameValid] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  function validateName() {
    const isOrganizationNameValid =
      nameInputRef.current !== null &&
      nameInputRef.current.value.trim().length > 2 &&
      nameInputRef.current.value.trim() !== organization.name;
    setIsOrganizationNameValid(isOrganizationNameValid);
  }

  async function handleDeleteOrganization() {
    const isConfirmed = window.confirm(
      `Delete "${organization.name}"? This will permanently delete the organization and all of its data. This action cannot be undone.`,
    );

    if (!isConfirmed) return;

    setIsDeleting(true);

    try {
      await deleteOrganization(String(organization.id));
      toast.info(organization.name + " has been successfully deleted");
      reload();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete organization",
      );
    } finally {
      setIsDeleting(false);
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
              <p className="text-sm text-red-800 dark:text-red-200">
                {state.error}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isPending || !isOrganizationNameValid}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
      <PermissionGate permission="org:delete">
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-red-200 dark:border-red-700 p-6">
          <h2 className="text-lg font-semibold text-red-900 dark:text-red-50 mb-4">
            Danger Zone
          </h2>
          <div className="flex gap-3">
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleDeleteOrganization}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-zinc-400 cursor-pointer disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {isDeleting ? "Deleting..." : "Delete Organization"}
            </button>
          </div>
        </div>
      </PermissionGate>
    </>
  );
}
