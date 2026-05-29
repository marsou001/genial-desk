import { getUser } from "@/lib";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return Response.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return Response.json({ session });
  } catch (error) {
    console.error("Error retrieving checkout session", error);
    return Response.json(
      { error: "Failed to retrieve session" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const {
      organizationId,
      priceId,
      customerId,
      redirectPath = "dashboard",
    } = await req.json();
    if (!organizationId || !priceId) {
      throw new Error("Missing organizationId or priceId");
    }

    const headerPayload = await headers();
    const origin = headerPayload.get("origin");

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/organizations/${organizationId}/${redirectPath}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/organizations/${organizationId}/${redirectPath}`,
      client_reference_id: organizationId,
      subscription_data: {
        metadata: {
          organization_id: organizationId,
        }
      }
    };
    console.log("customerId", customerId)
    if (customerId) {
      sessionParams.customer = customerId;
    } else {
      const user = await getUser();
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          organization_id: organizationId,
        }
      }, {
        // idempotencyKey: "customer__" + organizationId,
      });
      console.log("customer.id", customer.id)
      sessionParams.customer = customer.id;
    }

    const session = await stripe.checkout.sessions.create(sessionParams, {
      // idempotencyKey: "session__" + organizationId,
    });
    return Response.json({ sessionURL: session.url });
  } catch (error) {
    console.error("Error creating checkout session", error);
    return Response.json(
      { error: "Error creating checkout session" },
      { status: 500 },
    );
  }
}
