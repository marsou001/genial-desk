import { supabase } from "./supabase.ts";

export async function deleteSubscription(subscriptionId: string) {
  try {
    const { error } = await supabase
      .from("subscriptions")
      .delete()
      .eq("stripe_subscription_id", subscriptionId);

    if (error) throw new Error(error.message);
  } catch (error) {
    console.error(
      "Error deleting subscription with id",
      subscriptionId,
      error,
    );
    throw new Error("Error deleting subscription with id " + subscriptionId);
  }
}
