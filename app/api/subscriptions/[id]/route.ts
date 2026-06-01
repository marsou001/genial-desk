import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { authGuard } from "@/lib/auth-guard";
import { fetchPlanByPriceId } from "@/data/plans";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: subscriptionId } = await params;
  const body = await request.json();
  const { organizationId, priceId } = body;

  if (!organizationId || !priceId) {
    return NextResponse.json(
      { error: "Missing organizationId or priceId" },
      { status: 400 },
    );
  }

  const auth = await authGuard(organizationId, {
    requirePermission: "org:billing",
  });
  if (!auth.success) return auth.response;

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const itemId = subscription.items.data[0].id;

    const currentPriceId = subscription.items.data[0].price.id;
    const [currentPlan, newPlan] = await Promise.all([
      fetchPlanByPriceId(currentPriceId),
      fetchPlanByPriceId(priceId),
    ]);

    const isDowngrade = newPlan.price < currentPlan.price;

    await stripe.subscriptions.update(subscriptionId, {
      items: [{ id: itemId, price: priceId }],
      proration_behavior: isDowngrade ? "none" : "always_invoice",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating subscription", error);
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: subscriptionId } = await params;
  const body = await request.json();
  const { organizationId } = body;

  if (!organizationId) {
    return NextResponse.json(
      { error: "Missing organizationId" },
      { status: 400 },
    );
  }

  const auth = await authGuard(organizationId, {
    requirePermission: "org:billing",
  });
  if (!auth.success) return auth.response;

  try {
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error canceling subscription", error);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 },
    );
  }
}