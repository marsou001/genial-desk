"use client";

import { useState } from "react";
import { usePermissions } from "@/context/permissions-context";
import type { OrganizationMember } from "@/types";
import InviteUsers from "./InviteUsers";
import MembersDesktopTable from "./MembersDesktopTable";
import MembersMobileCards from "./MembersMobileCards";

export default function MembersList({
  membersList,
}: {
  membersList: OrganizationMember[];
}) {
  const [members, setMembers] = useState(membersList);
  const canInviteMembers = usePermissions("org:members:invite");

  function removeMember(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-4 sm:pb-8">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Members
          </h1>
          {canInviteMembers && <InviteUsers />}
        </div>

        <MembersDesktopTable removeMember={removeMember} members={members} />
        <MembersMobileCards removeMember={removeMember} members={members} />
      </div>
    </>
  );
}
