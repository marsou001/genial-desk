import { fetchMembers } from "@/data/fetchMembers";
import MembersList from "@/components/interfaces/organizations/members/MembersList";

export default async function MembersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: organizationId } = await params;
  const members = await fetchMembers(organizationId);

  return <MembersList members={members} />;
}