import { NextRequest, NextResponse } from 'next/server';
import { User } from '@supabase/supabase-js';
import { getUser, getOrganizationContext, getProjectContext, getUserRole, verifyOrganizationAccess } from '.';
import { hasPermission, Permission } from './permissions';

export interface AuthGuardOptions {
  requireAuth?: boolean;
  requireOrg?: boolean;
  requirePermission?: Permission | Permission[];
  allowMultiplePermissions?: boolean; // If true, user needs ANY permission; if false, needs ALL
}

/**
 * Server-side auth guard for API routes
 * Returns the authenticated user and organization context, or an error response
 */
export async function authGuard(
  request: NextRequest,
  options: AuthGuardOptions = {}
): Promise<
  | {
      success: true;
      user: User;
      organizationId: string;
      projectId: string | null;
      role: string;
    }
  | { success: false; response: NextResponse }
> {
  const {
    requireAuth = true,
    requireOrg = true,
    requirePermission,
    allowMultiplePermissions = true,
  } = options;

  // Check authentication
  if (requireAuth) {
    const user = await getUser();

    // Check organization access
    if (requireOrg) {
      const organizationId = await getOrganizationContext(request);
      if (!organizationId) {
        return {
          success: false,
          response: NextResponse.json(
            { error: 'Organization context required. Please select an organization.' },
            { status: 400 }
          ),
        };
      }

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
      if (requirePermission) {
        const role = await getUserRole(user.id, organizationId);
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

      const projectId = await getProjectContext(request);

      return {
        success: true,
        user,
        organizationId,
        projectId,
        role: (await getUserRole(user.id, organizationId)) || '',
      };
    }

    return {
      success: true,
      user,
      organizationId: '',
      projectId: null,
      role: '',
    };
  }

  // No auth required
  return {
    success: false,
    response: NextResponse.json({ error: 'Auth guard misconfigured' }, { status: 500 }),
  };
}
