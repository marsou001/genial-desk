import { headers } from "next/headers";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { customerId, organizationId } = await req.json();
    if (!customerId || !organizationId) {
      throw new Error("Missing customerId or organizationId");
    }

    const headerPayload = await headers();
    const origin = headerPayload.get("origin");

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/organizations/${organizationId}/settings`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Error creating portal session", error);
    return Response.json(
      { error: "Error creating portal session" },
      { status: 500 },
    );
  }
}
