export const ALLOWED_ADMIN_EMAILS = (
  process.env.NEXT_PUBLIC_ADMIN_EMAILS ||
  "admin@manojtraders.com,shaswat@gmail.com,shaswatjaiswal@gmail.com,shaswatjaiswal19@gmail.com,concierge@manojtraders.com"
)
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

/**
 * Checks if a Clerk user or local auth user has administrative access.
 * Evaluates Clerk publicMetadata, organization roles, and authorized email whitelist.
 */
export function isUserAdmin(user: any): boolean {
  if (!user) return false;

  // 1. Check user email addresses in Clerk / local auth
  const emailList: string[] = [];
  
  if (user.primaryEmailAddress?.emailAddress) {
    emailList.push(user.primaryEmailAddress.emailAddress.toLowerCase());
  }
  if (Array.isArray(user.emailAddresses)) {
    user.emailAddresses.forEach((item: any) => {
      const email = typeof item === "string" ? item : item?.emailAddress;
      if (email) emailList.push(email.toLowerCase());
    });
  }
  if (user.email) {
    emailList.push(user.email.toLowerCase());
  }

  const isEmailMatch = emailList.some((email) => ALLOWED_ADMIN_EMAILS.includes(email));
  if (isEmailMatch) return true;

  // 2. Check Clerk publicMetadata role (role: "admin" or role: "superadmin" or isAdmin: true)
  const role = (user.publicMetadata?.role as string)?.toLowerCase();
  const isAdminFlag = Boolean(user.publicMetadata?.isAdmin);
  if (role === "admin" || role === "superadmin" || isAdminFlag) {
    return true;
  }

  // 3. Check Clerk Organization memberships
  if (Array.isArray(user.organizationMemberships)) {
    const isOrgAdmin = user.organizationMemberships.some(
      (m: any) => m.role === "org:admin" || m.role === "admin"
    );
    if (isOrgAdmin) return true;
  }

  return false;
}
