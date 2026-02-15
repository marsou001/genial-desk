import { UserRole } from '@/types';

export type Permission =
  | 'org:read'
  | 'org:update'
  | 'org:delete'
  | 'org:billing'
  | 'org:members:read'
  | 'org:members:invite'
  | 'org:members:update'
  | 'org:members:remove'
  | 'project:create'
  | 'project:read'
  | 'project:update'
  | 'project:delete'
  | 'data:read'
  | 'data:create'
  | 'data:update'
  | 'data:delete'
  | 'data:export'
  | 'insights:read'
  | 'insights:create'
  | 'reports:read'
  | 'reports:create'
  | 'reports:update'
  | 'reports:delete';

/**
 * Role-based permission matrix
 */
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  owner: [
    // Organization
    'org:read',
    'org:update',
    'org:delete',
    'org:billing',
    'org:members:read',
    'org:members:invite',
    'org:members:update',
    'org:members:remove',
    // Projects
    'project:create',
    'project:read',
    'project:update',
    'project:delete',
    // Data
    'data:read',
    'data:create',
    'data:update',
    'data:delete',
    'data:export',
    // Insights & Reports
    'insights:read',
    'insights:create',
    'reports:read',
    'reports:create',
    'reports:update',
    'reports:delete',
  ],
  admin: [
    // Organization (limited)
    'org:read',
    'org:update',
    'org:members:read',
    'org:members:invite',
    'org:members:update',
    'org:members:remove',
    // Projects
    'project:create',
    'project:read',
    'project:update',
    'project:delete',
    // Data
    'data:read',
    'data:create',
    'data:update',
    'data:delete',
    'data:export',
    // Insights & Reports
    'insights:read',
    'insights:create',
    'reports:read',
    'reports:create',
    'reports:update',
    'reports:delete',
  ],
  analyst: [
    // Organization (read-only)
    'org:read',
    'org:members:read',
    // Projects (read-only)
    'project:read',
    // Data (full access)
    'data:read',
    'data:create',
    'data:update',
    'data:delete',
    'data:export',
    // Insights & Reports
    'insights:read',
    'insights:create',
    'reports:read',
    'reports:create',
    'reports:update',
    'reports:delete',
  ],
  viewer: [
    // Organization (read-only)
    'org:read',
    'org:members:read',
    // Projects (read-only)
    'project:read',
    // Data (read-only)
    'data:read',
    // Insights (read-only)
    'insights:read',
    'reports:read',
  ],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Check if a role has any of the specified permissions
 */
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some((perm) => hasPermission(role, perm));
}

/**
 * Check if a role has all of the specified permissions
 */
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every((perm) => hasPermission(role, perm));
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Check if user can manage members (invite, update, remove)
 * Admins can manage non-owners, Owners can manage everyone
 */
export function canManageMember(
  userRole: UserRole,
  targetRole: UserRole
): boolean {
  if (userRole === 'owner') return true;
  if (userRole === 'admin' && targetRole !== 'owner') return true;
  return false;
}

/**
 * Check if user can delete organization
 */
export function canDeleteOrganization(role: UserRole): boolean {
  return role === 'owner';
}

/**
 * Check if user can manage billing
 */
export function canManageBilling(role: UserRole): boolean {
  return role === 'owner';
}

/**
 * Check if user can export data
 */
export function canExportData(role: UserRole): boolean {
  return hasPermission(role, 'data:export');
}

/**
 * Check if user can create/edit reports
 */
export function canManageReports(role: UserRole): boolean {
  return hasAnyPermission(role, ['reports:create', 'reports:update', 'reports:delete']);
}
