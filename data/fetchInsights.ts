import { createClient } from "@/lib/supabase/server";
import { Insights } from "@/types";

export async function fetchInsights(
  organizationId: string,
  days: number = 7,
): Promise<Insights> {
  try {
    if (!organizationId) {
      throw new Error("No organization selected. Please select an organization to view insights.")
    }

    const supabase = await createClient();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from("insights")
      .select("insight, created_at")
      .eq("organization_id", organizationId)
      .eq("period", days)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return { data: null };
    }

    return {
      data: data.insight,
      lastGenerated: new Date(data.created_at).toISOString(),
      period: `${days} days`,
    };
  } catch (error) {
    console.error("Insights error:", error);
    throw new Error("Failed to fetch insights");
  }
}
