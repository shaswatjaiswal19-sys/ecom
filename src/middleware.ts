import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
]);

const publishableKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  "pk_test_bWFub2otdHJhZGVycy0wMS5jbGVyay5hY2NvdW50cy5kZXYk";

const secretKey =
  process.env.CLERK_SECRET_KEY ||
  "sk_test_manojtraders_secret_key_example";

export default clerkMiddleware(
  async (auth, req) => {
    if (isProtectedRoute(req)) {
      // Admin protection
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
