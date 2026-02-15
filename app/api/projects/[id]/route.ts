import { NextRequest, NextResponse } from 'next/server';
import { authGuard } from '@/lib/auth-guard';
import { createServerClient } from '@/lib/supabase';

/**
 * GET /api/projects/[id]
 * Get project details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const guard = await authGuard(request, {
    requireAuth: true,
    requireOrg: true,
    requirePermission: 'project:read',
  });

  if (!guard.success) {
    return guard.response;
  }

  const supabase = createServerClient();
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('organization_id', guard.organizationId)
    .single();

  if (error || !project) {
    return NextResponse.json(
      { error: 'Project not found or access denied' },
      { status: 404 }
    );
  }

  return NextResponse.json({ project });
}

/**
 * PATCH /api/projects/[id]
 * Update project
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const guard = await authGuard(request, {
    requireAuth: true,
    requireOrg: true,
    requirePermission: 'project:update',
  });

  if (!guard.success) {
    return guard.response;
  }

  try {
    const body = await request.json();
    const name = (body?.name as string)?.trim();

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: 'Project name must be at least 2 characters' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    const { data: project, error } = await supabase
      .from('projects')
      .update({ name })
      .eq('id', id)
      .eq('organization_id', guard.organizationId)
      .select()
      .single();

    if (error || !project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/projects/[id]
 * Delete project
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const guard = await authGuard(request, {
    requireAuth: true,
    requireOrg: true,
    requirePermission: 'project:delete',
  });

  if (!guard.success) {
    return guard.response;
  }

  const supabase = createServerClient();
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('organization_id', guard.organizationId);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
