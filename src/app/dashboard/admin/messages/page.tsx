import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { isUserAdmin } from '@/lib/auth';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IconMessage } from '@tabler/icons-react';

export default async function AdminMessagesPage() {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/auth/sign-in');
  }

  const isAdmin = await isUserAdmin();

  if (!isAdmin) {
    return redirect('/dashboard/overview');
  }

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <div className='mb-2 flex items-center gap-2'>
              <IconMessage className='h-6 w-6 text-purple-600' />
              <Badge variant='secondary' className='text-purple-600'>
                Admin Only
              </Badge>
            </div>
            <h1 className='text-3xl font-bold tracking-tight'>Messages</h1>
            <p className='text-muted-foreground'>
              Manage internal communications and client messages
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Message Center</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground'>
              Message management system coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
