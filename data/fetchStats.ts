import { createServerClient } from "@/lib/supabase";
import { Stats } from "@/types";

export async function fetchStats(): Promise<Stats> {
  try {
    // throw new Error("yoooooooooooooo")
    const supabase = createServerClient();

    // Get all feedbacks
    const { data: feedbacks, error } = await supabase
      .from('feedbacks')
      .select('topic, sentiment, created_at');

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
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch stats');
  }
}