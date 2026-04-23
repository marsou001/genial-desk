import { createClient } from "@/lib/supabase/server";
import { getCache, setCache } from "@/lib/redis";
import { REDIS_KEYS } from "@/lib/redis/keys";
import { getUser } from "@/lib";
import { OrganizationView } from "@/types";

export async function fetchOrganizations(): Promise<OrganizationView[]> {
  const { id } = await getUser();
  const cacheKey = REDIS_KEYS.organizations(id);
  const cachedValue = await getCache<OrganizationView[]>(cacheKey);
  if (cachedValue !== null) return cachedValue;

  const supabase = await createClient();

  try {
    const { data: memberships, error } = await supabase
      .from("organization_members")
      .select(
        `
        organization_id,
        role:roles (
          name
        ),
        organizations!inner (
          id,
          name,
          created_at
        )
      `,
      )
      .eq("user_id", id);

    if (error) {
      throw new Error(error.message);
    }

    const organizations = (memberships || []).map((m: any) => ({
      id: m.organization_id,
      name: m.organizations.name,
      role: m.role.name.toLowerCase(),
      created_at: m.organizations.created_at,
    }));

    await setCache(cacheKey, organizations);
    return organizations;
  } catch (error) {
    console.error("Failed to fetch organizations:", error);
    throw new Error("Failed to fetch organizations");
  }
}
