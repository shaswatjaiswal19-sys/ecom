/**
 * Role-Based Access Control (RBAC) - Clerk Authorization Guard
 *
 * A user is ONLY recognized as an Administrator if:
 * 1. Their Clerk Public Metadata has { "role": "admin" } or { "isAdmin": true } (assigned in Clerk Dashboard)
 * 2. OR their Clerk Organization membership has role "org:admin"
 * 3. OR their email is explicitly listed in NEXT_PUBLIC_ADMIN_EMAILS environment variable
 *
 * Normal users with no Clerk admin role will ALWAYS return false.
 */
export function isUserAdmin(clerkUser: any): boolean {
  if (!clerkUser) return false;

  // 1. Check Clerk publicMetadata (Assigned by Administrator in Clerk Dashboard)
  const role = (clerkUser.publicMetadata?.role as string)?.toLowerCase();
  const isAdminFlag = Boolean(clerkUser.publicMetadata?.isAdmin);
  if (role === "admin" || role === "superadmin" || isAdminFlag) {
    return true;
  }

  // 2. Check Clerk Organization memberships
  if (Array.isArray(clerkUser.organizationMemberships)) {
    const isOrgAdmin = clerkUser.organizationMemberships.some(
      (m: any) => m.role === "org:admin" || m.role === "admin"
    );
    if (isOrgAdmin) return true;
  }

  // 3. Optional: Check explicit NEXT_PUBLIC_ADMIN_EMAILS if configured in environment
  const configuredAdminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter((e) => Boolean(e) && !e.includes("manojtraders.com")); // Ignore mock placeholders

  if (configuredAdminEmails.length > 0) {
    const userEmails: string[] = [];
    if (clerkUser.primaryEmailAddress?.emailAddress) {
      userEmails.push(clerkUser.primaryEmailAddress.emailAddress.toLowerCase());
    }
    if (Array.isArray(clerkUser.emailAddresses)) {
      clerkUser.emailAddresses.forEach((item: any) => {
        const email = typeof item === "string" ? item : item?.emailAddress;
        if (email) userEmails.push(email.toLowerCase());
      });
    }
    if (userEmails.some((e) => configuredAdminEmails.includes(e))) {
      return true;
    }
  }

  return false;
}
