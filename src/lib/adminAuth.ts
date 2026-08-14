/**
 * Role-Based Access Control (RBAC) - Clerk Authorization Guard
 *
 * A user is ONLY recognized as an Administrator if:
 * You have explicitly set in Clerk Dashboard -> Users -> Public Metadata:
 * { "role": "admin" } or { "isAdmin": true }
 *
 * All normal users, guests, and unregistered users ALWAYS return false.
 */
export function isUserAdmin(clerkUser: any): boolean {
  if (!clerkUser) return false;

  // 1. Check Clerk publicMetadata role (Set manually in Clerk Dashboard)
  const role = (clerkUser.publicMetadata?.role as string)?.toLowerCase();
  const isAdminFlag = Boolean(clerkUser.publicMetadata?.isAdmin);
  
  if (role === "admin" || role === "superadmin" || isAdminFlag === true) {
    return true;
  }

  // 2. Check Clerk Organization memberships (if using Clerk Organizations)
  if (Array.isArray(clerkUser.organizationMemberships) && clerkUser.organizationMemberships.length > 0) {
    const isOrgAdmin = clerkUser.organizationMemberships.some(
      (m: any) => m.role === "org:admin" || m.role === "admin"
    );
    if (isOrgAdmin) return true;
  }

  // 3. Check session claims metadata (for Server-side validation)
  const sessionRole = (clerkUser.metadata?.role as string)?.toLowerCase();
  if (sessionRole === "admin" || sessionRole === "superadmin") {
    return true;
  }

  return false;
}
