// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts"

import Stripe from "stripe";
import { createSubscription } from "./createSubscription.ts";
import { deleteSubscription } from "./deleteSubscription.ts";
import { updateSubscription } from "./updateSubscription.ts";
import { fetchOrganization } from "./fetchOrganization.ts";
import { fetchOrganizationIdByStripeCustomerId } from "./fetchOrganizationByStripeCustomerId.ts";
import { updateOrganization } from "./updateOrganization.ts";
import { fetchPlanByPriceId } from "./fetchPlanByPriceId.ts";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");

Deno.serve(async (req) => {
  if (!STRIPE_SECRET_KEY) {
    return new Response(
      JSON.stringify({ error: "STRIPE_SECRET_KEY Key missing" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  };

  if (!STRIPE_WEBHOOK_SECRET) {
    return new Response(
      JSON.stringify({ error: "STRIPE_WEBHOOK_SECRET Key missing" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }
  
  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2026-04-22.dahlia",
  });

  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    console.error("No Stripe signature found");
    return new Response(
      JSON.stringify({ error: "No Stripe signature" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  let event: Stripe.Event;
  const body = await req.text();
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      sig,
      STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    if (error !== null && typeof error === "object" && "message" in error) {
      console.error(`Webhook signature verification failed: ${error.message}`);
      return new Response(
        JSON.stringify({ error: `Webhook Error: ${error.message}` }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
    console.log("Webhook signature error", error);
    return new Response(
      JSON.stringify({ error: "Webhook signature error" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  switch (event.type) {
    case "customer.created": {
      console.log("=====>> customer.created <<=====");
      const customer = event.data.object;
      const organizationId = customer.metadata.organization_id;
      await updateOrganization(organizationId, { stripeCustomerId: customer.id });
      break;
    }
    case "customer.subscription.created": {
      console.log("=====>> customer.subscription.created <<=====");
      const subscription = event.data.object;
      const customerId = typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id;
      const stripeSubscriptionId = subscription.id;
      const status = subscription.status;

      const organizationId = await fetchOrganizationIdByStripeCustomerId(
        customerId,
      );
      const priceId = subscription.items.data[0].price.id;

      await createSubscription({
        stripeSubscriptionId,
        organizationId,
        priceId,
        status,
      });
      break;
    }
    case "customer.subscription.updated": {
      console.log("=====>> customer.subscription.updated <<=====");
      const subscription = event.data.object;
      const subscriptionId = subscription.id;
      const status = subscription.status;
      const priceId = subscription.items.data[0].price.id;

      await updateSubscription(subscriptionId, { priceId, status });

      if (status === "past_due") {
        console.warn(`Subscription ${subscriptionId} is past_due`);
      }
      break;
    }
    case "customer.subscription.deleted": {
      console.log("=====>> customer.subscription.deleted <<=====");
      const subscription = event.data.object;
      const subscriptionId = subscription.id;
      await deleteSubscription(subscriptionId);
      break;
    }
    case "invoice.paid": {
      console.log("=====>> invoice.paid <<=====");
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.customer === null) {
        return new Response(
          JSON.stringify({ error: "Error getting customer id" }),
          { status: 502, headers: { "Content-Type": "application/json" } },
        );
      }

      const customerId = typeof invoice.customer === "string"
        ? invoice.customer
        : invoice.customer.id;
      const organizationId = await fetchOrganizationIdByStripeCustomerId(
        customerId,
      );
      const price = invoice.lines.data[invoice.lines.data.length - 1].pricing
        ?.price_details?.price!;
      const priceId = typeof price === "string" ? price : price.id;
      const plan = await fetchPlanByPriceId(priceId);

      if (plan === undefined || plan.priceId === null) {
        console.error("No plan found with price id", priceId);
        return new Response(
          JSON.stringify({ error: "No plan found" }),
          { status: 404, headers: { "Content-Type": "application/json" } },
        );
      }

      await updateOrganization(organizationId, {
        remainingAIRuns: plan.maxAIRuns,
        remainingUploads: plan.maxUploads,
      });
      break;
    }
    case "invoice.payment_failed": {
      console.log("=====>> invoice.payment_failed <<=====");
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.customer === null) {
        return new Response(
          JSON.stringify({ error: "Error getting customer id" }),
          { status: 502, headers: { "Content-Type": "application/json" } },
        );
      }

      const customerId = typeof invoice.customer === "string"
        ? invoice.customer
        : invoice.customer.id;

      try {
        const organizationId = await fetchOrganizationIdByStripeCustomerId(
          customerId,
        );
        console.warn(`Payment failed for organization ${organizationId}`);
      } catch (error) {
        console.error(
          "Payment failed for unknown customer:",
          customerId,
          error,
        );
      }
      break;
    }
  }

  return new Response(
    JSON.stringify({ message: "Webhook received" }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/webhook_stripe' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Pyoooooooo22"}'

*/
