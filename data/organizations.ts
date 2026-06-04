import { getCache, invalidateCache, setCache } from "@/lib/redis";
import { REDIS_KEYS } from "@/lib/redis/keys";
import { createClient } from "@/lib/supabase/server";
import { Organization } from "@/types";
import { Organization as OrganizationDBView } from "@/types/database";
import { fetchPlanByPriceId } from "./plans";

export async function checkOrganizationExists(
  organizationId: string,
): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("organizations")
      .select("name")
      .eq("id", organizationId)
      .limit(1);

    if (error) {
      throw new Error(error.message);
    }

    return data !== null;
  } catch (error) {
    console.log(
      `Error checking that organization with id ${organizationId} exists`,
      error,
    );
    return false;
  }
}

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
      lastResetAt: data.last_reset_at,
      createdAt: data.created_at,
    } as Organization;

    await setCache(cacheKey, organization);
    return organization;
  } catch (error) {
    console.log("Error fetching organization with id", error);
    throw new Error("Error fetching organization with id");
  }
}

export async function updateOrganization(
  organizationId: string,
  fields: Partial<Organization>,
) {
  const fieldsToUpdate: Partial<OrganizationDBView> = {}
  if (fields.name !== undefined) fieldsToUpdate.name = fields.name;
  if (fields.stripeCustomerId !== undefined) fieldsToUpdate.stripe_customer_id = fields.stripeCustomerId;
  if (fields.remainingUploads !== undefined) fieldsToUpdate.remaining_uploads = fields.remainingUploads;
  if (fields.remainingAIRuns !== undefined) fieldsToUpdate.remaining_ai_runs = fields.remainingAIRuns;
  if (fields.lastResetAt !== undefined) fieldsToUpdate.last_reset_at = fields.lastResetAt;

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("organizations")
      .update(fieldsToUpdate)
      .eq("id", organizationId)

    if (error) {
      throw new Error(error.message);
    }

    await invalidateCache(REDIS_KEYS.organization(organizationId));
  } catch (error) {
    console.log("Error fetching organization with id", error);
    throw new Error("Error fetching organization with id");
  }
}

export async function resetOrganizationFreeLimits(organizationId: string) {
  try {
    const organization = await fetchOrganization(organizationId);
    if (organization.lastResetAt === null) return;
    
    const lastResetAtTimeStamp = Date.parse(organization.lastResetAt);
    const now = Date.now();
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    
    if ((now - lastResetAtTimeStamp) <= THIRTY_DAYS) return;
    
    const newResetDate = new Date(lastResetAtTimeStamp + THIRTY_DAYS).toISOString();
    const freePlan = await fetchPlanByPriceId(null);
    await updateOrganization(organizationId, { lastResetAt: newResetDate, remainingAIRuns: freePlan.maxAIRuns, remainingUploads: freePlan.maxUploads });
  } catch (error) {
    console.log("Error resetting free limits for organization with id", error);
    throw new Error("Error resetting free limits for organization with id");
  }
}