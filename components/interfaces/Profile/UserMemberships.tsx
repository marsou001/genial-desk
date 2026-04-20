"use client";

import { UserMembership } from "@/types";
import UserMembershipCard from "./UserMembershipCard";
import { useState } from "react";

export default function UserMembershipsList({
  userMemberships,
}: {
  userMemberships: UserMembership[];
}) {
  const [memberships, setMemberships] = useState(userMemberships);

  function removeMembership(id: string) {
    setMemberships((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Your memberships
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Leave organizations you no longer need access to.
        </p>
      </div>

      {memberships.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          You are not a member of any organizations yet.
        </p>
      ) : (
        <div className="space-y-3">
          {memberships.map((membership) => (
            <UserMembershipCard
              key={membership.id}
              membership={membership}
              removeMembership={removeMembership}
            />
          ))}
        </div>
      )}
    </div>
  );
}
