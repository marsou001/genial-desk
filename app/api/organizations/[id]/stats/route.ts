import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");

    const supabase = await createClient();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data: feedbacks, error } = await supabase
      .from("feedbacks")
      .select("topic, sentiment, created_at")
      .eq("organization_id", id)
      .gte("created_at", startDate.toISOString());

    if (error) {
      throw new Error(error.message);
    }

    if (!feedbacks || feedbacks.length === 0) {
      return NextResponse.json({
        total: 0,
        bySentiment: { positive: 0, neutral: 0, negative: 0 },
        byTopic: {},
        volumeOverTime: [],
      });
    }

    const bySentiment = {
      positive: 0,
      neutral: 0,
      negative: 0,
    };

    feedbacks.forEach((f) => {
      if (f.sentiment === "positive") {
        bySentiment.positive++;
      } else if (f.sentiment === "neutral") {
        bySentiment.neutral++;
      } else if (f.sentiment === "negative") {
        bySentiment.negative++;
      }
    });

    const topicCounts: Record<string, number> = {};
    feedbacks.forEach((f) => {
      topicCounts[f.topic] = (topicCounts[f.topic] || 0) + 1;
    });

    const volumeOverTime: Array<{ date: string; count: number }> = [];
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const count = feedbacks.filter((f) => {
        const feedbackDate = new Date(f.created_at).toISOString().split("T")[0];
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
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 },
    );
  }
}