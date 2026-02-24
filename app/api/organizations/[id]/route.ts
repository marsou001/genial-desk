import { NextRequest, NextResponse } from 'next/server';
import { authGuard } from '@/lib/auth-guard';
import { createClient } from '@/lib/supabase/server';
import { hasPermission } from '@/lib/permissions';

/**
 * GET /api/organizations/[id]
 * Get organization details
 */
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const guard = await authGuard(id);

  if (!guard.success) {
    return guard.response;
  }

  // Verify user has access to this organization
  const supabase = await createClient();
  const { data: membership, error } = await supabase
    .from('organization_members')
    .select(`
      role,
      organizations!inner (
        id,
        name,
        created_at
      )
    `)
    .eq('user_id', guard.user.id)
    .eq('organization_id', id)
    .single();

  if (error || !membership) {
    return NextResponse.json(
      { error: 'Organization not found or access denied' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    organization: {
      ...membership.organizations,
      role: membership.role,
    },
  });
}

/**
 * PATCH /api/organizations/[id]
 * Update organization (requires org:update permission)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const guard = await authGuard(id, {
    requirePermission: 'org:update',
  });

  if (!guard.success) {
    return guard.response;
  }

  // Verify user has access and permission
  const supabase = await createClient();
  const { data: membership, error: membershipError } = await supabase
    .from('organization_members')
    .select('role')
    .eq('user_id', guard.user.id)
    .eq('organization_id', id)
    .single();

  if (membershipError || !membership) {
    return NextResponse.json(
      { error: 'Organization not found or access denied' },
      { status: 404 }
    );
  }

  if (!hasPermission(membership.role as any, 'org:update')) {
    return NextResponse.json(
      { error: 'Insufficient permissions' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const name = (body?.name as string)?.trim();

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: 'Organization name must be at least 2 characters' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('organizations')
      .update({ name })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, organization: data });
  } catch (error) {
    console.error('Error updating organization:', error);
    return NextResponse.json(
      { error: 'Failed to update organization' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/organizations/[id]
 * Delete organization (requires owner role)
 */
export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const guard = await authGuard(id, {
    requirePermission: 'org:delete',
  });

  if (!guard.success) {
    return guard.response;
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('organizations')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
