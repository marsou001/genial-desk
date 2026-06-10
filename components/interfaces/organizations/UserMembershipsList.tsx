"use client";

import Link from "next/link";
import { useState } from "react";
import { Brain, Upload } from "lucide-react";
import { UserMemberShipView } from "@/types";
import CreateOrganizationDialog from "./CreateOrganizationDialog";
import { useToastFlash } from "@/hooks/useToastFlash";
import { getRoleColor } from "@/lib/utils";

export default function UserMembershipsList({
  userMemberships,
}: {
  userMemberships: UserMemberShipView[];
}) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  useToastFlash();

  return (
    <>
      {userMemberships.length === 0 ? (
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
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 text-white font-medium cursor-pointer disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            Create Organization
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {userMemberships.map((membership) => (
            <Link
              key={membership.organizationId}
              href={`/organizations/${membership.organizationId}/dashboard`}
              className="bg-white block dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1 space-y-3">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    {membership.organizationName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getRoleColor(membership.role)}`}
                    >
                      {membership.role}
                    </span>
                    <span data-testid="remaining-ai-runs" className="inline-flex items-center gap-1 rounded-lg border border-blue-200 dark:border-blue-800 px-2 py-1 text-xs text-blue-700 dark:text-blue-300 tabular-nums">
                      <Brain className="h-3.5 w-3.5 shrink-0 text-blue-500 dark:text-blue-400" aria-hidden="true" />
                      {membership.remainingAIRuns}
                      <span className="hidden md:inline ml-0.5">AI run{membership.remainingAIRuns === 1 ? "" : "s"}</span>
                    </span>
                    <span data-testid="remaining-uploads" className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 dark:border-emerald-800 px-2 py-1 text-xs text-emerald-700 dark:text-emerald-300 tabular-nums">
                      <Upload className="h-3.5 w-3.5 shrink-0 text-emerald-500 dark:text-emerald-400" aria-hidden="true" />
                      {membership.remainingUploads}
                      <span className="hidden md:inline ml-0.5">Upload{membership.remainingUploads === 1 ? "" : "s"}</span>
                    </span>
                  </div>
                </div>
                <div className="text-blue-600 dark:text-blue-400 shrink-0 ml-4">
                  →
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {userMemberships.length > 0 && (
        <button
          onClick={() => setShowCreateDialog(true)}
          className="w-full px-6 py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-50 font-medium rounded-lg cursor-pointer disabled:cursor-not-allowed transition-colors border border-zinc-300 dark:border-zinc-700"
        >
          + Create New Organization
        </button>
      )}

      {showCreateDialog && (
        <CreateOrganizationDialog
          isOpen={showCreateDialog}
          handleClose={() => setShowCreateDialog(false)}
        />
      )}
    </>
  );
}
