import { createClient } from "@/lib/supabase/server";
import { Subscription } from "@/types";
import { Subscription as SubscriptionDBView } from "@/types/database";

export async function fetchSubscriptionByOrganizationId(
  organizationId: string,
): Promise<Subscription | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("subscriptions")
      .select()
      .eq("organization_id", organizationId)
      .maybeSingle();

    if (error) throw new Error(error.message);

    if (!data) return null;

    return {
      id: data.id,
      stripeSubscriptionId: data.stripe_subscription_id,
      organizationId: data.organization_id,
      priceId: data.price_id,
      status: data.status,
      createdAt: data.created_at,
    } as Subscription;
  } catch (error) {
    console.error(
      "Error fetching subscription for organization:",
      error,
    );
    throw new Error("Error fetching subscription");
  }
}

export async function createSubscription(
  fields: Omit<Subscription, "id" | "createdAt">
) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("subscriptions")
      .insert({
        stripe_subscription_id: fields.stripeSubscriptionId,
        organization_id: fields.organizationId,
        price_id: fields.priceId,
        status: fields.status,
      })

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
  if (fields.status !== undefined) fieldsToUpdate.status = fields.status;

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("subscriptions")
      .update(fieldsToUpdate)
      .eq("stripe_subscription_id", subscriptionId)

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
      .eq("stripe_subscription_id", subscriptionId)

    if (error) throw new Error(error.message)
  } catch (error) {
    console.error("Error updating subscription with id", subscriptionId, error);
    throw new Error("Error updating subscription with id " + subscriptionId);
  }
}