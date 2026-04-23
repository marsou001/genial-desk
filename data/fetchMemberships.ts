import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib";
import { UserMembership, UserRole } from "@/types";

export async function fetchMemberships() {
  const supabase = await createClient();
  const user = await getUser();

  const { data } = await supabase
    .from("organization_members")
    .select("id, organization_id, role (name), organizations (name)")
    .eq("user_id", user.id);

  const memberships: UserMembership[] = (data || []).map(
    (m: any) => ({
      id: m.id,
      organization_id: m.organization_id,
      role: m.role.name as UserRole,
      organization_name: m.organizations.name,
    }),
  );

  return memberships;
}