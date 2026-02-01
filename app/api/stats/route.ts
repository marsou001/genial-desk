import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();

    // Get all feedbacks
    const { data: feedbacks, error } = await supabase
      .from('feedbacks')
      .select('topic, sentiment, created_at');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!feedbacks || feedbacks.length === 0) {
      return NextResponse.json({
        total: 0,
        bySentiment: { positive: 0, neutral: 0, negative: 0 },
        byTopic: {},
        volumeOverTime: [],
      });
    }

    // Calculate sentiment distribution
    const bySentiment = {
      positive: feedbacks.filter(f => f.sentiment === 'positive').length,
      neutral: feedbacks.filter(f => f.sentiment === 'neutral').length,
      negative: feedbacks.filter(f => f.sentiment === 'negative').length,
    };

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

    return NextResponse.json({
      total: feedbacks.length,
      bySentiment,
      byTopic: topicCounts,
      volumeOverTime,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
