import { getCache } from "@/lib/redis";
import { REDIS_KEYS } from "@/lib/redis/keys";
import { createClient } from "@/lib/supabase/server";
import { Feedback } from "@/types/database";

export async function fetchFeedbacks(
  organizationId: string | null,
): Promise<Feedback[]> {
  if (!organizationId) {
    return [];
  }
  
  const cachedValue = await getCache<Feedback[]>(REDIS_KEYS.feedbacks(organizationId));
  if (cachedValue !== null) return cachedValue;

  try {
    const supabase = await createClient();
    const { error, data } = await supabase
      .from("feedbacks")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.log("Failed to fetch feedbacks: ", error);
    throw new Error("Failed to fetch feedbacks");
  }
}
