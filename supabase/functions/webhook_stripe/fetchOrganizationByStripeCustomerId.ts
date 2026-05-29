import { supabase } from "./supabase.ts";

export async function fetchOrganizationIdByStripeCustomerId(
  stripeCustomerId: string,
): Promise<string> {
  try {
    const { data, error } = await supabase
      .from("organizations")
      .select("id")
      .eq("stripe_customer_id", stripeCustomerId)
      .single();

    if (error) throw new Error(error.message);

    return data.id;
  } catch (error) {
    console.error(
      "Error fetching organization by stripe customer id:",
      error,
    );
    throw new Error("Organization not found for this customer");
  }
}
