import { getCache } from "@/lib/redis";
import { REDIS_KEYS } from "@/lib/redis/keys";
import { createClient } from "@/lib/supabase/server";
import { OrganizationMember } from "@/types";

export async function fetchMembers(
  organizationId: string,
): Promise<OrganizationMember[]> {
  const cachedValue = await getCache<OrganizationMember[]>(REDIS_KEYS.members(organizationId));
  if (cachedValue !== null) return cachedValue;

  const supabase = await createClient();

  try {
    const { data, error } = await supabase.rpc("get_organization_members", {
      org_id: organizationId,
    });

    if (error !== null) {
      throw new Error(error.message);
    }

    const members = data.map((m: any) => ({
      ...m,
      organizationId: m.organization_id,
      userId: m.user_id,
      fullName: m.full_name,
      role: m.role_name,
      avatarUrl: m.avatar_url,
      memberSince: m.created_at,
    }));

    return members;
  } catch (error) {
    console.error("Failed to fetch organizations:", error);
    throw new Error("Failed to fetch organizations");
  }
}
