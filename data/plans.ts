import { getCache, setCache } from "@/lib/redis";
import { REDIS_KEYS } from "@/lib/redis/keys";
import { createClient } from "@/lib/supabase/server";
import { Plan } from "@/types";

export async function fetchPlans(): Promise<Plan[]> {
  const cacheKey = REDIS_KEYS.plans();
  const cachedValue = await getCache<Plan[]>(cacheKey);
  if (cachedValue !== null) return cachedValue;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .order("price");

    if (error) throw new Error(error.message);

    const plans: Plan[] = (data || []).map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      priceId: p.price_id,
      maxAIRuns: p.max_ai_runs,
      maxUploads: p.max_uploads,
      maxMembers: p.max_members,
    }));

    await setCache(cacheKey, plans);
    return plans;
  } catch (error) {
    console.error("Error fetching plans", error);
    throw new Error("Failed to fetch plans");
  }
}

export async function fetchPlanByPriceId(priceId: string | null): Promise<Plan> {
  const cacheKey = REDIS_KEYS.plan(priceId);
  const cachedValue = await getCache<Plan>(cacheKey);
  if (cachedValue !== null) return cachedValue;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .eq("price_id", priceId)
      .single();

    if (error) throw new Error(error.message);

    const plan: Plan = {
      id: data.id,
      name: data.name,
      price: data.price,
      priceId: data.price_id,
      maxAIRuns: data.max_ai_runs,
      maxUploads: data.max_uploads,
      maxMembers: data.max_members,
    };

    await setCache(cacheKey, plan);
    return plan;
  } catch (error) {
    console.error("Error fetching plan with price id", priceId, error);
    throw new Error("Failed to fetch plan with price id" + priceId);
  }
}
