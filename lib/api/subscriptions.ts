import { useState } from "react";
import { patch, del } from "./client";

export function useUpdateSubscriptionMutation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  async function updateSubscription(
    subscriptionId: string,
    organizationId: string,
    priceId: string,
  ): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      await patch(`subscriptions/${subscriptionId}`, { organizationId, priceId });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update subscription");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, updateSubscription };
}

export function useCancelSubscriptionMutation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  async function cancelSubscription(
    subscriptionId: string,
    organizationId: string,
  ): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      await del(`subscriptions/${subscriptionId}`, { organizationId });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel subscription");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, cancelSubscription };
}