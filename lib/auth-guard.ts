import { NextRequest, NextResponse } from 'next/server';
import { User } from '@supabase/supabase-js';
import { getUser, getOrganizationContext, getUserRole, verifyOrganizationAccess } from '.';
import { hasPermission, Permission } from './permissions';

export interface AuthGuardOptions {
  requirePermission?: Permission | Permission[];
  allowMultiplePermissions?: boolean; // If true, user needs ANY permission; if false, needs ALL
}

/**
 * Server-side auth guard for API routes
 * Returns the authenticated user and organization context, or an error response
 */
export async function authGuard(
  organizationId: number,
  options: AuthGuardOptions = {}
): Promise<
  | {
      success: true;
      user: User;
      organizationId: number;
      role: string;
    }
  | { success: false; response: NextResponse }
> {
  const {
    requirePermission,
    allowMultiplePermissions = true,
  } = options;

  // Check authentication
  const user = await getUser();

  // Verify user has access to this organization
  const hasAccess = await verifyOrganizationAccess(user.id, organizationId);
  if (!hasAccess) {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Forbidden. You do not have access to this organization.' },
        { status: 403 }
      ),
    };
  }

  // Check permissions
  console.log("requirePermission", requirePermission)
  if (requirePermission) {
    const role = await getUserRole(user.id, organizationId);
    console.log("role", role)
    if (!role) {
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Unable to determine your role in this organization.' },
          { status: 403 }
        ),
      };
    }

    const permissions = Array.isArray(requirePermission)
      ? requirePermission
      : [requirePermission];

    const hasRequiredPermission = allowMultiplePermissions
      ? permissions.some((perm) => hasPermission(role as any, perm))
      : permissions.every((perm) => hasPermission(role as any, perm));

    if (!hasRequiredPermission) {
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Forbidden. You do not have the required permissions.' },
          { status: 403 }
        ),
      };
    }
  }

  return {
    success: true,
    user,
    organizationId,
    role: (await getUserRole(user.id, organizationId)) || '',
  };
}
