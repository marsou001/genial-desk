import { NextRequest, NextResponse } from 'next/server';
import { authGuard } from '@/lib/auth-guard';
import { createClient } from '@/lib/supabase/server';
import { hasPermission } from '@/lib/permissions';

/**
 * GET /api/organizations
 * List all organizations the user belongs to
 */
export async function GET(request: NextRequest) {
  const guard = await authGuard(request, { requireAuth: true, requireOrg: false });
  
  if (!guard.success) {
    return guard.response;
  }

  try {
    const supabase = await createClient();
    
    const { data: memberships, error } = await supabase
      .from('organization_members')
      .select(`
        organization_id,
        role,
        organizations!inner (
          id,
          name,
          created_at
        )
      `)
      .eq('user_id', guard.user.id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const organizations = (memberships || []).map((m: any) => ({
      id: m.organization_id,
      name: m.organizations.name,
      role: m.role,
      created_at: m.organizations.created_at,
    }));

    return NextResponse.json({ organizations });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch organizations' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/organizations
 * Create a new organization (user becomes Owner)
 */
export async function POST(request: NextRequest) {
  const guard = await authGuard(request, { requireAuth: true, requireOrg: false });
  
  if (!guard.success) {
    return guard.response;
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

    const supabase = await createClient();

    // Create organization
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .insert({ name })
      .select()
      .single();

    if (orgError) {
      return NextResponse.json(
        { error: orgError.message },
        { status: 500 }
      );
    }

    // Add creator as Owner
    const { error: memberError } = await supabase
      .from('organization_members')
      .insert({
        user_id: guard.user.id,
        organization_id: organization.id,
        role: 'owner',
      });

    if (memberError) {
      // Rollback organization creation
      await supabase.from('organizations').delete().eq('id', organization.id);
      return NextResponse.json(
        { error: memberError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      organization: {
        ...organization,
        role: 'owner',
      },
    });
  } catch (error) {
    console.error('Error creating organization:', error);
    return NextResponse.json(
      { error: 'Failed to create organization' },
      { status: 500 }
    );
  }
}
