"use client";

import { useState } from "react";
import { toast } from "sonner";
import PermissionGate from "@/components/common/PermissionGate";
import { deleteOrganization } from "@/lib/api/organizations";
import { reload } from "@/lib/utils";

export default function zOrganizationDangerZone({
  organization,
}: {
  organization: { id: string; name: string };
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDeleteOrganization() {
    const isConfirmed = window.confirm(
      `Delete "${organization.name}"? This will permanently delete the organization and all of its data. This action cannot be undone.`,
    );

    if (!isConfirmed) return;

    setIsDeleting(true);

    try {
      await deleteOrganization(organization.id);
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
  );
}
