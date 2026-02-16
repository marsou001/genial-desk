import { OrganizationMember, UserRole } from "@/types";

export default function MemberCard({ member }: { member: OrganizationMember }) {
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

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {member.fullName ?? member.email}
            </h3>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getRoleColor(member.role)}`}>
              {member.role}
            </span>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Joined {formatDate(member.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
