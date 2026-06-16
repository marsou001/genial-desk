import { supabase } from "./supabase.ts";
import { getCache, setCache } from "./cache.ts";
import { Plan } from "./types.ts";

export async function fetchPlanByPriceId(
  priceId: string,
): Promise<Plan> {
  const cacheKey = `plan_${priceId}`;
  const cachedValue = await getCache<Plan>(cacheKey);
  if (cachedValue !== null) return cachedValue;

  try {
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .eq("price_id", priceId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const plan = {
      id: data.id,
      name: data.name,
      price: data.price,
      priceId: data.price_id,
      maxUploads: data.max_uploads,
      maxAIRuns: data.max_ai_runs,
    } as Plan;

    await setCache(cacheKey, plan);
    return plan;
  } catch (error) {
    console.error("Error fetching plan by price id", error);
    throw new Error("Error fetching plan");
  }
}
