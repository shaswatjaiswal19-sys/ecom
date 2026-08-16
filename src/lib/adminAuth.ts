/**
 * Role-Based Access Control (RBAC) - Clerk Authorization Guard
 *
 * Verifies that the authenticated Clerk user matches the exact authorized
 * administrator email and that their email is verified in Clerk.
 * No other email or user is allowed access.
 */

export function getAuthorizedAdminEmails(): string[] {
  const envAdminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || "shaswatuu2006@gmail.com";
  
  const emails = envAdminEmail
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!emails.includes("shaswatuu2006@gmail.com")) {
    emails.push("shaswatuu2006@gmail.com");
  }

  return emails;
}

/**
 * Checks whether a given Clerk user object is the authorized Administrator.
 *
 * @param clerkUser - The user object from Clerk (client-side useUser() or server-side currentUser())
 * @returns boolean - True ONLY if the user's verified email matches the authorized admin email.
 */
export function isUserAdmin(clerkUser: any): boolean {
  if (!clerkUser) return false;

  const authorizedEmails = getAuthorizedAdminEmails();
  if (authorizedEmails.length === 0) return false;

  // 1. Extract all emails and verification statuses from Clerk user object
  const emailList: { email: string; verified: boolean }[] = [];

  // Clerk UserResource / User (array of email addresses)
  if (Array.isArray(clerkUser.emailAddresses) && clerkUser.emailAddresses.length > 0) {
    for (const emailObj of clerkUser.emailAddresses) {
      const email = (emailObj.emailAddress || "").trim().toLowerCase();
      const isVerified = emailObj.verification ? emailObj.verification.status === "verified" : true;
      if (email) {
        emailList.push({ email, verified: isVerified });
      }
    }
  }

  // Primary Email Object
  if (clerkUser.primaryEmailAddress) {
    const primary = (
      typeof clerkUser.primaryEmailAddress === "string"
        ? clerkUser.primaryEmailAddress
        : clerkUser.primaryEmailAddress.emailAddress || ""
    ).trim().toLowerCase();

    const isVerified = clerkUser.primaryEmailAddress.verification
      ? clerkUser.primaryEmailAddress.verification.status === "verified"
      : true;

    if (primary && !emailList.some((e) => e.email === primary)) {
      emailList.push({ email: primary, verified: isVerified });
    }
  }

  // Direct email property or session claims fallback
  const directEmail = (
    clerkUser.email ||
    clerkUser.emailAddress ||
    clerkUser.primaryEmail ||
    clerkUser.sessionClaims?.email ||
    clerkUser.sessionClaims?.primaryEmail ||
    ""
  ).trim().toLowerCase();

  if (directEmail && !emailList.some((e) => e.email === directEmail)) {
    emailList.push({ email: directEmail, verified: true });
  }

  // 2. Strict Check: User MUST possess a verified email matching the authorized admin email
  const isAuthorizedAdmin = emailList.some(
    (item) => item.verified && authorizedEmails.includes(item.email)
  );

  return isAuthorizedAdmin;
}
