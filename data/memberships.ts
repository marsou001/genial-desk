import { createClient } from "@/lib/supabase/server";
import { getCache, setCache } from "@/lib/redis";
import { REDIS_KEYS } from "@/lib/redis/keys";
import { getUser } from "@/lib";
import { OrganizationMember, UserMemberShipView } from "@/types";

export async function fetchUserMemberships(): Promise<UserMemberShipView[]> {
  const { id } = await getUser();
  const cacheKey = REDIS_KEYS.userMemberships(id);
  const cachedValue = await getCache<UserMemberShipView[]>(cacheKey);
  if (cachedValue !== null) return cachedValue;

  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("organization_members")
      .select(
        `
        id,
        organization_id,
        role:roles (
          name
        ),
        organizations!inner (
          id,
          name,
          remaining_ai_runs,
          remaining_uploads,
          created_at
        )
      `,
      )
      .eq("user_id", id);

    if (error) {
      throw new Error(error.message);
    }

    const memberships = (data || []).map((m: any) => ({
      id: m.id,
      organizationId: m.organization_id,
      organizationName: m.organizations.name,
      role: m.role.name.toLowerCase(),
      remainingAIRuns: m.organizations.remaining_ai_runs,
      remainingUploads: m.organizations.remaining_uploads,
      createdAt: m.organizations.created_at,
    }));

    await setCache(cacheKey, memberships);
    return memberships;
  } catch (error) {
    console.error("Failed to fetch memberships:", error);
    throw new Error("Failed to fetch memberships");
  }
}

export async function fetchMembers(
  organizationId: string,
): Promise<OrganizationMember[]> {
  const cacheKey = REDIS_KEYS.members(organizationId);
  const cachedValue = await getCache<OrganizationMember[]>(cacheKey);
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

    await setCache(cacheKey, members);
    return members;
  } catch (error) {
    console.error("Failed to fetch organization members:", error);
    throw new Error("Failed to fetch organization members");
  }
}
