import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib';
import { UserMembership, ProfileData, UserRole } from '@/types';
import { leaveOrganizationAction } from '@/app/actions/profile';
import EditAvatar from '@/components/interfaces/Profile/EditAvatar';
import EditNameForm from '@/components/interfaces/Profile/EditNameForm';

async function getProfileAndMemberships() {
  const supabase = await createClient();
  const user = await getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, avatar_url')
    .eq('id', user.id)
    .single();

  const { data: memberships } = await supabase
    .from('organization_members')
    .select('organization_id, role (name), organizations (name)')
    .eq('user_id', user.id);

  const mappedMemberships: UserMembership[] =
    (memberships || []).map((m: any) => ({
      organization_id: m.organization_id,
      role: m.role.name as UserRole,
      organization_name: m.organizations.name,
    }));

  const profileData: ProfileData = {
    id: user.id,
    fullName: profile?.full_name ?? null,
    email: profile?.email ?? '',
    avatarUrl: profile?.avatar_url ?? null,
  };

  return { profile: profileData, memberships: mappedMemberships };
}

export default async function ProfilePage() {
  const { profile, memberships } = await getProfileAndMemberships();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Profile
      </h1>

      <EditAvatar avatarUrl={profile.avatarUrl} fullName={profile.fullName} email={profile.email} />
      <EditNameForm profile={profile} />
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
              <div
                key={membership.organization_id}
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
                <form action={leaveOrganizationAction} className="flex justify-end">
                  <input
                    type="hidden"
                    name="organization_id"
                    value={membership.organization_id}
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md border border-red-200 dark:border-red-800 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  >
                    Leave organization
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

