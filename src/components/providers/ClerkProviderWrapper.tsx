"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";

const publishableKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  "pk_test_c3RhYmxlLWxlZWNoLTg5LmNsZXJrLmFjY291bnRzLmRldiQ";

export default function ClerkProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={publishableKey}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/"
      afterSignUpUrl="/"
    >
      {children}
    </ClerkProvider>
  );
}
