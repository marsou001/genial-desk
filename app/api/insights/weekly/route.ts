import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { generateWeeklyInsights } from '@/lib/openai';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');

    const supabase = createServerClient();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data: feedbacks, error } = await supabase
      .from('feedbacks')
      .select('text, topic, sentiment')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!feedbacks || feedbacks.length === 0) {
      return NextResponse.json({
        insights: 'No feedback available for this period.',
        count: 0,
      });
    }

    const insights = await generateWeeklyInsights(feedbacks);

    return NextResponse.json({
      insights,
      count: feedbacks.length,
      period: `${days} days`,
    });
  } catch (error) {
    console.error('Insights error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate insights' },
      { status: 500 }
    );
  }
}
