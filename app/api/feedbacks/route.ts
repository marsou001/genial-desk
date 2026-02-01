import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const topic = searchParams.get('topic');
    const sentiment = searchParams.get('sentiment');

    const supabase = createServerClient();
    let query = supabase
      .from('feedbacks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (topic) {
      query = query.eq('topic', topic);
    }

    if (sentiment) {
      query = query.eq('sentiment', sentiment);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ feedbacks: data || [] });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch feedbacks' },
      { status: 500 }
    );
  }
}
