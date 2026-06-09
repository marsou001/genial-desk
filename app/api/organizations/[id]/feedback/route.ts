import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authGuard } from "@/lib/auth-guard";
import { checkUploadLimits, consumeUploadLimits } from "@/lib/usage-limits";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const guard = await authGuard(id, {
    requirePermission: "data:read",
  });

  if (!guard.success) {
    return guard.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");

    const supabase = await createClient();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { error, data } = await supabase
      .from("feedbacks")
      .select("*")
      .eq("organization_id", id)
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Failed to get feedbacks ==>", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get feedbacks",
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
    requirePermission: "data:create",
  });

  if (!guard.success) {
    return guard.response;
  }

  try {
    const usageCheck = await checkUploadLimits(id);
    if (!usageCheck.allowed) {
      return NextResponse.json(
        { success: false, error: usageCheck.error },
        { status: usageCheck.status },
      );
    }

    const body = await request.json();
    const text = (body?.text as string | undefined)?.trim();
    const source =
      (body?.source as string | undefined)?.trim() || "Manual Entry";

    if (!text || text.length < 10) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Feedback is too short. Please provide at least a short sentence so we can analyze it.",
        },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Analyze feedback with AI
    // const analysis = await analyzeFeedback(text);
    const analysis = {
      topic: "General",
      sentiment: "neutral",
      summary: text.substring(0, 100),
      keywords: ["customer satisfaction", "customer service"],
    };

    // Insert into database (scoped to organization)
    const { error } = await supabase.from("feedbacks").insert({
      text,
      source,
      topic: analysis.topic,
      sentiment: analysis.sentiment,
      summary: analysis.summary,
      keywords: analysis.keywords,
      organization_id: id,
    });

    if (error) {
      throw new Error(error.message);
    }

    await consumeUploadLimits(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Manual feedback error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit feedback",
      },
      { status: 500 },
    );
  }
}
