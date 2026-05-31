import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib";
import { PLANS } from "@/lib/constants";
import { REDIS_KEYS } from "@/lib/redis/keys";
import { getCache, invalidateCache, setCache } from "@/lib/redis";
import { OrganizationView } from "@/types";

/**
 * GET /api/organizations
 * List all organizations the user belongs to
 */
export async function GET() {
  const { id } = await getUser();
  const cacheKey = REDIS_KEYS.organizations(id);
  const cachedValue = await getCache<OrganizationView[]>(cacheKey);
  if (cachedValue !== null) return cachedValue;

  try {
    const supabase = await createClient();

    const { data: memberships, error } = await supabase
      .from("organization_members")
      .select(
        `
        organization_id,
        role:roles (
          name
        ),
        organizations!inner (
          id,
          name,
          created_at
        )
      `,
      )
      .eq("user_id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const organizations = (memberships || []).map((m: any) => ({
      id: m.organization_id,
      name: m.organizations.name,
      role: m.role,
      createdAt: m.organizations.created_at,
    }));

    await setCache(cacheKey, organizations);
    return NextResponse.json({ organizations });
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return NextResponse.json(
      { error: "Failed to fetch organizations" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/organizations
 * Create a new organization (user becomes Owner)
 * Accepts: { name, plan: "free" | "pro" | "business" }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = (body?.name as string)?.trim();
    const plan = (body?.plan as string) || "free";

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "Organization name must be at least 2 characters" },
        { status: 400 },
      );
    }

    if (!PLANS.includes(plan)) {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Look up free plan limits as defaults for all plans
    const { data: plans } = await supabase
      .from("plans")
      .select("max_ai_runs, max_uploads, max_members")
      .eq("name", "free")
      .maybeSingle();

    const defaultAIRuns = plans?.max_ai_runs ?? 15;
    const defaultUploads = plans?.max_uploads ?? 5;
    const orgId = crypto.randomUUID();

    // Create organization with default limits
    const { error: orgError } = await supabase
      .from("organizations")
      .insert({
        id: orgId,
        name,
        remaining_ai_runs: defaultAIRuns,
        remaining_uploads: defaultUploads,
        last_reset_at: new Date().toISOString(),
      })

    if (orgError) throw new Error(orgError.message);
    const { id } = await getUser();
    await invalidateCache(REDIS_KEYS.organizations(id))
    return NextResponse.json({
      success: true,
      plan,
      organization: {
        id: orgId,
        name,
        role: "owner",
      },
    });
  } catch (error) {
    console.error("Error creating organization:", error);
    return NextResponse.json(
      { error: "Failed to create organization" },
      { status: 500 },
    );
  }
}
