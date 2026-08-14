import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isUserAdmin } from "./adminAuth";

/**
 * Server-Side Admin Authorization Guard for API Routes & Server Actions.
 *
 * Verifies:
 * 1. User has a valid active Clerk session token (returns 401 if unauthenticated)
 * 2. User has explicit admin role/metadata or is on the authorized admin allowlist (returns 403 if unauthorized)
 */
export async function requireServerAdmin(): Promise<{
  authorized: boolean;
  response?: NextResponse;
  userId?: string;
  user?: any;
}> {
  try {
    const authSession = await auth();

    if (!authSession || !authSession.userId) {
      return {
        authorized: false,
        response: NextResponse.json(
          {
            success: false,
            code: "UNAUTHENTICATED",
            error: "Authentication required. Please sign in to access this admin endpoint.",
          },
          { status: 401 }
        ),
      };
    }

    // Retrieve user profile and metadata from Clerk Server API
    let user: any = null;
    try {
      user = await currentUser();
    } catch {
      // Fallback to session claims if currentUser fails
      user = authSession.sessionClaims;
    }

    const isAdmin = isUserAdmin(user) || 
      (authSession.sessionClaims?.metadata as any)?.role === "admin" ||
      (authSession.sessionClaims?.publicMetadata as any)?.role === "admin" ||
      (authSession.sessionClaims?.publicMetadata as any)?.isAdmin === true;

    if (!isAdmin) {
      return {
        authorized: false,
        response: NextResponse.json(
          {
            success: false,
            code: "FORBIDDEN",
            error: "Access Denied: You do not have administrator permissions in Clerk.",
          },
          { status: 403 }
        ),
      };
    }

    return {
      authorized: true,
      userId: authSession.userId,
      user,
    };
  } catch (error: any) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          success: false,
          code: "AUTH_ERROR",
          error: error?.message || "Internal authorization verification failed.",
        },
        { status: 500 }
      ),
    };
  }
}
