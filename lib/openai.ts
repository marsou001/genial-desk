import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export interface FeedbackAnalysis {
  topic: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  summary: string;
  keywords: string[];
}

export async function analyzeFeedback(text: string): Promise<FeedbackAnalysis> {
  if (!process.env.OPENAI_API_KEY) {
    // Fallback for demo without API key
    return {
      topic: 'General',
      sentiment: 'neutral',
      summary: text.substring(0, 100),
      keywords: [],
    };
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a feedback analysis assistant. Analyze customer feedback and return a JSON object with:
- topic: A single category (e.g., "Pricing", "UX", "Bugs", "Features", "Support", "Performance")
- sentiment: "positive", "neutral", or "negative"
- summary: A concise 1-2 sentence summary
- keywords: Array of 3-5 key terms from the feedback

Return ONLY valid JSON, no markdown formatting.`,
        },
        {
          role: 'user',
          content: `Analyze this feedback: "${text}"`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const analysis = JSON.parse(content) as FeedbackAnalysis;
    return analysis;
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Fallback analysis
    return {
      topic: 'General',
      sentiment: 'neutral',
      summary: text.substring(0, 100),
      keywords: [],
    };
  }
}

export async function generateWeeklyInsights(feedbacks: Array<{ text: string; topic: string; sentiment: string }>): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return 'Weekly insights require OpenAI API key configuration.';
  }

  try {
    const feedbackSummary = feedbacks
      .slice(0, 50) // Limit to avoid token limits
      .map((f, i) => `${i + 1}. [${f.topic}] ${f.sentiment}: ${f.text.substring(0, 100)}`)
      .join('\n');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a customer insights analyst. Generate a concise weekly summary highlighting key trends, patterns, and actionable insights from customer feedback.',
        },
        {
          role: 'user',
          content: `Based on this week's feedback (${feedbacks.length} items), generate a 3-4 paragraph weekly insight summary:\n\n${feedbackSummary}`,
        },
      ],
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || 'Unable to generate insights.';
  } catch (error) {
    console.error('OpenAI API error:', error);
    return 'Error generating weekly insights.';
  }
}
