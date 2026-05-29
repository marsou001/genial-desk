import { useState } from "react";
import { get } from "./client";
import { Plan } from "@/types";

export function useFetchPlans() {
  const [data, setData] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getPlans() {
    setLoading(true);
    setError(null);
    try {
      const response = await get<{ data: Plan[] }>("plans");
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, getPlans };
}
