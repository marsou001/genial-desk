import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeFeedback } from '@/lib/openai';
import { authGuard } from '@/lib/auth-guard';
import Papa from 'papaparse';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const guard = await authGuard(id, {
    requirePermission: 'data:create',
  });

  if (!guard.success) {
    return guard.response;
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const source = formData.get('source') || 'CSV Upload';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const text = await file.text();
    const supabase = await createClient();

    // Parse CSV using papaparse
    const parseResult = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase(),
    });

    if (parseResult.errors.length > 0) {
      console.warn('CSV parsing warnings:', parseResult.errors);
    }

    const rows = parseResult.data as Record<string, string>[];
    if (rows.length === 0) {
      return NextResponse.json({ error: 'CSV file is empty or invalid' }, { status: 400 });
    }

    // Find the feedback column
    const headers = Object.keys(rows[0] || {});
    const textColumnKey = headers.find(h => 
      h.includes('feedback') || 
      h.includes('comment') || 
      h.includes('text') ||
      h.includes('message')
    );

    if (!textColumnKey) {
      return NextResponse.json({ 
        error: 'No feedback column found. Please include a column named "feedback", "comment", "text", or "message"',
        availableColumns: headers
      }, { status: 400 });
    }

    const feedbacks = [];
    const errors = [];

    // Process each row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const feedbackText = row[textColumnKey]?.trim() || '';
      
      if (!feedbackText || feedbackText.length < 10) {
        continue; // Skip empty or too short feedback
      }

      try {
        // Analyze with AI
        const analysis = await analyzeFeedback(feedbackText);
        // const analysis = {
        //   topic: 'General',
        //   sentiment: 'neutral',
        //   summary: text.substring(0, 100),
        //   keywords: ["customer satisfaction", "customer service"],
        // }

        // Insert into database (scoped to organization)
        const { data, error } = await supabase
          .from('feedbacks')
          .insert({
            text: feedbackText,
            source: source as string,
            topic: analysis.topic,
            sentiment: analysis.sentiment,
            summary: analysis.summary,
            keywords: analysis.keywords,
            organization_id: id,
          })
          .select()
          .single();

        if (error) {
          errors.push(`Row ${i + 2}: ${error.message}`);
        } else {
          feedbacks.push(data);
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json({
      success: true,
      processed: feedbacks.length,
      errors: errors.length > 0 ? errors : undefined,
      feedbacks: feedbacks.slice(0, 10), // Return first 10 for preview
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    );
  }
}
