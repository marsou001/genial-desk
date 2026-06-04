import EditAvatar from "@/components/interfaces/Profile/EditAvatar";
import EditNameForm from "@/components/interfaces/Profile/EditNameForm";
import UserMembershipsList from "@/components/interfaces/Profile/UserMembershipsList";
import SignOutButton from "@/components/interfaces/Profile/SignOutButton";
import { fetchProfile } from "@/data/fetchProfile";
import { fetchUserMemberships } from "@/data/memberships";

export default async function ProfilePage() {
  const [profile, userMemberships] = await Promise.all([
    fetchProfile(),
    fetchUserMemberships(),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Profile
      </h1>

      <EditAvatar
        avatarUrl={profile.avatarUrl}
        fullName={profile.fullName}
        email={profile.email}
      />
      <EditNameForm profile={profile} />
      <UserMembershipsList userMemberships={userMemberships} />
      <SignOutButton />
    </div>
  );
}
