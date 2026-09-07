import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/account(.*)",
  "/admin(.*)",
]);

const hasValidClerkKey = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith("pk_") &&
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("YOUR_CLERK")
);

export default clerkMiddleware(async (auth, req) => {
  if (!hasValidClerkKey) {
    return NextResponse.next();
  }

  if (isProtectedRoute(req)) {
    // Session checks via Clerk
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|json|webmanifest|png|jpg|jpeg|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
