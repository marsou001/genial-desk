import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeFeedback } from '@/lib/openai';
import { authGuard } from '@/lib/auth-guard';

export async function POST(request: NextRequest) {
  const guard = await authGuard(request, {
    requireAuth: true,
    requireOrg: true,
    requirePermission: 'data:create',
  });

  if (!guard.success) {
    return guard.response;
  }

  try {
    const body = await request.json();
    const text = (body?.text as string | undefined)?.trim();
    const source = (body?.source as string | undefined)?.trim() || 'Manual Entry';

    if (!text || text.length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: 'Feedback is too short. Please provide at least a short sentence so we can analyze it.',
        },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Analyze feedback with AI
    const analysis = await analyzeFeedback(text);

    // Insert into database (scoped to organization)
    const { data, error } = await supabase
      .from('feedbacks')
      .insert({
        text,
        source,
        topic: analysis.topic,
        sentiment: analysis.sentiment,
        summary: analysis.summary,
        keywords: analysis.keywords,
        organization_id: guard.organizationId,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      feedback: data,
    });
  } catch (error) {
    console.error('Manual feedback error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit feedback',
      },
      { status: 500 },
    );
  }
}

