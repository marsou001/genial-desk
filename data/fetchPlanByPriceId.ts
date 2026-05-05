import { getCache, setCache } from "@/lib/redis";
import { REDIS_KEYS } from "@/lib/redis/keys";
import { createClient } from "@/lib/supabase/server";
import { Plan } from "@/types";

export async function fetchPlanByPriceId(
  priceId: string
): Promise<Plan> {
  const cacheKey = REDIS_KEYS.plan(priceId);
  const cachedValue = await getCache<Plan>(cacheKey);
  if (cachedValue !== null) return cachedValue;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("plans")
      .select()
      .eq("price_id", priceId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const plan = {
      id: data.id,
      name: data.name,
      priceId: data.price_id,
      maxMembers: data.max_members,
      maxUploads: data.max_uploads,
      maxAIRuns: data.max_ai_runs,
    } as Plan;

    await setCache(cacheKey, data);
    return plan;
  } catch (error) {
    console.log("Error fetching organization with id", error);
    throw new Error("Error fetching organization with id");
  }
}