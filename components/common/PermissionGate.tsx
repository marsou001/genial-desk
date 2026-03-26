'use client';

import { ReactNode } from 'react';
import { Permission } from '@/lib/permissions';
import { usePermissions } from '@/context/permissions-context';

interface PermissionGateProps {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Client-side permission gate component
 * Only renders children if user has the required permission(s)
 */
export default function PermissionGate({
  permission,
  children,
  fallback = null,
}: PermissionGateProps) {
  const hasAccess = usePermissions(permission);
  return hasAccess ? <>{children}</> : <>{fallback}</>
}
