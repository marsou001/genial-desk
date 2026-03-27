import type { OrganizationMember } from "@/types";
import InviteUsers from "./InviteUsers";
import MembersDesktopTable from "./MembersDesktopTable";
import MembersMobileCards from "./MembersMobileCards";
import { getUser, getUserRole } from "@/lib";
import { canInviteMembers } from "@/lib/permissions";

export default async function MembersList({
  members,
}: {
  members: OrganizationMember[];
}) {
  const { id } = await getUser();
  const role = (await getUserRole(id, members[0].organizationId)) ?? "viewer";

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Members
          </h1>
          {canInviteMembers(role) && <InviteUsers />}
        </div>

        <MembersDesktopTable members={members} />
        <MembersMobileCards members={members} />
      </div>
    </>
  );
}
