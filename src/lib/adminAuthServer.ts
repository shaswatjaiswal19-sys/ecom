import { currentUser, auth } from "@clerk/nextjs/server";
import { isClerkUserAdmin, isAuthorizedAdminEmail } from "./adminAuth";
import { NextResponse } from "next/server";

export interface AdminAuthResult {
  authorized: boolean;
  status?: number;
  error?: string;
  email?: string;
  user?: any;
}

/**
 * Server-side Route Handler Admin Verification
 * Verifies that incoming HTTP requests originate from an authenticated Clerk user
 * whose verified email address matches the authorized admin configuration.
 */
export async function verifyAdminApi(): Promise<AdminAuthResult> {
  try {
    const user = await currentUser();

    if (!user) {
      return {
        authorized: false,
        status: 401,
        error: "Unauthorized: Please sign in with an authorized admin account.",
      };
    }

    if (!isClerkUserAdmin(user)) {
      const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress;
      return {
        authorized: false,
        status: 403,
        error: `Forbidden: Account (${email || "unknown"}) is not authorized to access this administrative resource.`,
      };
    }

    const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress;
    return {
      authorized: true,
      user,
      email,
    };
  } catch (error: any) {
    console.error("Admin API verification failed:", error);
    return {
      authorized: false,
      status: 401,
      error: "Authentication verification failed.",
    };
  }
}

/**
 * Helper to return an immediate JSON error response if admin check fails
 */
export function unauthorizedResponse(result: AdminAuthResult): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: result.error || "Access Denied: Administrator authorization required.",
    },
    { status: result.status || 403 }
  );
}
