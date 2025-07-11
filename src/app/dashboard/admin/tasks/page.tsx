import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { isUserAdmin } from '@/lib/auth';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  IconClipboardList,
  IconPlus,
  IconFilter,
  IconSearch,
  IconBuilding,
  IconUsers,
  IconCalendar,
  IconCheck,
  IconClock,
  IconAlertCircle,
  IconArrowRight,
  IconUpload,
  IconEye,
  IconEdit
} from '@tabler/icons-react';
import Link from 'next/link';

export default async function AdminTasksPage() {
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
      task_count: 5,
      completed_tasks: 3,
      pending_tasks: 2,
      last_activity: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'TechStart Inc',
      email: 'hello@techstart.com',
      status: 'active',
      task_count: 8,
      completed_tasks: 6,
      pending_tasks: 2,
      last_activity: '2024-01-10T14:20:00Z'
    },
    {
      id: '3',
      name: 'Global Solutions',
      email: 'info@globalsolutions.com',
      status: 'active',
      task_count: 12,
      completed_tasks: 8,
      pending_tasks: 4,
      last_activity: '2024-01-05T09:15:00Z'
    },
    {
      id: '4',
      name: 'StartupXYZ',
      email: 'team@startupxyz.com',
      status: 'pending',
      task_count: 3,
      completed_tasks: 1,
      pending_tasks: 2,
      last_activity: '2024-01-03T16:45:00Z'
    },
    {
      id: '5',
      name: 'MegaCorp',
      email: 'admin@megacorp.com',
      status: 'active',
      task_count: 15,
      completed_tasks: 12,
      pending_tasks: 3,
      last_activity: '2024-01-01T11:20:00Z'
    },
    {
      id: '6',
      name: 'SmallBiz Ltd',
      email: 'contact@smallbiz.com',
      status: 'inactive',
      task_count: 2,
      completed_tasks: 2,
      pending_tasks: 0,
      last_activity: '2023-12-28T13:10:00Z'
    }
  ];

  // Mock tasks data - in a real app, this would come from the database
  const getClientTasks = (clientId: string) => {
    const tasksByClient = {
      '1': [
        // Acme Corporation
        {
          id: '1',
          title: 'Upload Q4 Tax Documents',
          description:
            'Please upload all Q4 2024 tax-related documents including receipts, invoices, and financial statements.',
          type: 'upload',
          priority: 'high',
          status: 'pending',
          due_date: '2024-01-20T00:00:00Z',
          assigned_to: 'Client',
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          title: 'Review Annual Financial Report',
          description:
            'Review and approve the annual financial report before submission.',
          type: 'review',
          priority: 'medium',
          status: 'completed',
          due_date: '2024-01-18T00:00:00Z',
          assigned_to: 'Admin',
          created_at: '2024-01-10T14:20:00Z'
        },
        {
          id: '3',
          title: 'Update Employee Information',
          description:
            'Update employee records and payroll information for the new year.',
          type: 'update',
          priority: 'low',
          status: 'completed',
          due_date: '2024-01-25T00:00:00Z',
          assigned_to: 'Client',
          created_at: '2024-01-05T09:15:00Z'
        }
      ],
      '2': [
        // TechStart Inc
        {
          id: '4',
          title: 'Submit Invoice Templates',
          description: 'Create and submit invoice templates for Q4 2024.',
          type: 'upload',
          priority: 'high',
          status: 'pending',
          due_date: '2024-01-22T00:00:00Z',
          assigned_to: 'Client',
          created_at: '2024-01-10T14:20:00Z'
        },
        {
          id: '5',
          title: 'Review Contract Agreements',
          description: 'Review and finalize contract agreements with vendors.',
          type: 'review',
          priority: 'medium',
          status: 'completed',
          due_date: '2024-01-19T00:00:00Z',
          assigned_to: 'Admin',
          created_at: '2024-01-08T11:30:00Z'
        }
      ],
      '3': [
        // Global Solutions
        {
          id: '6',
          title: 'Upload Payroll Records',
          description: 'Upload complete payroll records for December 2024.',
          type: 'upload',
          priority: 'high',
          status: 'pending',
          due_date: '2024-01-21T00:00:00Z',
          assigned_to: 'Client',
          created_at: '2024-01-05T09:15:00Z'
        },
        {
          id: '7',
          title: 'Review Financial Statements',
          description: 'Review quarterly financial statements for accuracy.',
          type: 'review',
          priority: 'medium',
          status: 'completed',
          due_date: '2024-01-17T00:00:00Z',
          assigned_to: 'Admin',
          created_at: '2024-01-03T16:45:00Z'
        }
      ],
      '4': [
        // StartupXYZ
        {
          id: '8',
          title: 'Complete Onboarding Documents',
          description:
            'Complete all required onboarding documents for new client setup.',
          type: 'upload',
          priority: 'high',
          status: 'pending',
          due_date: '2024-01-24T00:00:00Z',
          assigned_to: 'Client',
          created_at: '2024-01-03T16:45:00Z'
        }
      ],
      '5': [
        // MegaCorp
        {
          id: '9',
          title: 'Update Employee Handbook',
          description: 'Review and update employee handbook with new policies.',
          type: 'update',
          priority: 'medium',
          status: 'completed',
          due_date: '2024-01-20T00:00:00Z',
          assigned_to: 'Admin',
          created_at: '2024-01-01T11:20:00Z'
        },
        {
          id: '10',
          title: 'Submit Tax Documents',
          description: 'Submit all required tax documents for the fiscal year.',
          type: 'upload',
          priority: 'high',
          status: 'pending',
          due_date: '2024-01-23T00:00:00Z',
          assigned_to: 'Client',
          created_at: '2024-01-02T09:30:00Z'
        }
      ],
      '6': [
        // SmallBiz Ltd
        {
          id: '11',
          title: 'Finalize Contract',
          description: 'Finalize contract agreement with new vendor.',
          type: 'review',
          priority: 'medium',
          status: 'completed',
          due_date: '2024-01-15T00:00:00Z',
          assigned_to: 'Admin',
          created_at: '2023-12-28T13:10:00Z'
        }
      ]
    };

    return tasksByClient[clientId as keyof typeof tasksByClient] || [];
  };

  const getClientStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      pending: 'secondary',
      inactive: 'outline'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    );
  };

  const getTaskPriorityBadge = (priority: string) => {
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

  const getTaskStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      pending: 'secondary',
      overdue: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    );
  };

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case 'upload':
        return <IconUpload className='h-4 w-4' />;
      case 'review':
        return <IconEye className='h-4 w-4' />;
      case 'update':
        return <IconEdit className='h-4 w-4' />;
      default:
        return <IconClipboardList className='h-4 w-4' />;
    }
  };

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <div className='mb-2 flex items-center gap-2'>
              <IconClipboardList className='h-6 w-6 text-green-600' />
              <Badge variant='secondary' className='text-green-600'>
                Admin Only
              </Badge>
            </div>
            <h1 className='text-3xl font-bold tracking-tight'>Tasks</h1>
            <p className='text-muted-foreground'>
              Select a client to view and manage their tasks
            </p>
          </div>
          <div className='flex items-center space-x-2'>
            <Button variant='outline'>
              <IconFilter className='mr-2 h-4 w-4' />
              Filter Clients
            </Button>
            <Button>
              <IconPlus className='mr-2 h-4 w-4' />
              Create Task
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Clients
              </CardTitle>
              <IconUsers className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{clients.length}</div>
              <p className='text-muted-foreground text-xs'>With tasks</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Active Clients
              </CardTitle>
              <IconBuilding className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {clients.filter((client) => client.status === 'active').length}
              </div>
              <p className='text-muted-foreground text-xs'>Currently active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Tasks</CardTitle>
              <IconClipboardList className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {clients.reduce(
                  (total, client) => total + client.task_count,
                  0
                )}
              </div>
              <p className='text-muted-foreground text-xs'>
                Across all clients
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Pending Tasks
              </CardTitle>
              <IconClock className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {clients.reduce(
                  (total, client) => total + client.pending_tasks,
                  0
                )}
              </div>
              <p className='text-muted-foreground text-xs'>
                Awaiting completion
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Client Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select a Client</CardTitle>
            <CardDescription>
              Choose a client to view and manage their tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            {clients.length === 0 ? (
              <div className='py-8 text-center'>
                <IconUsers className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
                <h3 className='text-muted-foreground text-lg font-medium'>
                  No clients found
                </h3>
                <p className='text-muted-foreground text-sm'>
                  Add clients to get started.
                </p>
              </div>
            ) : (
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {clients.map((client) => {
                  const tasks = getClientTasks(client.id);
                  const overdueTasks = tasks.filter(
                    (task) =>
                      task.status === 'pending' &&
                      new Date(task.due_date) < new Date()
                  );

                  return (
                    <Link
                      key={client.id}
                      href={`/dashboard/admin/tasks/${client.id}`}
                    >
                      <Card className='cursor-pointer transition-shadow hover:shadow-md'>
                        <CardContent className='p-6'>
                          <div className='mb-4 flex items-start justify-between'>
                            <div className='rounded-lg bg-green-100 p-2'>
                              <IconBuilding className='h-6 w-6 text-green-600' />
                            </div>
                            {getClientStatusBadge(client.status)}
                          </div>
                          <div className='space-y-2'>
                            <h3 className='text-lg font-semibold'>
                              {client.name}
                            </h3>
                            <p className='text-muted-foreground text-sm'>
                              {client.email}
                            </p>
                            <div className='flex items-center justify-between text-sm'>
                              <span className='text-muted-foreground'>
                                {client.task_count} tasks
                              </span>
                              <span className='text-muted-foreground'>
                                {client.completed_tasks} completed
                              </span>
                            </div>
                            <div className='flex items-center justify-between text-sm'>
                              <span className='text-muted-foreground'>
                                {client.pending_tasks} pending
                              </span>
                              {overdueTasks.length > 0 && (
                                <span className='font-medium text-red-600'>
                                  {overdueTasks.length} overdue
                                </span>
                              )}
                            </div>
                            <div className='text-muted-foreground text-xs'>
                              Last activity:{' '}
                              {new Date(
                                client.last_activity
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
