import { headers } from "next/headers";
import Stripe from "stripe";
import { createSubscription, deleteSubscription, updateSubscription } from "@/data/subscriptions";
import { fetchOrganization } from "@/data/fetchOrganization";
import { updateOrganization } from "@/data/updateOrganization";
import { fetchPlanByPriceId } from "@/data/fetchPlanByPriceId";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const headerPayload = await headers();
  const sig = headerPayload.get('stripe-signature');
  
  if (!sig) {
    console.error("No Stripe signature found");
    return new Response("No Stripe signature", { status: 400 });
  }
  
  let event: Stripe.Event;
  const body = await req.text();
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    if (error !== null && typeof error === "object" && "message" in error) {
      console.error(`Webhook signature verification failed: ${error.message}`);
      return new Response(`Webhook Error: ${error.message}`, { status: 400 });
    }
    console.log("Webhook signature error", error);
    return;
  }

  switch(event.type) {
    case "checkout.session.completed": {
      const checkout = event.data.object;
      const organizationId = checkout.client_reference_id;

      if (organizationId === null) {
        console.error("No organization was attached to the session");
        return new Response("Invalid session data", { status: 400 });
      }

      // Setting user customer id
      if (checkout.customer === null) {
        return new Response("Error getting customer id", { status: 502 });
      }

      const stripeCustomerId = typeof checkout.customer === "string"
        ? checkout.customer
        : checkout.customer.id;

      try {
        const organization = await fetchOrganization(organizationId); // fetch from DB
        if (organization.stripeCustomerId !== null) {
          console.log("Customer already exists. Skipping update.");
        } else {
          // Only update if customerId is not already saved
          await updateOrganization(organizationId, { stripeCustomerId });
          console.log("Saved new stripeCustomerId");
        }
      } catch (error) {
        console.error(error);
        return new Response("Error updating user", { status: 500 });
      }
      break;
    }
    case "customer.subscription.created": {
      const subscription = event.data.object;
      const customerId = typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id;
      const subscriptionId = subscription.id;
      const { id } = await fetchOrganization(customerId);
      const priceId = subscription.items.data[0].price.id;
      subscription.items.data[0].id
      await createSubscription({ subscriptionId, organizationId: id, priceId })
      break;
    }
    case "customer.subscription.updated": {
      const subscription = event.data.object;
      const subscriptionId = subscription.id;
      const priceId = subscription.items.data[0].price.id;
      console.log("priceId", priceId)
      await updateSubscription(subscriptionId, { priceId });
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const subscriptionId = subscription.id;
      await deleteSubscription(subscriptionId);
      break;
    }
    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.customer === null) {
        return new Response("Error getting customer id", { status: 502 });
      }
      
      const customerId = typeof invoice.customer === "string"
        ? invoice.customer
        : invoice.customer.id;
      const { id } = await fetchOrganization(customerId);
      const priceId = invoice.lines.data[invoice.lines.data.length - 1].pricing?.price_details?.price!;
      const plan = await fetchPlanByPriceId(priceId);
      // Plan must not be Enterprise. Leave that to later
      if (plan === undefined || plan.priceId === null) {
        console.error("No plan found with price id", priceId);
        return new Response("No plan found", { status: 404 });
      }
      await updateOrganization(id, { remainingAIRuns: plan.maxAIRuns, remainingUploads: plan.maxUploads });
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object;
      console.log("Event:", "invoice.payment_failed");
      break;
    }
  }
  return new Response('Webhook received', { status: 200 });
}