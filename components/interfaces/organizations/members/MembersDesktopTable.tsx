import Image from "next/image";
import { usePermissions } from "@/context/permissions-context";
import {
  formatDate,
  getAvatarPlaceholderInitial,
  getRoleColor,
} from "@/lib/utils";
import type { OrganizationMember } from "@/types";
import RemoveMember from "./RemoveMember";

export default function MembersDesktopTable({
  members,
  removeMember,
}: {
  members: OrganizationMember[];
  removeMember: (id: string) => void;
}) {
  const canRemoveMembers = usePermissions("org:members:remove");

  return (
    <div className="hidden md:block bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider w-14">
                Avatar
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Role
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Joined
              </th>
              {canRemoveMembers && (
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider" />
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {members.map((member) => (
              <tr
                key={member.id}
                className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  {member.avatarUrl ? (
                    <div className="relative h-10 w-10">
                      <Image
                        src={member.avatarUrl}
                        alt={"Avatar image of user with email " + member.email}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-600 flex items-center justify-center text-sm font-medium text-zinc-700 dark:text-zinc-200">
                      {getAvatarPlaceholderInitial(member)}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {member.fullName ?? "-"}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    {member.email}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getRoleColor(member.role)}`}
                  >
                    {member.role}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    {formatDate(member.memberSince)}
                  </div>
                </td>
                {canRemoveMembers && (
                  <td className="px-4 py-3 whitespace-nowrap">
                    <RemoveMember removeMember={removeMember} member={member} />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
