import { NextRequest, NextResponse } from 'next/server';
import { authGuard } from '@/lib/auth-guard';
import { createServerClient } from '@/lib/supabase';
import { hasPermission, canManageMember } from '@/lib/permissions';

/**
 * GET /api/organizations/[id]/members
 * List all members of an organization
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const guard = await authGuard(request, {
    requireAuth: true,
    requireOrg: false,
    requirePermission: 'org:members:read',
  });

  if (!guard.success) {
    return guard.response;
  }

  // Verify user has access to this organization
  const supabase = createServerClient();
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
      project_id,
      created_at,
      auth.users!inner (
        email
      ),
      projects (
        name
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
    project_id: m.project_id,
    project_name: m.projects?.name || null,
    created_at: m.created_at,
  }));

  return NextResponse.json({ members: transformedMembers });
}

/**
 * POST /api/organizations/[id]/members
 * Invite a member to the organization
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const guard = await authGuard(request, {
    requireAuth: true,
    requireOrg: false,
    requirePermission: 'org:members:invite',
  });

  if (!guard.success) {
    return guard.response;
  }

  // Verify user has access and permission
  const supabase = createServerClient();
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

  try {
    const body = await request.json();
    const userId = body?.user_id as string;
    const role = (body?.role as string) || 'viewer';
    const projectId = body?.project_id as string | null;

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    const validRoles = ['owner', 'admin', 'analyst', 'viewer'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Check if user can manage this role
    if (!canManageMember(userMembership.role as any, role as any)) {
      return NextResponse.json(
        { error: 'You cannot invite members with this role' },
        { status: 403 }
      );
    }

    // Check if user already exists
    const { data: existing } = await supabase
      .from('organization_members')
      .select('id')
      .eq('user_id', userId)
      .eq('organization_id', id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'User is already a member of this organization' },
        { status: 400 }
      );
    }

    // Add member
    const { data, error } = await supabase
      .from('organization_members')
      .insert({
        user_id: userId,
        organization_id: id,
        role,
        project_id: projectId,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, member: data });
  } catch (error) {
    console.error('Error inviting member:', error);
    return NextResponse.json(
      { error: 'Failed to invite member' },
      { status: 500 }
    );
  }
}
