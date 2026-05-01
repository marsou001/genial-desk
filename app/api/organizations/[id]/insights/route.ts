import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateInsights } from "@/lib/openai";
import { authGuard } from "@/lib/auth-guard";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const guard = await authGuard(id, {
    requirePermission: "insights:read",
  });

  if (!guard.success) {
    return guard.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("insights")
      .select("insight, created_at")
      .eq("organization_id", id)
      .eq("period", days)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return NextResponse.json({
        data: null
      });
    }

    return NextResponse.json({
      data: data.insight,
      lastGenerated: new Date(data.created_at).toISOString(),
      period: `${days} days`,
    });
  } catch (error) {
    console.error("Insights fetching error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch insights",
      },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const guard = await authGuard(id, {
    requirePermission: "insights:create",
  });

  if (!guard.success) {
    return guard.response;
  }

  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get("days") || "30");
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const supabase = await createClient();

  try {
    const { data: feedbacksData, error: feedbacksError } = await supabase
      .from("feedbacks")
      .select("text, topic, sentiment")
      .eq("organization_id", guard.organizationId)
      .order("created_at", { ascending: false })
      .gte("created_at", startDate.toISOString());

    if (feedbacksError) {
      throw new Error(feedbacksError.message);
    }

    if (!feedbacksData || feedbacksData.length === 0) {
      return NextResponse.json({
        error: "No feedback was found to make insights from. Upload some feedback then try again"
      }, { status: 404 });
    }

    // const insights = await generateInsights(feedbacksData);
    const insights = "insights";
    const today = new Date().toISOString();

    const { error: insightsError } = await supabase
      .from("insights")
      .insert({ insight: insights, organization_id: id, period: days, created_at: today })
    
    if (insightsError) {
      throw new Error(insightsError.message);
    }

    return NextResponse.json({
      data: insights,
      lastGenerated: today,
      period: `${days} days`,
    });
  } catch (error) {
    console.error("Insights generation error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate insights",
      },
      { status: 500 },
    );
  }
}