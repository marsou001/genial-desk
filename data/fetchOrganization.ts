import { getCache, setCache } from "@/lib/redis";
import { REDIS_KEYS } from "@/lib/redis/keys";
import { createClient } from "@/lib/supabase/server";
import { Organization } from "@/types";

export async function fetchOrganization(
  organizationId: string,
): Promise<Organization> {
  const cacheKey = REDIS_KEYS.organization(organizationId);
  const cachedValue = await getCache<Organization>(cacheKey);
  if (cachedValue !== null) return cachedValue;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("organizations")
      .select()
      .eq("id", organizationId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const organization = {
      id: data.id,
      name: data.name,
      stripeCustomerId: data.stripe_customer_id,
      remainingUploads: data.remaining_uploads,
      remainingAIRuns: data.remaining_ai_runs,
      createdAt: data.createdAt,
    } as Organization;

    await setCache(cacheKey, data);
    return organization;
  } catch (error) {
    console.log("Error fetching organization with id", error);
    throw new Error("Error fetching organization with id");
  }
}
