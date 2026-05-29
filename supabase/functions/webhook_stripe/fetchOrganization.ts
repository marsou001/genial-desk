import { supabase } from "./supabase.ts";
import { getCache, setCache } from "./cache.ts";
import { Organization } from "./types.ts";

export async function fetchOrganization(
  organizationId: string,
): Promise<Organization> {
  const cacheKey = `organization_${organizationId}`;
  const cachedValue = await getCache<Organization>(cacheKey);
  if (cachedValue !== null) return cachedValue;

  try {
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", organizationId)
      .single();

    if (error) throw new Error(error.message);

    const organization = {
      id: data.id,
      name: data.name,
      stripeCustomerId: data.stripe_customer_id,
      remainingUploads: data.remaining_uploads,
      remainingAIRuns: data.remaining_ai_runs,
      lastResetAt: data.last_reset_at,
      createdAt: data.created_at,
    } as Organization;

    await setCache(cacheKey, organization);
    return organization;
  } catch (error) {
    console.error("Error fetching organization with id", error);
    throw new Error("Error fetching organization with id");
  }
}
