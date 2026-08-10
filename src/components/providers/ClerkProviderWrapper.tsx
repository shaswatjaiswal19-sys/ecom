"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isValidKey = Boolean(
  publishableKey &&
    publishableKey.startsWith("pk_") &&
    !publishableKey.includes("YOUR_CLERK_PUBLISHABLE_KEY")
);

export default function ClerkProviderWrapper({ children }: { children: ReactNode }) {
  if (!isValidKey) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      {children}
    </ClerkProvider>
  );
}
