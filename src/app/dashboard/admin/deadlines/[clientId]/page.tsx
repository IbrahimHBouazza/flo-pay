import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { isUserAdmin } from '@/lib/auth';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  IconArrowLeft,
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconFlag,
  IconBell,
  IconFilter,
  IconSortAscending
} from '@tabler/icons-react';
import Link from 'next/link';

interface PageProps {
  params: {
    clientId: string;
  };
}

export default async function ClientDeadlinesPage({ params }: PageProps) {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/auth/sign-in');
  }

  const isAdmin = await isUserAdmin();

  if (!isAdmin) {
    return redirect('/dashboard/overview');
  }

  // Mock clients data - in a real app, this would come from the database
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
      completedDeadlines: 1
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
      completedDeadlines: 1
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
      completedDeadlines: 1
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
      completedDeadlines: 0
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
      completedDeadlines: 3
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
      completedDeadlines: 1
    }
  ];

  // Mock deadlines data - in a real app, this would come from the database
  const getClientDeadlines = (clientId: string) => {
    const deadlinesByClient = {
      '1': [
        // Acme Corporation
        {
          id: '1',
          title: 'Q4 Tax Filing Deadline',
          description: 'Submit quarterly tax returns for Q4 2023',
          dueDate: '2024-01-15T17:00:00Z',
          priority: 'high',
          status: 'overdue',
          category: 'Tax Filing',
          assignedTo: 'John Smith',
          notes: 'Client needs to provide additional documentation'
        },
        {
          id: '2',
          title: 'Annual Report Submission',
          description:
            'Submit annual financial report to regulatory authorities',
          dueDate: '2024-01-20T10:00:00Z',
          priority: 'high',
          status: 'upcoming',
          category: 'Compliance',
          assignedTo: 'Sarah Johnson',
          notes: 'Report is ready, pending final review'
        },
        {
          id: '3',
          title: 'Contract Renewal',
          description: 'Review and renew service contracts',
          dueDate: '2024-01-25T14:00:00Z',
          priority: 'medium',
          status: 'upcoming',
          category: 'Contracts',
          assignedTo: 'Mike Davis',
          notes: 'Terms need to be negotiated'
        },
        {
          id: '4',
          title: 'Employee Benefits Review',
          description: 'Annual review of employee benefit packages',
          dueDate: '2024-01-30T09:00:00Z',
          priority: 'medium',
          status: 'upcoming',
          category: 'HR',
          assignedTo: 'Lisa Wilson',
          notes: 'Market analysis required'
        },
        {
          id: '5',
          title: 'Insurance Policy Update',
          description: 'Update corporate insurance policies',
          dueDate: '2024-01-10T16:00:00Z',
          priority: 'low',
          status: 'completed',
          category: 'Insurance',
          assignedTo: 'Tom Brown',
          notes: 'Successfully completed on time'
        }
      ],
      '2': [
        // TechStart Inc
        {
          id: '6',
          title: 'Contract Review',
          description: 'Review vendor contracts for Q1',
          dueDate: '2024-01-18T14:30:00Z',
          priority: 'high',
          status: 'upcoming',
          category: 'Contracts',
          assignedTo: 'Alex Chen',
          notes: 'Legal review required'
        },
        {
          id: '7',
          title: 'Patent Application',
          description: 'Submit patent application for new technology',
          dueDate: '2024-01-22T11:00:00Z',
          priority: 'high',
          status: 'upcoming',
          category: 'Legal',
          assignedTo: 'Rachel Green',
          notes: 'Technical documentation needed'
        },
        {
          id: '8',
          title: 'Board Meeting Preparation',
          description: 'Prepare materials for quarterly board meeting',
          dueDate: '2024-01-12T15:00:00Z',
          priority: 'medium',
          status: 'completed',
          category: 'Governance',
          assignedTo: 'David Lee',
          notes: 'Meeting completed successfully'
        }
      ],
      '3': [
        // Global Solutions
        {
          id: '9',
          title: 'Financial Report Submission',
          description: 'Submit quarterly financial reports',
          dueDate: '2024-01-14T17:00:00Z',
          priority: 'high',
          status: 'overdue',
          category: 'Finance',
          assignedTo: 'Emma White',
          notes: 'Audit findings need to be addressed'
        },
        {
          id: '10',
          title: 'Compliance Audit',
          description: 'Complete annual compliance audit',
          dueDate: '2024-01-12T10:00:00Z',
          priority: 'high',
          status: 'overdue',
          category: 'Compliance',
          assignedTo: 'James Miller',
          notes: 'Several issues identified'
        },
        {
          id: '11',
          title: 'Budget Planning',
          description: 'Develop annual budget for 2024',
          dueDate: '2024-01-20T16:00:00Z',
          priority: 'high',
          status: 'upcoming',
          category: 'Finance',
          assignedTo: 'Emma White',
          notes: 'Department heads need to submit proposals'
        },
        {
          id: '12',
          title: 'IT Security Review',
          description: 'Annual IT security assessment',
          dueDate: '2024-01-25T13:00:00Z',
          priority: 'medium',
          status: 'upcoming',
          category: 'IT',
          assignedTo: 'Chris Taylor',
          notes: 'External auditor scheduled'
        },
        {
          id: '13',
          title: 'Employee Training',
          description: 'Complete annual employee training program',
          dueDate: '2024-01-28T09:00:00Z',
          priority: 'medium',
          status: 'upcoming',
          category: 'HR',
          assignedTo: 'Lisa Wilson',
          notes: 'Training materials need updating'
        },
        {
          id: '14',
          title: 'Vendor Evaluation',
          description: 'Evaluate current vendors and contracts',
          dueDate: '2024-01-30T14:00:00Z',
          priority: 'medium',
          status: 'upcoming',
          category: 'Procurement',
          assignedTo: 'Mike Davis',
          notes: 'Performance metrics to be reviewed'
        },
        {
          id: '15',
          title: 'Risk Assessment',
          description: 'Annual enterprise risk assessment',
          dueDate: '2024-01-08T11:00:00Z',
          priority: 'low',
          status: 'completed',
          category: 'Risk Management',
          assignedTo: 'James Miller',
          notes: 'Assessment completed on schedule'
        }
      ]
    };

    return deadlinesByClient[clientId as keyof typeof deadlinesByClient] || [];
  };

  const client = clients.find((c) => c.id === params.clientId);
  const deadlines = getClientDeadlines(params.clientId);

  if (!client) {
    return redirect('/dashboard/admin/deadlines');
  }

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

  const getDeadlineStatusBadge = (status: string) => {
    const variants = {
      overdue: 'destructive',
      upcoming: 'default',
      completed: 'secondary'
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

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: 'destructive',
      medium: 'default',
      low: 'secondary'
    } as const;

    return (
      <Badge
        variant={variants[priority as keyof typeof variants] || 'outline'}
        className='text-xs'
      >
        {priority}
      </Badge>
    );
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 0) {
      return `Overdue by ${Math.abs(Math.floor(diffInHours))} hours`;
    } else if (diffInHours < 24) {
      return `Due in ${Math.floor(diffInHours)} hours`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Due in ${diffInDays} days`;
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Link href='/dashboard/admin/deadlines'>
              <Button variant='ghost' size='sm'>
                <IconArrowLeft className='mr-2 h-4 w-4' />
                Back to All Deadlines
              </Button>
            </Link>
            <div>
              <div className='mb-2 flex items-center gap-2'>
                <IconCalendar className='h-6 w-6 text-red-600' />
                <Badge variant='secondary' className='text-red-600'>
                  Admin Only
                </Badge>
              </div>
              <h1 className='text-3xl font-bold tracking-tight'>
                Deadlines - {client.name}
              </h1>
              <p className='text-muted-foreground'>
                Manage deadlines and time-sensitive tasks for {client.name}
              </p>
            </div>
          </div>
          <Button className='bg-primary hover:bg-primary/90 text-primary-foreground'>
            <IconPlus className='mr-2 h-4 w-4' />
            Add Deadline
          </Button>
        </div>

        {/* Client Stats */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
          <Card>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-sm font-medium'>
                    Total Deadlines
                  </p>
                  <p className='text-foreground text-2xl font-bold'>
                    {client.totalDeadlines}
                  </p>
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
                  <p className='text-2xl font-bold text-red-600'>
                    {client.overdueDeadlines}
                  </p>
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
                  <p className='text-2xl font-bold text-blue-600'>
                    {client.upcomingDeadlines}
                  </p>
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
                  <p className='text-2xl font-bold text-green-600'>
                    {client.completedDeadlines}
                  </p>
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
                  <Input placeholder='Search deadlines...' className='pl-10' />
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

        {/* Deadlines List */}
        <div className='space-y-4'>
          {deadlines.length === 0 ? (
            <Card>
              <CardContent className='p-12 text-center'>
                <div className='bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
                  <IconCalendar className='text-primary h-8 w-8' />
                </div>
                <h3 className='text-foreground mb-2 text-lg font-medium'>
                  No deadlines yet
                </h3>
                <p className='text-muted-foreground mb-4 text-sm'>
                  Add deadlines for {client.name}
                </p>
                <Button className='bg-primary hover:bg-primary/90 text-primary-foreground'>
                  <IconPlus className='mr-2 h-4 w-4' />
                  Add First Deadline
                </Button>
              </CardContent>
            </Card>
          ) : (
            deadlines.map((deadline) => (
              <Card
                key={deadline.id}
                className={`border-l-4 ${
                  deadline.status === 'overdue'
                    ? 'border-l-red-500'
                    : deadline.status === 'upcoming'
                      ? 'border-l-blue-500'
                      : 'border-l-green-500'
                }`}
              >
                <CardHeader className='pb-3'>
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <div className='mb-2 flex items-center gap-2'>
                        <CardTitle className='text-lg'>
                          {deadline.title}
                        </CardTitle>
                        {getDeadlineStatusBadge(deadline.status)}
                        {getPriorityBadge(deadline.priority)}
                      </div>
                      <p className='text-muted-foreground mb-2 text-sm'>
                        {deadline.description}
                      </p>
                      <div className='text-muted-foreground flex items-center gap-4 text-xs'>
                        <div className='flex items-center gap-1'>
                          <IconCalendar className='h-3 w-3' />
                          <span>{formatDateTime(deadline.dueDate)}</span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <IconUser className='h-3 w-3' />
                          <span>{deadline.assignedTo}</span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <IconBuilding className='h-3 w-3' />
                          <span>{deadline.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-1'>
                      <Button variant='ghost' size='sm'>
                        <IconEdit className='h-4 w-4' />
                      </Button>
                      <Button variant='ghost' size='sm'>
                        <IconTrash className='h-4 w-4' />
                      </Button>
                      <Button variant='ghost' size='sm'>
                        <IconDotsVertical className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='pt-0'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <span
                        className={`text-sm font-medium ${
                          deadline.status === 'overdue'
                            ? 'text-red-600'
                            : deadline.status === 'upcoming'
                              ? 'text-blue-600'
                              : 'text-green-600'
                        }`}
                      >
                        {formatTime(deadline.dueDate)}
                      </span>
                      {deadline.status === 'overdue' && (
                        <IconAlertTriangle className='h-4 w-4 text-red-500' />
                      )}
                    </div>
                    <div className='flex items-center gap-2'>
                      {deadline.notes && (
                        <Button variant='outline' size='sm'>
                          <IconFlag className='mr-1 h-4 w-4' />
                          Notes
                        </Button>
                      )}
                      <Button variant='outline' size='sm'>
                        <IconBell className='mr-1 h-4 w-4' />
                        Remind
                      </Button>
                      {deadline.status === 'upcoming' && (
                        <Button
                          size='sm'
                          className='bg-primary hover:bg-primary/90 text-primary-foreground'
                        >
                          <IconCheck className='mr-1 h-4 w-4' />
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                  {deadline.notes && (
                    <div className='bg-muted/50 mt-3 rounded-lg p-3'>
                      <p className='text-muted-foreground text-sm'>
                        {deadline.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </PageContainer>
  );
}
