import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
]);

const publishableKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  "pk_test_c3RhYmxlLWxlZWNoLTg5LmNsZXJrLmFjY291bnRzLmRldiQ";

const secretKey =
  process.env.CLERK_SECRET_KEY ||
  "sk_test_BwI9MnM94NimhjGMlaBgEb3fqOlEt2pem4bjqgVpgu";

export default clerkMiddleware(
  async (auth, req) => {
    if (isProtectedRoute(req)) {
      await auth.protect();
    }
    return NextResponse.next();
  },
  {
    publishableKey,
    secretKey,
  }
);

export const config = {
  matcher: [
    // Match all routes except static assets & Next internals
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|json|webmanifest|png|jpg|jpeg|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip)).*)",
    "/(api|trpc)(.*)",
  ],
};
