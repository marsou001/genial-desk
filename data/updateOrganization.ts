import { invalidateCache } from "@/lib/redis";
import { REDIS_KEYS } from "@/lib/redis/keys";
import { createClient } from "@/lib/supabase/server";
import { Organization } from "@/types";
import { Organization as OrganizationDBView } from "@/types/database";

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