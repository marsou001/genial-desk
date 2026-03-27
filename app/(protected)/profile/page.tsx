import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib';
import { UserMembership, ProfileData, UserRole } from '@/types';
import EditAvatar from '@/components/interfaces/Profile/EditAvatar';
import EditNameForm from '@/components/interfaces/Profile/EditNameForm';
import UserMembershipsList from '@/components/interfaces/Profile/UserMemberships';
import SignOutButton from '@/components/interfaces/Profile/SignOutButton';
import EmailConfirmationAlertHeader from '@/components/interfaces/Profile/EmailConfirmationAlertHeader';

async function getProfileAndMemberships() {
  const supabase = await createClient();
  const user = await getUser();
  const isEmailConfirmed = user.email_confirmed_at !== null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, avatar_url')
    .eq('id', user.id)
    .single();

  const { data: memberships } = await supabase
    .from('organization_members')
    .select('id, organization_id, role (name), organizations (name)')
    .eq('user_id', user.id);

  const profileData: ProfileData = {
    id: user.id,
    fullName: profile?.full_name ?? null,
    email: profile?.email ?? '',
    isEmailConfirmed,
    avatarUrl: profile?.avatar_url ?? null,
  };

  const mappedMemberships: UserMembership[] =
    (memberships || []).map((m: any) => ({
      id: m.id,
      organization_id: m.organization_id,
      role: m.role.name as UserRole,
      organization_name: m.organizations.name,
    }));

  return { profile: profileData, memberships: mappedMemberships };
}

export default async function ProfilePage() {
  const { profile, memberships } = await getProfileAndMemberships();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Profile
      </h1>

      {!profile.isEmailConfirmed && <EmailConfirmationAlertHeader />}
      <EditAvatar avatarUrl={profile.avatarUrl} fullName={profile.fullName} email={profile.email} />
      <EditNameForm profile={profile} />
      <UserMembershipsList memberships={memberships} />
      <SignOutButton />
    </div>
  );
}

