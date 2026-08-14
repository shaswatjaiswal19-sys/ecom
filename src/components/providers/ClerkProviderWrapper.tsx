"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";

export default function ClerkProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
    >
      {children}
    </ClerkProvider>
  );
}
