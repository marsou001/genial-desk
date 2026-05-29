import { supabase } from "./supabase.ts";
import { invalidateCache } from "./cache.ts";
import { Organization } from "./types.ts";

export async function updateOrganization(
  organizationId: string,
  fields: Partial<Organization>,
) {
  const fieldsToUpdate: Record<string, unknown> = {};
  if (fields.name !== undefined) fieldsToUpdate.name = fields.name;
  if (fields.stripeCustomerId !== undefined)
    fieldsToUpdate.stripe_customer_id = fields.stripeCustomerId;
  if (fields.remainingUploads !== undefined)
    fieldsToUpdate.remaining_uploads = fields.remainingUploads;
  if (fields.remainingAIRuns !== undefined)
    fieldsToUpdate.remaining_ai_runs = fields.remainingAIRuns;
  if (fields.lastResetAt !== undefined)
    fieldsToUpdate.last_reset_at = fields.lastResetAt;

  try {
    const { error } = await supabase
      .from("organizations")
      .update(fieldsToUpdate)
      .eq("id", organizationId);

    if (error) {
      throw new Error(error.message);
    }

    await invalidateCache(`organization_${organizationId}`);
  } catch (error) {
    console.error("Error updating organization with id", organizationId, error);
    throw new Error("Error updating organization");
  }
}
