import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { analyzeFeedback } from '@/lib/openai';

export async function POST(request: NextRequest) {
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

    const supabase = createServerClient();

    // Analyze feedback with AI
    const analysis = await analyzeFeedback(text);

    // Insert into database
    const { data, error } = await supabase
      .from('feedbacks')
      .insert({
        text,
        source,
        topic: analysis.topic,
        sentiment: analysis.sentiment,
        summary: analysis.summary,
        keywords: analysis.keywords,
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

