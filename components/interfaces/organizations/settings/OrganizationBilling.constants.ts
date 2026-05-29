import Stripe from "stripe";

export const statusColor: Partial<Record<Stripe.Subscription.Status, string>> = {
  active: "text-green-600 dark:text-green-400",
  past_due: "text-amber-600 dark:text-amber-400",
  incomplete: "text-amber-600 dark:text-amber-400",
  canceled: "text-red-600 dark:text-red-400",
  trialing: "text-blue-600 dark:text-blue-400",
  unpaid: "text-red-600 dark:text-red-400",
};