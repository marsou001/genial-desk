import { NextRequest, NextResponse } from "next/server";
import { authGuard } from "@/lib/auth-guard";
import { createClient } from "@/lib/supabase/server";
import { hasPermission } from "@/lib/permissions";
import { invalidateCache } from "@/lib/redis";
import { REDIS_KEYS } from "@/lib/redis/keys";
import { revalidatePath } from "next/cache";
import { getUser } from "@/lib";

/**
 * GET /api/organizations/[id]
 * Get organization details
 */
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const guard = await authGuard(id);

  if (!guard.success) {
    return guard.response;
  }

  // Verify user has access to this organization
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organization_members")
    .select(
      `
      id,
      organization_id,
      role:roles (
        name
      ),
      organizations!inner (
        id,
        name,
        remaining_ai_runs,
        remaining_uploads,
        created_at
      )
    `,
    )
    .eq("user_id", guard.user.id)
    .eq("organization_id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Organization membership not found or access denied" },
      { status: 404 },
    );
  }

  const { data: subData } = await supabase
    .from("subscriptions")
    .select("price_id")
    .eq("organization_id", id)
    .maybeSingle();

  const priceId = subData?.price_id ?? null;

  const planQuery =
    priceId === null
      ? supabase
          .from("plans")
          .select("max_ai_runs, max_uploads")
          .is("price_id", null)
          .maybeSingle()
      : supabase
          .from("plans")
          .select("max_ai_runs, max_uploads")
          .eq("price_id", priceId)
          .maybeSingle();

  const { data: planData } = await planQuery;

  const membership = {
    id: data.id,
    organizationId: data.organization_id,
    organizationName: data.organizations.name,
    role: data.role.name.toLowerCase(),
    remainingAIRuns: data.organizations.remaining_ai_runs,
    remainingUploads: data.organizations.remaining_uploads,
    maxAIRuns: planData?.max_ai_runs ?? 15,
    maxUploads: planData?.max_uploads ?? 5,
    createdAt: data.organizations.created_at,
  };

  return NextResponse.json({
    organization: membership,
  });
}

/**
 * PATCH /api/organizations/[id]
 * Update organization (requires org:update permission)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const guard = await authGuard(id, {
    requirePermission: "org:update",
  });

  if (!guard.success) {
    return guard.response;
  }

  // Verify user has access and permission
  const supabase = await createClient();
  const { data: membership, error: membershipError } = await supabase
    .from("organization_members")
    .select("role")
    .eq("user_id", guard.user.id)
    .eq("organization_id", id)
    .single();

  if (membershipError || !membership) {
    return NextResponse.json(
      { error: "Organization not found or access denied" },
      { status: 404 },
    );
  }

  if (!hasPermission(membership.role as any, "org:update")) {
    return NextResponse.json(
      { error: "Insufficient permissions" },
      { status: 403 },
    );
  }

  try {
    const body = await request.json();
    const name = (body?.name as string)?.trim();

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "Organization name must be at least 2 characters" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("organizations")
      .update({ name })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, organization: data });
  } catch (error) {
    console.error("Error updating organization:", error);
    return NextResponse.json(
      { error: "Failed to update organization" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/organizations/[id]
 * Delete organization (requires owner role)
 */
export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: organizationId } = await params;
  const guard = await authGuard(organizationId, {
    requirePermission: "org:delete",
  });

  if (!guard.success) {
    return guard.response;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("organizations").delete().eq("id", organizationId);

  if (error) {
    console.log("Error deleting organization ==> ", error.message);
    return NextResponse.json(
      { error: "Error deleting organization" },
      { status: 500 },
    );
  }

  const { id: userId } = await getUser();

  await Promise.all([
    invalidateCache(REDIS_KEYS.feedbacks(organizationId)),
    invalidateCache(REDIS_KEYS.members(organizationId)),
    invalidateCache(REDIS_KEYS.organization(organizationId)),
    invalidateCache(REDIS_KEYS.userMemberships(userId)),
  ]);
  revalidatePath("/organizations");
  return NextResponse.json({ success: true }, { status: 200 });
}
