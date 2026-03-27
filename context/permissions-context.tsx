"use client";

import React, { createContext, useContext } from "react";
import { UserRole } from "@/types";
import { hasPermission, Permission } from "@/lib/permissions";

type PermissionsContextType = {
  role: UserRole;
};

const PermissionsContext = createContext<PermissionsContextType>({
  role: "viewer",
});

export function PermissionsProvider({
  value,
  children,
}: {
  value: PermissionsContextType;
  children: React.ReactNode;
}) {
  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions(permission: Permission) {
  const { role } = useContext(PermissionsContext);
  return hasPermission(role, permission);
}
