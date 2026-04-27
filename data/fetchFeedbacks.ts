import { createClient } from "@/lib/supabase/server";
import { Feedback } from "@/types/database";

export async function fetchFeedbacks(
  organizationId: string | null,
  days: number = 30,
): Promise<Feedback[]> {
  if (!organizationId) {
    return [];
  }
  try {
    const supabase = await createClient();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { error, data } = await supabase
      .from("feedbacks")
      .select("*")
      .eq("organization_id", organizationId)
      .gte("created_at", startDate.toISOString())
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
