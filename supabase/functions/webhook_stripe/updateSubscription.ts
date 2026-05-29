import { supabase } from "./supabase.ts";

export async function updateSubscription(
  subscriptionId: string,
  fields: { priceId?: string; status?: string },
) {
  const fieldsToUpdate: Record<string, unknown> = {};
  if (fields.priceId !== undefined) fieldsToUpdate.price_id = fields.priceId;
  if (fields.status !== undefined) fieldsToUpdate.status = fields.status;

  try {
    const { error } = await supabase
      .from("subscriptions")
      .update(fieldsToUpdate)
      .eq("stripe_subscription_id", subscriptionId);

    if (error) throw new Error(error.message);
  } catch (error) {
    console.error(
      "Error updating subscription with id",
      subscriptionId,
      error,
    );
    throw new Error("Error updating subscription with id " + subscriptionId);
  }
}
