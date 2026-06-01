"use client";

import { useState } from "react";
import { toast } from "sonner";
import PermissionGate from "@/components/common/PermissionGate";
import { Plan, Subscription, Organization } from "@/types";
import { useCreateCheckoutSession } from "@/lib/api/checkout-session";
import { createPortalSession } from "@/lib/api/billingPortal";
import { statusColor } from "./OrganizationBilling.constants";
import { useCancelSubscriptionMutation, useUpdateSubscriptionMutation } from "@/lib/api/subscriptions";

export default function OrganizationBilling({
  organization,
  subscription,
  plans,
  currentPlan,
}: {
  organization: Organization;
  subscription: Subscription | null;
  plans: Plan[];
  currentPlan: Plan | null;
}) {
  const [isChangingPlan, setIsChangingPlan] = useState<string | null>(null);
  const { createCheckoutSession } = useCreateCheckoutSession();
  const { updateSubscription } = useUpdateSubscriptionMutation();
  const { cancelSubscription } = useCancelSubscriptionMutation();

  async function subscribeToPlan(plan: Plan) {
    const { sessionURL } = await createCheckoutSession(
      organization.id,
      plan.priceId!,
      organization.stripeCustomerId,
    );

    window.location.href = sessionURL;
  }

  async function changePlan(plan: Plan) {
    if (subscription === null) {
      throw new Error("You're not currently subscribed to any plan");
    }
    if (plan.priceId === null) {
      throw new Error("Can't subscribe to free plan");
    }
    await updateSubscription(subscription.stripeSubscriptionId, organization.id, plan.priceId);
    toast.success("Plan changed successfully")
  }

  async function cancelPlan() {
    if (subscription === null) {
      throw new Error("You're not currently subscribed to any plan");
    }
    await cancelSubscription(subscription.stripeSubscriptionId, organization.id);
    toast.success("Plan canceled successfully. Your organization will be at free plan at the end of the cureent billing period")
  }

  async function handlePlanChange(plan: Plan) {
    setIsChangingPlan(plan.name);
    
    const isSubscribingToPlan = plan.name.toLocaleLowerCase() !== "free" && currentPlan === null;
    const isChangingPlan = plan.name.toLocaleLowerCase() !== "free" && currentPlan !== null;
    const isCancelingPlan = plan.name.toLocaleLowerCase() === "free" && currentPlan !== null;

    try {
      if (isSubscribingToPlan) await subscribeToPlan(plan);
      if (isChangingPlan) await changePlan(plan);
      if (isCancelingPlan) await cancelPlan();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to change plan",
      );
    } finally {
      setIsChangingPlan(null);
    }
  }

  async function handleManageBilling() {
    if (!organization.stripeCustomerId) return;

    try {
      const { url } = await createPortalSession(
        organization.stripeCustomerId,
        organization.id,
      );

      window.location.href = url;
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to open billing portal",
      );
    }
  }

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 mb-6 p-6">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
        Billing & Plan
      </h2>

      {currentPlan ? (
        <div className="mb-4 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-900 dark:text-zinc-50">
                {currentPlan.name} Plan
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                ${currentPlan.price}/month &middot; {currentPlan.maxMembers}{" "}
                members &middot; {currentPlan.maxAIRuns} AI runs &middot;{" "}
                {currentPlan.maxUploads} uploads
              </p>
            </div>
            {subscription && (
              <span
                className={`text-sm font-medium capitalize ${
                  statusColor[subscription.status] ||
                  "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                {subscription.status.replace("_", " ")}
              </span>
            )}
          </div>
          {subscription?.status === "past_due" && (
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
              Your last payment failed. Please update your payment method.
            </p>
          )}
          {subscription?.status === "incomplete" && (
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
              Your subscription setup is incomplete. Please complete payment.
            </p>
          )}
        </div>
      ) : (
        <div className="mb-4 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
          <p className="font-medium text-zinc-900 dark:text-zinc-50">
            Free Plan
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            $0/month
          </p>
        </div>
      )}

      <PermissionGate permission="org:billing">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {plans.map((plan) => {
            const isCurrent =
              currentPlan?.priceId === plan.priceId ||
              (!currentPlan && plan.name === "free");

            return (
              <div
                key={plan.id}
                className={`p-4 rounded-lg border ${
                  isCurrent
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-zinc-200 dark:border-zinc-700"
                }`}
              >
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  {plan.name}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  ${plan.price}/month
                </p>
                <ul className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 space-y-1">
                  <li>Up to {plan.maxMembers} members</li>
                  <li>{plan.maxAIRuns} AI runs</li>
                  <li>{plan.maxUploads} uploads</li>
                </ul>
                <button
                  type="button"
                  disabled={isCurrent || isChangingPlan !== null}
                  onClick={() => handlePlanChange(plan)}
                  className={`mt-3 w-full py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    isCurrent
                      ? "bg-zinc-100 dark:bg-zinc-700 text-zinc-400 dark:text-zinc-500 cursor-default"
                      : "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-zinc-300 disabled:cursor-not-allowed"
                  }`}
                >
                  {isChangingPlan === plan.name
                    ? "Redirecting..."
                    : isCurrent
                      ? "Current Plan"
                      : "Change"}
                </button>
              </div>
            );
          })}
        </div>

        {organization.stripeCustomerId && (
          <button
            type="button"
            disabled={isChangingPlan !== null}
            onClick={handleManageBilling}
            className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-50 font-medium cursor-pointer disabled:cursor-not-allowed rounded-lg transition-colors text-sm"
          >
            Manage Billing
          </button>
        )}
      </PermissionGate>
    </div>
  );
}
