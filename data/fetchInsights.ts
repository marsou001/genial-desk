import { generateWeeklyInsights } from "@/lib/openai";
import { createServerClient } from "@/lib/supabase";
import { Insights } from "@/types";

export async function fetchInsights(days: number = 7): Promise<Insights> {
  try {
    const supabase = createServerClient();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data: feedbacks, error } = await supabase
      .from('feedbacks')
      .select('text, topic, sentiment')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message)
    }

    if (!feedbacks || feedbacks.length === 0) {
      return ({
        data: 'No feedback available for this period.',
        count: 0,
        period: `${days} days`,
      });
    }

    const insights = await generateWeeklyInsights(feedbacks);

    return ({
      data: insights,
      count: feedbacks.length,
      period: `${days} days`,
    });
  } catch (error) {
    console.error('Insights error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate insights')
  }
}