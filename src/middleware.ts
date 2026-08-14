import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher([
  "/admin(.*)",
]);

export default clerkMiddleware(
  async (auth, req) => {
    if (isAdminRoute(req)) {
      const authSession = await auth();

      // If not signed in at all, redirect to Clerk sign-in
      if (!authSession.userId) {
        return authSession.redirectToSignIn({ returnBackUrl: req.url });
      }
    }
    return NextResponse.next();
  }
);

export const config = {
  matcher: [
    // Match all routes except static assets & Next internals
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|json|webmanifest|png|jpg|jpeg|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip)).*)",
    "/(api|trpc)(.*)",
  ],
};
