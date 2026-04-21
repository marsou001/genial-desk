"use client";

import { useState } from "react";
import { toast } from "sonner";
import { UserMembership } from "@/types";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { deleteOrganization as apiDeleteOrganization } from "@/lib/api/organizations";
import { leaveOrganization } from "@/lib/api/memberships";

export default function UserMembershipCard({
  membership,
  removeMembership,
}: {
  membership: UserMembership;
  removeMembership: (id: string) => void;
}) {
  const [isLeaving, setIsLeaving] = useState(false);

  const isOwner = membership.role === "owner";

  async function deleteOrganization() {
    const isConfirmed = window.confirm(
      `Delete "${membership.organization_name}"? This will permanently delete the organization and all of its data. This action cannot be undone.`,
    );

    if (!isConfirmed) return;

    setIsLeaving(true);

    try {
      await apiDeleteOrganization(membership.organization_id);
      toast.info(membership.organization_name + " has been successfully deleted");
      removeMembership(membership.id);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong while deleting organization " +
            membership.organization_name,
      );
    } finally {
      setIsLeaving(false);
    }
  }

  async function handleLeaveOrganization() {
    if (isOwner) {
      toast.error("Can't do that!");
      return;
    }

    const isConfirmed = window.confirm(
      `Leave "${membership.organization_name}"? You will lose access to this organization.`,
    );

    if (!isConfirmed) return;

    setIsLeaving(true);

    try {
      await leaveOrganization(membership.id, membership.role);
      toast.info("You're no longer a member of " + membership.organization_name);
      removeMembership(membership.id);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong while deleting your membership",
      );
    } finally {
      setIsLeaving(false);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-4 py-3">
      <div>
        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {membership.organization_name || "Untitled organization"}
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          Role: {membership.role}
        </div>
      </div>
      <div className="flex justify-end">
        {isOwner ? (
          <button
            disabled={isLeaving}
            onClick={deleteOrganization}
            className="inline-flex items-center justify-center rounded-md border border-red-200 dark:border-red-800 px-3 py-1.5 text-xs font-medium bg-red-600 dark:hover:bg-red-700 cursor-pointer disabled:bg-transparent disabled:hover:bg-transparent disabled:border-zinc-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLeaving ? <LoadingSpinner /> : "Delete organization"}
          </button>
        ) : (
          <button
            disabled={isLeaving}
            onClick={handleLeaveOrganization}
            className="inline-flex items-center justify-center rounded-md border border-red-200 dark:border-red-800 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/40 disabled:text-zinc-400 disabled:hover:bg-transparent disabled:border-zinc-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLeaving ? <LoadingSpinner /> : "Leave organization"}
          </button>
        )}
      </div>
    </div>
  );
}
