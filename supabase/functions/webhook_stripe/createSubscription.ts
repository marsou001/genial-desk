import { supabase } from "./supabase.ts";

export async function createSubscription(fields: {
  stripeSubscriptionId: string;
  organizationId: string;
  priceId: string;
  status: string;
}) {
  try {
    const { error } = await supabase.from("subscriptions").insert({
      stripe_subscription_id: fields.stripeSubscriptionId,
      organization_id: fields.organizationId,
      price_id: fields.priceId,
      status: fields.status,
    });

    if (error) throw new Error(error.message);
  } catch (error) {
    console.error(
      "Error creating subscription for organization with id",
      fields.organizationId,
      error,
    );
    throw new Error(
      "Error creating subscription for organization with id " +
        fields.organizationId,
    );
  }
}
