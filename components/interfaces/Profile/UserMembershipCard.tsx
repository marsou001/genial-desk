"use client"

import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { UserMembership } from "@/types";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function UserMembershipCard({ membership }: { membership: UserMembership }) {
  const [isLeaving, setIsLeaving] = useState(false)

  const isOwner = membership.role === "owner"

  async function deleteOrganization() {
    setIsLeaving(true)

    try {
      const response = await fetch("/api/organizations/" + membership.organization_id, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorMessage = await response.json()
        return toast.error(errorMessage.error)
      } else {
        toast.info(membership.organization_name + " has beed successfully deleted")
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch {
      toast.error("Something went wrong while deleting organization " + membership.organization_name)
    } finally {
      setIsLeaving(false)
    }
  }

  async function leaveOrganization() {
    if (isOwner) {
      toast.error("Can't do that!")
      return;
    }

    setIsLeaving(true)

    try {
      const response = await fetch("/api/memberships/" + membership.id, {
        method: "DELETE",
        headers: {
          "x-membership-role": membership.role
        }
      })

      if (!response.ok) {
        const errorMessage = await response.json()
        toast.error(errorMessage.error)
      } else {
        toast.info("You're no longer a member of " + membership.organization_name)
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch {
      toast.error("Something went wrong while deleting your membership")
    } finally {
      setIsLeaving(false)
    }
  }

  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-4 py-3"
    >
      <div>
        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {membership.organization_name || 'Untitled organization'}
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
            onClick={leaveOrganization}
            className="inline-flex items-center justify-center rounded-md border border-red-200 dark:border-red-800 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/40 disabled:text-zinc-400 disabled:hover:bg-transparent disabled:border-zinc-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLeaving ? <LoadingSpinner /> : "Leave organization"}
          </button>
        )}
      </div>
    </div>
  )
}