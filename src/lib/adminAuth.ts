/**
 * Centralized Admin Authorization Service
 * Single source of truth for admin verification across Manoj Traders.
 * Fail-closed security: Defaults to false in all unauthenticated/ambiguous states.
 */

// Fallback authorized admin emails if no environment variable is set
const DEFAULT_ADMIN_EMAILS = [
  "admin@manojtraders.com",
  "shaswat@gmail.com",
  "shaswatjaiswal@gmail.com",
  "concierge@manojtraders.com",
];

/**
 * Returns the normalized set of authorized admin email addresses.
 */
export function getAuthorizedAdminEmails(): Set<string> {
  const envEmails =
    process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
    process.env.NEXT_PUBLIC_ADMIN_EMAILS ||
    process.env.ADMIN_EMAIL ||
    process.env.ADMIN_EMAILS;

  if (envEmails && typeof envEmails === "string") {
    const parsed = envEmails
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    if (parsed.length > 0) {
      return new Set(parsed);
    }
  }

  return new Set(DEFAULT_ADMIN_EMAILS.map((e) => e.toLowerCase()));
}

/**
 * Checks if a specific email address matches the authorized admin accounts.
 * Exact match only (case-insensitive and trimmed).
 * Fail-closed: returns false if email is null, undefined, or empty.
 */
export function isAuthorizedAdminEmail(email?: string | null): boolean {
  if (!email || typeof email !== "string") return false;
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) return false;

  const adminEmails = getAuthorizedAdminEmails();
  return adminEmails.has(cleanEmail);
}

/**
 * Verifies if a Clerk user instance possesses authorized admin status.
 * Checks the user's verified primary email and all associated emails.
 * Fail-closed: returns false if user is null, undefined, or has no matching email.
 */
export function isClerkUserAdmin(user: any): boolean {
  if (!user) return false;

  // 1. Check primary email address
  const primaryEmail =
    user.primaryEmailAddress?.emailAddress ||
    user.primaryEmailAddress ||
    user.email;
  if (isAuthorizedAdminEmail(primaryEmail)) {
    return true;
  }

  // 2. Check all email addresses attached to this Clerk user
  if (Array.isArray(user.emailAddresses)) {
    for (const entry of user.emailAddresses) {
      const email = typeof entry === "string" ? entry : entry?.emailAddress;
      if (isAuthorizedAdminEmail(email)) {
        return true;
      }
    }
  }

  return false;
}
