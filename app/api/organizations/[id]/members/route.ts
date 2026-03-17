import { NextRequest, NextResponse } from 'next/server';
import { authGuard } from '@/lib/auth-guard';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib';

/**
 * GET /api/organizations/[id]/members
 * List all members of an organization
 */
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const guard = await authGuard(id, {
    requirePermission: 'org:members:read',
  });

  if (!guard.success) {
    return guard.response;
  }

  // Verify user has access to this organization
  const supabase = await createClient();
  const { data: userMembership, error: membershipError } = await supabase
    .from('organization_members')
    .select('role')
    .eq('user_id', guard.user.id)
    .eq('organization_id', id)
    .single();

  if (membershipError || !userMembership) {
    return NextResponse.json(
      { error: 'Organization not found or access denied' },
      { status: 404 }
    );
  }

  const { data: members, error } = await supabase
    .from('organization_members')
    .select(`
      id,
      user_id,
      role,
      created_at,
      auth.users!inner (
        email
      )
    `)
    .eq('organization_id', id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  // Transform members data
  const transformedMembers = (members || []).map((m: any) => ({
    id: m.id,
    user_id: m.user_id,
    email: m.auth?.users?.email || null,
    role: m.role,
    created_at: m.created_at,
  }));

  return NextResponse.json({ members: transformedMembers });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: organizationId } = await params
  const guard = await authGuard(organizationId, { requirePermission: "org:members:remove" })
  if (!guard.success) {
    return guard.response;
  }

  const { id } = await request.json()

  const supabase = await createClient()

  const { data: membership, error: membershipError } = await supabase
    .from("organization_members")
    .select("role:roles (name), user_id")
    .eq("id", id)
    .single()

  if (membershipError) {
    console.log("Failed to fetch membership", membershipError.message)
    return NextResponse.json({ error: "Failed to remove member" }, { status: 500 });
  }
  
  if (membership.role.name === "owner") {
    return NextResponse.json({ error: "Can't remove the owner of an organization" }, { status: 400 })
  }
  
  const user = await getUser();
  if (membership.user_id === user.id) {
    return NextResponse.json({ error: "Can't leave organization from outside settings page" }, { status: 400 })
  }

  const { error } = await supabase
    .from("organization_members")
    .delete()
    .eq("id", id)

  if (error) {
    console.log("Failed to remove member", error.message)
    return NextResponse.json({ error: "Failed to remove member" }, { status: 500 })
  }

  return NextResponse.json({ message: "Done" }, { status: 200 })
}
