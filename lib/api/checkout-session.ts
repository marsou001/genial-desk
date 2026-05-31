import { useState, useCallback } from "react";
import Stripe from "stripe";
import { get, post } from "./client";

export interface CreateCheckoutSessionResponse {
  sessionURL: string;
}

export interface RetrieveCheckoutSessionResponse {
  session: Stripe.Checkout.Session;
}

export function useFetchCheckoutSession() {
  const [data, setData] = useState<Stripe.Checkout.Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getSessionStatus(sessionId: string) {
    setLoading(true);
    setError(null);
    try {
      const response = await get<RetrieveCheckoutSessionResponse>(
        `checkout-session?session_id=${sessionId}`,
      );
      setData(response.session);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch session",
      );
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, getSessionStatus };
}

export function useCreateCheckoutSession() {
  const [data, setData] = useState<CreateCheckoutSessionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createCheckoutSession(
    organizationId: string,
    priceId: string,
    customerId: string | null,
  ) {
    setLoading(true);
    setError(null);
    try {
      const response = await post<CreateCheckoutSessionResponse>("checkout-session", {
        organizationId,
        priceId,
        customerId,
      });
      setData(response);
      return response;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create session",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, createCheckoutSession };
}
