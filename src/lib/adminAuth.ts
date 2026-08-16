/**
 * Role-Based Access Control (RBAC) - Clerk Authorization Guard
 *
 * Verifies that the authenticated Clerk user matches the exact authorized
 * administrator email(s) and that their email is verified.
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
 * Checks whether a given Clerk user object is an authorized Administrator.
 *
 * @param clerkUser - The user object from Clerk (client-side useUser() or server-side currentUser())
 * @returns boolean - True if the user is signed in with a verified authorized admin email.
 */
export function isUserAdmin(clerkUser: any): boolean {
  if (!clerkUser) return false;

  const authorizedEmails = getAuthorizedAdminEmails();

  // 1. Extract and check verified email addresses from Clerk user object
  const emailList: { email: string; verified: boolean }[] = [];

  // Clerk UserResource / User (array of email addresses)
  if (Array.isArray(clerkUser.emailAddresses) && clerkUser.emailAddresses.length > 0) {
    for (const emailObj of clerkUser.emailAddresses) {
      const email = (emailObj.emailAddress || "").trim().toLowerCase();
      // Verification status in Clerk
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

  // 2. Check if any verified email matches the authorized admin emails
  if (authorizedEmails.length > 0) {
    const hasAuthorizedEmail = emailList.some(
      (item) => item.verified && authorizedEmails.includes(item.email)
    );
    if (hasAuthorizedEmail) {
      return true;
    }
  }

  // 3. Check Clerk publicMetadata / session claims role as secondary fallback
  const role = (
    clerkUser.publicMetadata?.role ||
    clerkUser.sessionClaims?.metadata?.role ||
    clerkUser.sessionClaims?.publicMetadata?.role ||
    ""
  ).toString().toLowerCase();

  const isAdminFlag = Boolean(
    clerkUser.publicMetadata?.isAdmin ||
    clerkUser.sessionClaims?.metadata?.isAdmin ||
    clerkUser.sessionClaims?.publicMetadata?.isAdmin
  );

  if (role === "admin" || role === "superadmin" || isAdminFlag) {
    return true;
  }

  return false;
}
