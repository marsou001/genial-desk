'use client';

import { ReactNode } from 'react';
import { hasPermission, Permission } from '@/lib/permissions';

interface PermissionGateProps {
  role: string;
  permission: Permission | Permission[];
  requireAll?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Client-side permission gate component
 * Only renders children if user has the required permission(s)
 */
export default function PermissionGate({
  role,
  permission,
  requireAll = false,
  fallback = null,
  children,
}: PermissionGateProps) {
  const permissions = Array.isArray(permission) ? permission : [permission];
  
  const hasAccess = requireAll
    ? permissions.every((perm) => hasPermission(role as any, perm))
    : permissions.some((perm) => hasPermission(role as any, perm));

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
