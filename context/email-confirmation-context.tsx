"use client";

import React, { createContext, useContext } from "react";

const EmailConfirmationContext = createContext(false);

export function EmailConfirmationProvider({
  value,
  children,
}: {
  value: boolean;
  children: React.ReactNode;
}) {
  return (
    <EmailConfirmationContext.Provider value={value}>
      {children}
    </EmailConfirmationContext.Provider>
  );
}

export function useIsEmailConfirmed() {
  const isConfirmed = useContext(EmailConfirmationContext);
  return isConfirmed;
}
