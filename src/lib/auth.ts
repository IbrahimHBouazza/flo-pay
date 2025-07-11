import { currentUser } from '@clerk/nextjs/server';

export interface UserRole {
  role: 'admin' | 'user' | 'manager';
  permissions?: string[];
}

/**
 * Check if the current user is an admin
 * Supports multiple admin detection methods:
 * 1. Clerk public metadata (role: 'admin')
 * 2. Environment variable whitelist
 * 3. Database roles (if implemented)
 */
export async function isUserAdmin(): Promise<boolean> {
  const user = await currentUser();

  if (!user) {
    return false;
  }

  // Method 1: Check Clerk public metadata
  const metadataRole = user.publicMetadata?.role as string;
  if (metadataRole === 'admin') {
    return true;
  }

  // Method 2: Check environment variable whitelist
  const adminEmails =
    process.env.ADMIN_EMAILS?.split(',').map((email) => email.trim()) || [];
  const userEmail = user.emailAddresses?.[0]?.emailAddress;
  if (userEmail && adminEmails.includes(userEmail)) {
    return true;
  }

  // Method 3: Check if email contains 'admin' (for development)
  if (process.env.NODE_ENV === 'development' && userEmail?.includes('admin')) {
    return true;
  }

  // Method 4: Database check (implement if you have a database)
  // const dbIsAdmin = await checkDatabaseAdminRole(user.id);
  // if (dbIsAdmin) return true;

  return false;
}

/**
 * Get user role and permissions
 */
export async function getUserRole(): Promise<UserRole | null> {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  // Check Clerk metadata first
  const metadataRole = user.publicMetadata?.role as string;
  if (metadataRole) {
    return {
      role: metadataRole as 'admin' | 'user' | 'manager',
      permissions: user.publicMetadata?.permissions as string[]
    };
  }

  // Fallback to email-based detection
  if (await isUserAdmin()) {
    return { role: 'admin' };
  }

  return { role: 'user' };
}

/**
 * Check if user has specific permission
 */
export async function hasPermission(permission: string): Promise<boolean> {
  const userRole = await getUserRole();

  if (!userRole) {
    return false;
  }

  // Admins have all permissions
  if (userRole.role === 'admin') {
    return true;
  }

  // Check specific permissions
  return userRole.permissions?.includes(permission) || false;
}

/**
 * Set user role in Clerk metadata
 * This should be called from an admin-only endpoint
 */
export async function setUserRole(
  userId: string,
  role: string,
  permissions?: string[]
) {
  // This would typically be done through Clerk's API
  // You'd need to implement this based on your setup
  console.log(`Setting role ${role} for user ${userId}`);

  // Example implementation:
  // await clerkClient.users.updateUser(userId, {
  //   publicMetadata: { role, permissions }
  // });
}
