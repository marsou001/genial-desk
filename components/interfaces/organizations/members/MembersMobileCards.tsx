import {
  formatDate,
  getAvatarPlaceholderInitial,
  getRoleColor,
} from "@/lib/utils";
import type { OrganizationMember } from "@/types";
import Image from "next/image";
import RemoveMember from "./RemoveMember";
import { canRemoveMembers } from "@/lib/permissions";
import { getUser } from "@/lib";

export default async function MembersMobileCards({
  members,
}: {
  members: OrganizationMember[];
}) {
  const user = await getUser();
  const userMembership = members.find((member) => member.userId === user.id)!;

  return (
    <div className="md:hidden space-y-3 p-4">
      {members.map((member) => (
        <div
          key={member.id}
          className="relative bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 flex items-center gap-3"
        >
          {member.avatarUrl ? (
            <div className="relative h-12 w-12">
              <Image
                src={member.avatarUrl}
                alt={"Avatar image of user with email " + member.email}
                fill
                className="rounded-full object-cover"
              />
            </div>
          ) : (
            <div className="h-12 w-12 rounded-full bg-zinc-200 dark:bg-zinc-600 flex items-center justify-center text-lg font-medium text-zinc-700 dark:text-zinc-200 shrink-0">
              {getAvatarPlaceholderInitial(member)}
            </div>
          )}
          {canRemoveMembers(userMembership.role) && (
            <div className="absolute top-2 right-2">
              <RemoveMember member={member} />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50 truncate">
              {member.fullName ?? member.email}
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getRoleColor(member.role)}`}
              >
                {member.role}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {formatDate(member.memberSince)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
