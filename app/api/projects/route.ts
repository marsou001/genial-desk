import { NextRequest, NextResponse } from 'next/server';
import { authGuard } from '@/lib/auth-guard';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/projects
 * List all projects in the current organization
 */
export async function GET(request: NextRequest) {
  const guard = await authGuard(request, {
    requireAuth: true,
    requireOrg: true,
    requirePermission: 'project:read',
  });

  if (!guard.success) {
    return guard.response;
  }

  try {
    const supabase = await createClient();

    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('organization_id', guard.organizationId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ projects: projects || [] });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects
 * Create a new project
 */
export async function POST(request: NextRequest) {
  const guard = await authGuard(request, {
    requireAuth: true,
    requireOrg: true,
    requirePermission: 'project:create',
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

    const supabase = await createClient();

    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        name,
        organization_id: guard.organizationId,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
