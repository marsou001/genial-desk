import Image from 'next/image';
import { OrganizationMember, UserRole } from '@/types';
import InviteUsers from './InviteUsers';

export default function MembersList({ 
  members, 
}: { 
  members: OrganizationMember[];
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleColor = (role: UserRole) => {
    switch (role.toLowerCase()) {
      case 'owner':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'admin':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'analyst':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300';
    }
  };

  const initial = (member: OrganizationMember) =>
    (member.fullName ?? member.email).charAt(0).toUpperCase();

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Members
          </h1>
          <InviteUsers />
        </div>

        {/* Desktop: table */}
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
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {member.avatarUrl ? (
                        <Image
                          src={member.avatarUrl}
                          alt={"Avatar image of user with email " + member.email}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-600 flex items-center justify-center text-sm font-medium text-zinc-700 dark:text-zinc-200">
                          {initial(member)}
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
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getRoleColor(member.role)}`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        {formatDate(member.createdAt)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile: cards */}
        <div className="md:hidden space-y-3 p-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 flex items-center gap-3"
            >
              {member.avatarUrl ? (
                <img
                  src={member.avatarUrl}
                  alt=""
                  className="h-12 w-12 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-zinc-200 dark:bg-zinc-600 flex items-center justify-center text-lg font-medium text-zinc-700 dark:text-zinc-200 shrink-0">
                  {initial(member)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50 truncate">
                  {member.fullName ?? "-"}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                  {member.email}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getRoleColor(member.role)}`}>
                    {member.role}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {formatDate(member.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
