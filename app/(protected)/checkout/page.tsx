import Stripe from "stripe";
import Link from "next/link";
import { fetchPlanByPriceId } from "@/data/plans";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-4 text-zinc-400">—</div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
            Checkout Cancelled
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">
            No payment was made. You can try again whenever you&apos;re ready.
          </p>
          <Link
            href="/organizations"
            className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Back to Organizations
          </Link>
        </div>
      </div>
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items.data.price.product"],
    });

    const orgId = session.client_reference_id;

    const priceId = session.line_items?.data[0]?.price?.id;
    if (!priceId) {
      throw new Error ("Couldn't find price id");
    }

    const plan = await fetchPlanByPriceId(priceId);

    if (session.payment_status === "paid") {
      return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-8 max-w-md w-full text-center">
            <div className="text-4xl mb-4 text-green-500">&#x2713;</div>
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
              Payment Successful!
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mb-4">
              Your subscription is now active.
            </p>

            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-4 mb-6 text-left border border-zinc-200 dark:border-zinc-700">
              <p className="font-medium text-zinc-900 dark:text-zinc-50">
                {plan.name} Plan
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                ${plan.price}/month
              </p>
              <ul className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 space-y-1">
                <li>Up to {plan.maxMembers} members</li>
                <li>{plan.maxAIRuns} AI runs per month</li>
                <li>{plan.maxUploads} uploads per month</li>
              </ul>
            </div>

            <Link
              href={
                orgId
                  ? `/organizations/${orgId}/dashboard`
                  : "/organizations"
              }
              className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-4 text-amber-500">&#x26A0;</div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
            Payment Incomplete
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">
            Your payment was not completed. Please try again.
          </p>
          <Link
            href={
              orgId
                ? `/organizations/${orgId}/settings`
                : "/organizations"
            }
            className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Try Again
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error retrieving checkout session", error);
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-4 text-red-500">&#x2717;</div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
            Verification Failed
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">
            Could not verify your payment status. If you were charged, please
            contact support.
          </p>
          <Link
            href="/organizations"
            className="text-blue-600 hover:underline font-medium"
          >
            Back to Organizations
          </Link>
        </div>
      </div>
    );
  }
}
