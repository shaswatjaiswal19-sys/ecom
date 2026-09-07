import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

const publishableKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  "pk_test_c3RhYmxlLWxlZWNoLTg5LmNsZXJrLmFjY291bnRzLmRldiQ";

const secretKey =
  process.env.CLERK_SECRET_KEY ||
  "sk_test_BwI9MnM94NimhjGMlaBgEb3fqOlEt2pem4bjqgVpgu";

const isProtectedRoute = createRouteMatcher([
  "/account(.*)",
  "/admin(.*)",
]);

let clerkHandler: any = null;
try {
  clerkHandler = clerkMiddleware(
    async (auth, req) => {
      if (isProtectedRoute(req)) {
        // Session checks via Clerk
      }
    },
    {
      publishableKey,
      secretKey,
    }
  );
} catch (err) {
  console.warn("Failed to initialize clerkMiddleware:", err);
}

export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  if (clerkHandler) {
    try {
      return await clerkHandler(req, event);
    } catch (err) {
      console.warn("Clerk middleware runtime error, continuing:", err);
      return NextResponse.next();
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|json|webmanifest|png|jpg|jpeg|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
