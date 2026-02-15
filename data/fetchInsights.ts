import { generateWeeklyInsights } from "@/lib/openai";
import { createClient } from "@/lib/supabase/server";
import { Insights } from "@/types";

export async function fetchInsights(
  days: number = 7,
  organizationId: string | null = null,
  projectId?: string | null
): Promise<Insights> {
  try {
    if (!organizationId) {
      return {
        data: 'No organization selected. Please select an organization to view insights.',
        count: 0,
        period: `${days} days`,
      };
    }

    const supabase = await createClient();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let query = supabase
      .from('feedbacks')
      .select('text, topic, sentiment')
      .eq('organization_id', organizationId)
      .gte('created_at', startDate.toISOString());

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data: feedbacks, error } = await query.order('created_at', { ascending: false });

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
    throw new Error('Failed to generate insights')
  }
}