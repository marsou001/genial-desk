import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateWeeklyInsights } from '@/lib/openai';
import { authGuard } from '@/lib/auth-guard';

export async function GET(request: NextRequest) {
  const guard = await authGuard(request, {
    requireAuth: true,
    requireOrg: true,
    requirePermission: 'insights:read',
  });

  if (!guard.success) {
    return guard.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');

    const supabase = await createClient();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data: feedbacks, error } = await supabase
      .from('feedbacks')
      .select('text, topic, sentiment')
      .eq('organization_id', guard.organizationId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!feedbacks || feedbacks.length === 0) {
      return NextResponse.json({
        data: 'No feedback available for this period.',
        count: 0,
        period: `${days} days`,
      });
    }

    const insights = await generateWeeklyInsights(feedbacks);

    return NextResponse.json({
      data: insights,
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
