import { getCache, setCache } from "@/lib/redis";
import { REDIS_KEYS } from "@/lib/redis/keys";
import { createClient } from "@/lib/supabase/server";

export async function fetchOrganization(
  organizationId: string,
): Promise<{ name: string } | null> {
  const cacheKey = REDIS_KEYS.organization(organizationId);
  const cachedValue = await getCache<{ name: string }>(cacheKey);
  if (cachedValue !== null) return cachedValue;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("organizations")
      .select("name")
      .eq("id", organizationId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (data === null) return null;

    await setCache(cacheKey, data);
    return data as { name: string };
  } catch (error) {
    console.log("Error fetching organization with id", error);
    throw new Error("Error fetching organization with id");
  }
}
