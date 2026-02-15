import { createClient } from "@/lib/supabase/server";
import { Stats } from "@/types";

export async function fetchStats(organizationId: string | null): Promise<Stats> {
  try {
    if (!organizationId) {
      throw new Error("No organization Id was found")
    }

    const supabase = await createClient();

    // Get feedbacks scoped to organization
    const { data: feedbacks, error } = await supabase
      .from('feedbacks')
      .select('topic, sentiment, created_at')
      .eq('organization_id', organizationId);

    if (error) {
      throw new Error(error.message);
    }

    if (!feedbacks || feedbacks.length === 0) {
      return ({
        total: 0,
        bySentiment: { positive: 0, neutral: 0, negative: 0 },
        byTopic: {},
        volumeOverTime: [],
      });
    }

    // Calculate sentiment distribution
    const bySentiment = {
      positive: 0,
      neutral: 0,
      negative: 0
    };

    feedbacks.forEach(f => {
      if (f.sentiment === 'positive') {
        bySentiment.positive++;
      } else if (f.sentiment === 'neutral') {
        bySentiment.neutral++;
      } else if (f.sentiment === 'negative') {
        bySentiment.negative++;
      }
    })

    // Calculate topic distribution
    const topicCounts: Record<string, number> = {};
    feedbacks.forEach(f => {
      topicCounts[f.topic] = (topicCounts[f.topic] || 0) + 1;
    });

    // Calculate volume over time (last 30 days)
    const volumeOverTime: Array<{ date: string; count: number }> = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = feedbacks.filter(f => {
        const feedbackDate = new Date(f.created_at).toISOString().split('T')[0];
        return feedbackDate === dateStr;
      }).length;
      volumeOverTime.push({ date: dateStr, count });
    }

    return ({
      total: feedbacks.length,
      bySentiment,
      byTopic: topicCounts,
      volumeOverTime,
    });
  } catch (error) {
    console.log('Failed to fetch stats: ', error)
    throw new Error('Failed to fetch stats');
  }
}