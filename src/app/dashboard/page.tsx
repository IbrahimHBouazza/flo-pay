import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { isUserAdmin } from '@/lib/auth';

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/auth/sign-in');
  }

  // Check if user is admin using the new auth utility
  const isAdmin = await isUserAdmin();

  if (isAdmin) {
    // For admin users, show the admin dashboard as their main dashboard
    redirect('/dashboard/admin');
  } else {
    // For regular users, show the regular overview dashboard
    redirect('/dashboard/overview');
  }
}
