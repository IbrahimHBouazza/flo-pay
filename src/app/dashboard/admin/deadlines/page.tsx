import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { isUserAdmin } from '@/lib/auth';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  IconCalendar,
  IconSearch,
  IconClock,
  IconAlertTriangle,
  IconCheck,
  IconPlus,
  IconBuilding,
  IconUser,
  IconFilter,
  IconSortAscending
} from '@tabler/icons-react';
import Link from 'next/link';

export default async function AdminDeadlinesPage() {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/auth/sign-in');
  }

  const isAdmin = await isUserAdmin();

  if (!isAdmin) {
    return redirect('/dashboard/overview');
  }

  // Mock clients data with deadline counts - in a real app, this would come from the database
  const clients = [
    {
      id: '1',
      name: 'Acme Corporation',
      email: 'contact@acme.com',
      status: 'active',
      avatar: 'AC',
      totalDeadlines: 5,
      overdueDeadlines: 1,
      upcomingDeadlines: 3,
      completedDeadlines: 1,
      nextDeadline: '2024-01-20T10:00:00Z',
      nextDeadlineTitle: 'Tax Filing Deadline'
    },
    {
      id: '2',
      name: 'TechStart Inc',
      email: 'hello@techstart.com',
      status: 'active',
      avatar: 'TI',
      totalDeadlines: 3,
      overdueDeadlines: 0,
      upcomingDeadlines: 2,
      completedDeadlines: 1,
      nextDeadline: '2024-01-18T14:30:00Z',
      nextDeadlineTitle: 'Contract Review'
    },
    {
      id: '3',
      name: 'Global Solutions',
      email: 'info@globalsolutions.com',
      status: 'active',
      avatar: 'GS',
      totalDeadlines: 7,
      overdueDeadlines: 2,
      upcomingDeadlines: 4,
      completedDeadlines: 1,
      nextDeadline: '2024-01-16T09:00:00Z',
      nextDeadlineTitle: 'Financial Report Submission'
    },
    {
      id: '4',
      name: 'StartupXYZ',
      email: 'team@startupxyz.com',
      status: 'pending',
      avatar: 'SX',
      totalDeadlines: 2,
      overdueDeadlines: 0,
      upcomingDeadlines: 2,
      completedDeadlines: 0,
      nextDeadline: '2024-01-25T16:00:00Z',
      nextDeadlineTitle: 'Onboarding Completion'
    },
    {
      id: '5',
      name: 'MegaCorp',
      email: 'admin@megacorp.com',
      status: 'active',
      avatar: 'MC',
      totalDeadlines: 4,
      overdueDeadlines: 0,
      upcomingDeadlines: 1,
      completedDeadlines: 3,
      nextDeadline: '2024-01-30T11:00:00Z',
      nextDeadlineTitle: 'Annual Review'
    },
    {
      id: '6',
      name: 'SmallBiz Ltd',
      email: 'contact@smallbiz.com',
      status: 'inactive',
      avatar: 'SB',
      totalDeadlines: 1,
      overdueDeadlines: 0,
      upcomingDeadlines: 0,
      completedDeadlines: 1,
      nextDeadline: null,
      nextDeadlineTitle: null
    }
  ];

  const getClientStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      pending: 'secondary',
      inactive: 'outline'
    } as const;

    return (
      <Badge
        variant={variants[status as keyof typeof variants] || 'outline'}
        className='text-xs'
      >
        {status}
      </Badge>
    );
  };

  const getDeadlinePriorityBadge = (overdue: number) => {
    if (overdue > 0) {
      return (
        <Badge className='rounded-full bg-red-500 px-2 py-1 text-xs text-white'>
          {overdue} Overdue
        </Badge>
      );
    }
    return null;
  };

  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return 'No upcoming deadlines';

    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 0) {
      return `Due in ${Math.abs(Math.floor(diffInHours))} hours`;
    } else if (diffInHours < 24) {
      return `Due in ${Math.floor(diffInHours)} hours`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Due in ${diffInDays} days`;
    }
  };

  const formatDate = (timestamp: string | null) => {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <div className='mb-2 flex items-center gap-2'>
              <IconCalendar className='h-6 w-6 text-red-600' />
              <Badge variant='secondary' className='text-red-600'>
                Admin Only
              </Badge>
            </div>
            <h1 className='text-3xl font-bold tracking-tight'>Deadlines</h1>
            <p className='text-muted-foreground'>
              Track important deadlines, court dates, and time-sensitive tasks
            </p>
          </div>
          <Button className='bg-primary hover:bg-primary/90 text-primary-foreground'>
            <IconPlus className='mr-2 h-4 w-4' />
            Add Deadline
          </Button>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm font-medium'>
                    Total Deadlines
                  </p>
                  <p className='text-foreground text-2xl font-bold'>22</p>
                </div>
                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100'>
                  <IconCalendar className='h-6 w-6 text-blue-600' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm font-medium'>
                    Overdue
                  </p>
                  <p className='text-2xl font-bold text-red-600'>3</p>
                </div>
                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-red-100'>
                  <IconAlertTriangle className='h-6 w-6 text-red-600' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm font-medium'>
                    Upcoming
                  </p>
                  <p className='text-2xl font-bold text-blue-600'>12</p>
                </div>
                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100'>
                  <IconClock className='h-6 w-6 text-blue-600' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm font-medium'>
                    Completed
                  </p>
                  <p className='text-2xl font-bold text-green-600'>7</p>
                </div>
                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-green-100'>
                  <IconCheck className='h-6 w-6 text-green-600' />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className='p-6'>
            <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
              <div className='flex flex-1 items-center gap-4'>
                <div className='relative max-w-md flex-1'>
                  <IconSearch className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                  <Input
                    placeholder='Search clients or deadlines...'
                    className='pl-10'
                  />
                </div>
                <Button variant='outline' size='sm'>
                  <IconFilter className='mr-2 h-4 w-4' />
                  Filter
                </Button>
                <Button variant='outline' size='sm'>
                  <IconSortAscending className='mr-2 h-4 w-4' />
                  Sort
                </Button>
              </div>
              <div className='flex items-center gap-2'>
                <Badge
                  variant='outline'
                  className='border-red-200 bg-red-50 text-red-700'
                >
                  <IconAlertTriangle className='mr-1 h-3 w-3' />
                  Overdue First
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Client Deadlines Grid */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {clients.map((client) => (
            <Link
              key={client.id}
              href={`/dashboard/admin/deadlines/${client.id}`}
            >
              <Card className='border-l-primary cursor-pointer border-l-4 transition-shadow hover:shadow-lg'>
                <CardHeader className='pb-3'>
                  <div className='flex items-start justify-between'>
                    <div className='flex items-center gap-3'>
                      <div className='relative'>
                        <div className='bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full font-semibold'>
                          {client.avatar}
                        </div>
                        {client.overdueDeadlines > 0 && (
                          <div className='border-background absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 bg-red-500'>
                            <span className='text-xs font-bold text-white'>
                              {client.overdueDeadlines}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <CardTitle className='text-lg'>{client.name}</CardTitle>
                        <div className='mt-1 flex items-center gap-2'>
                          {getClientStatusBadge(client.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='pt-0'>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <span className='text-muted-foreground text-sm'>
                        Next Deadline:
                      </span>
                      <span className='text-foreground text-sm font-medium'>
                        {client.nextDeadlineTitle || 'None'}
                      </span>
                    </div>

                    <div className='flex items-center justify-between'>
                      <span className='text-muted-foreground text-sm'>
                        Due:
                      </span>
                      <span className='text-foreground text-sm font-medium'>
                        {formatTime(client.nextDeadline)}
                      </span>
                    </div>

                    <div className='flex items-center justify-between border-t pt-2'>
                      <span className='text-muted-foreground text-sm'>
                        Total:
                      </span>
                      <span className='text-foreground text-sm font-bold'>
                        {client.totalDeadlines}
                      </span>
                    </div>

                    <div className='flex items-center gap-2 pt-2'>
                      {client.overdueDeadlines > 0 && (
                        <Badge className='rounded-full bg-red-500 px-2 py-1 text-xs text-white'>
                          {client.overdueDeadlines} overdue
                        </Badge>
                      )}
                      {client.upcomingDeadlines > 0 && (
                        <Badge
                          variant='outline'
                          className='border-blue-200 bg-blue-50 text-xs text-blue-700'
                        >
                          {client.upcomingDeadlines} upcoming
                        </Badge>
                      )}
                      {client.completedDeadlines > 0 && (
                        <Badge
                          variant='outline'
                          className='border-green-200 bg-green-50 text-xs text-green-700'
                        >
                          {client.completedDeadlines} completed
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
