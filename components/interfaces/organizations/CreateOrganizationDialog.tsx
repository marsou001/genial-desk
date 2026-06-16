"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback, SubmitEvent } from "react";
import { toast } from "sonner";
import { useFetchPlans } from "@/lib/api/plans";
import { createOrganization } from "@/lib/api/createOrganization";
import { useCreateCheckoutSession } from "@/lib/api/checkout-session";

export default function CreateOrganizationDialog({
  isOpen,
  handleClose,
}: {
  isOpen: boolean;
  handleClose: () => void;
}) {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrganizationNameValid, setIsOrganizationNameValid] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const { createCheckoutSession } = useCreateCheckoutSession();

  const {
    data: plans,
    getPlans,
    loading: isFetchingPlans,
    error,
  } = useFetchPlans();

  const validateName = useCallback(() => {
    const valid =
      nameInputRef.current !== null &&
      nameInputRef.current.value.trim().length > 2;
    setIsOrganizationNameValid(valid);
  }, []);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isOrganizationNameValid || isSubmitting) return;

    const name = nameInputRef.current?.value.trim();
    if (!name) return;

    setIsSubmitting(true);
    let createdOrgId: string;

    try {
      const result = await createOrganization(name);
      createdOrgId = result.organization.id;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong while creating your organization",
      );
      setIsSubmitting(false);
      return;
    }
    
    if (selectedPlan === "free") {
      toast.success("Organization created successfully");
      setIsSubmitting(false);
      handleClose();
      router.push(`/organizations/${createdOrgId}/dashboard`);
      return;
    }

    const plan = plans.find((p) => p.name.toLowerCase() === selectedPlan);
    if (!plan) {
      toast.error("Selected plan not found");
      setIsSubmitting(false);
      return;
    }

    try {
      const { sessionURL } = await createCheckoutSession(
        createdOrgId,
        plan.priceId!,
        null,
      );
  
      window.location.href = sessionURL;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Organization created, but we couldn't start checkout. You can upgrade later from Billing.",
      );
      router.push(`/organizations/${createdOrgId}/dashboard`);
    }
  }

  useEffect(() => {
    if (error) setSelectedPlan("free");
  }, [error]);

  useEffect(() => {
    if (!isOpen || plans.length > 0) return;
    getPlans();
  }, [isOpen, getPlans]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
          Create Organization
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Organization Name
            </label>
            <input
              onChange={validateName}
              ref={nameInputRef}
              id="name"
              type="text"
              name="name"
              required
              minLength={3}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="My Company"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="plan" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Plan
            </label>

            {isFetchingPlans ? (
              <div className="flex items-center gap-2 py-3 text-sm text-zinc-500">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Loading plans...
              </div>
            ) : error ? (
              <div className="py-2 px-3 mb-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg">
                {error}
              </div>
            ) : (
              <select
                id="plan"
                name="plan"
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                disabled={!!error || isFetchingPlans}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {plans.map((plan) => (
                  <option key={plan.name} value={plan.name} className="capitalize">
                    {plan.name} — ${plan.price}/month
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={
                isSubmitting || !isOrganizationNameValid || isFetchingPlans
              }
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 cursor-pointer disabled:bg-zinc-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {isSubmitting
                ? "Creating..."
                : selectedPlan === "free"
                  ? "Create"
                  : "Continue to Payment"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-50 font-medium cursor-pointer disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
