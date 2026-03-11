import type { OrganizationMember } from '@/types';
import InviteUsers from './InviteUsers';
import MembersDesktopTable from './MembersDesktopTable';
import MembersMobileCards from './MembersMobileCards';

export default function MembersList({ 
  members, 
}: { 
  members: OrganizationMember[];
}) {
  

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Members
          </h1>
          <InviteUsers />
        </div>

        <MembersDesktopTable members={members} />
        <MembersMobileCards members={members} />
      </div>
    </>
  );
}
