import { createClient } from "@/lib/supabase/server";
import { Subscription } from "@/types";
import { Subscription as SubscriptionDBView } from "@/types/database";

export async function createSubscription(
  fields: Omit<Subscription, "id" | "createdAt">
) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("subscriptions")
      .insert({ subscription_id: fields.subscriptionId, organization_id: fields.organizationId, price_id: fields.priceId })

    if (error) throw new Error(error.message)
  } catch (error) {
    console.error("Error creating subscription for organization with id", fields.organizationId, error);
    throw new Error("Error creating subscription for organization with id " + fields.organizationId);
  }
}

export async function updateSubscription(
  subscriptionId: string,
  fields: Partial<Subscription>,
) {
  const fieldsToUpdate: Partial<SubscriptionDBView> = {}
  if (fields.priceId !== undefined) fieldsToUpdate.price_id = fields.priceId;

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("subscriptions")
      .update(fieldsToUpdate)
      .eq("subscription_id", subscriptionId)

    if (error) throw new Error(error.message)
  } catch (error) {
    console.error("Error updating subscription with id", subscriptionId, error);
    throw new Error("Error updating subscription with id " + subscriptionId);
  }
}

export async function deleteSubscription(
  subscriptionId: string,
) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("subscriptions")
      .delete()
      .eq("subscription_id", subscriptionId)

    if (error) throw new Error(error.message)
  } catch (error) {
    console.error("Error updating subscription with id", subscriptionId, error);
    throw new Error("Error updating subscription with id " + subscriptionId);
  }
}