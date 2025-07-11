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
  IconUpload,
  IconEye,
  IconEdit,
  IconBuilding,
  IconArrowLeft,
  IconCalendar,
  IconCheck,
  IconClock,
  IconAlertCircle,
  IconUser,
  IconFilter
} from '@tabler/icons-react';
import Link from 'next/link';

interface PageProps {
  params: {
    clientId: string;
  };
}

export default async function ClientTasksPage({ params }: PageProps) {
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

  // Mock tasks data for selected client - in a real app, this would come from the database
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
        },
        {
          id: '4',
          title: 'Submit Invoice Templates',
          description: 'Create and submit invoice templates for Q4 2024.',
          type: 'upload',
          priority: 'high',
          status: 'pending',
          due_date: '2024-01-22T00:00:00Z',
          assigned_to: 'Client',
          created_at: '2024-01-12T09:30:00Z'
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
      '2': [
        // TechStart Inc
        {
          id: '6',
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
          id: '7',
          title: 'Review Contract Agreements',
          description: 'Review and finalize contract agreements with vendors.',
          type: 'review',
          priority: 'medium',
          status: 'completed',
          due_date: '2024-01-19T00:00:00Z',
          assigned_to: 'Admin',
          created_at: '2024-01-08T11:30:00Z'
        },
        {
          id: '8',
          title: 'Upload Payroll Records',
          description: 'Upload complete payroll records for December 2024.',
          type: 'upload',
          priority: 'high',
          status: 'pending',
          due_date: '2024-01-21T00:00:00Z',
          assigned_to: 'Client',
          created_at: '2024-01-05T09:15:00Z'
        }
      ],
      '3': [
        // Global Solutions
        {
          id: '9',
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
          id: '10',
          title: 'Review Financial Statements',
          description: 'Review quarterly financial statements for accuracy.',
          type: 'review',
          priority: 'medium',
          status: 'completed',
          due_date: '2024-01-17T00:00:00Z',
          assigned_to: 'Admin',
          created_at: '2024-01-03T16:45:00Z'
        },
        {
          id: '11',
          title: 'Update Employee Handbook',
          description: 'Review and update employee handbook with new policies.',
          type: 'update',
          priority: 'medium',
          status: 'completed',
          due_date: '2024-01-20T00:00:00Z',
          assigned_to: 'Admin',
          created_at: '2024-01-01T11:20:00Z'
        }
      ],
      '4': [
        // StartupXYZ
        {
          id: '12',
          title: 'Complete Onboarding Documents',
          description:
            'Complete all required onboarding documents for new client setup.',
          type: 'upload',
          priority: 'high',
          status: 'pending',
          due_date: '2024-01-24T00:00:00Z',
          assigned_to: 'Client',
          created_at: '2024-01-03T16:45:00Z'
        },
        {
          id: '13',
          title: 'Review Initial Setup',
          description: 'Review initial client setup and configuration.',
          type: 'review',
          priority: 'medium',
          status: 'completed',
          due_date: '2024-01-15T00:00:00Z',
          assigned_to: 'Admin',
          created_at: '2024-01-02T10:00:00Z'
        }
      ],
      '5': [
        // MegaCorp
        {
          id: '14',
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
          id: '15',
          title: 'Submit Tax Documents',
          description: 'Submit all required tax documents for the fiscal year.',
          type: 'upload',
          priority: 'high',
          status: 'pending',
          due_date: '2024-01-23T00:00:00Z',
          assigned_to: 'Client',
          created_at: '2024-01-02T09:30:00Z'
        },
        {
          id: '16',
          title: 'Review Annual Report',
          description: 'Review and approve annual report before publication.',
          type: 'review',
          priority: 'high',
          status: 'pending',
          due_date: '2024-01-25T00:00:00Z',
          assigned_to: 'Admin',
          created_at: '2024-01-03T14:20:00Z'
        }
      ],
      '6': [
        // SmallBiz Ltd
        {
          id: '17',
          title: 'Finalize Contract',
          description: 'Finalize contract agreement with new vendor.',
          type: 'review',
          priority: 'medium',
          status: 'completed',
          due_date: '2024-01-15T00:00:00Z',
          assigned_to: 'Admin',
          created_at: '2023-12-28T13:10:00Z'
        },
        {
          id: '18',
          title: 'Submit Final Documents',
          description: 'Submit final documents for project closure.',
          type: 'upload',
          priority: 'low',
          status: 'completed',
          due_date: '2024-01-10T00:00:00Z',
          assigned_to: 'Client',
          created_at: '2023-12-30T09:15:00Z'
        }
      ]
    };

    return tasksByClient[clientId as keyof typeof tasksByClient] || [];
  };

  const client = clients.find((c) => c.id === params.clientId);
  const tasks = getClientTasks(params.clientId);

  if (!client) {
    return redirect('/dashboard/admin/tasks');
  }

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

  const isTaskOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const getTaskStatus = (task: any) => {
    if (task.status === 'completed') return 'completed';
    if (isTaskOverdue(task.due_date)) return 'overdue';
    return 'pending';
  };

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Link href='/dashboard/admin/tasks'>
              <Button variant='ghost' size='sm'>
                <IconArrowLeft className='mr-2 h-4 w-4' />
                Back to Clients
              </Button>
            </Link>
            <div>
              <div className='mb-2 flex items-center gap-2'>
                <IconBuilding className='h-6 w-6 text-green-600' />
                {getClientStatusBadge(client.status)}
              </div>
              <h1 className='text-3xl font-bold tracking-tight'>
                {client.name}
              </h1>
              <p className='text-muted-foreground'>
                Task management for {client.name}
              </p>
            </div>
          </div>
          <div className='flex items-center space-x-2'>
            <Button variant='outline'>
              <IconFilter className='mr-2 h-4 w-4' />
              Filter Tasks
            </Button>
            <Button>
              <IconPlus className='mr-2 h-4 w-4' />
              Create Task
            </Button>
          </div>
        </div>

        {/* Client Info */}
        <Card>
          <CardContent className='p-6'>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <div>
                <h3 className='text-muted-foreground text-sm font-medium'>
                  Email
                </h3>
                <p className='text-sm'>{client.email}</p>
              </div>
              <div>
                <h3 className='text-muted-foreground text-sm font-medium'>
                  Status
                </h3>
                <div className='mt-1'>
                  {getClientStatusBadge(client.status)}
                </div>
              </div>
              <div>
                <h3 className='text-muted-foreground text-sm font-medium'>
                  Total Tasks
                </h3>
                <p className='text-sm'>{client.task_count}</p>
              </div>
              <div>
                <h3 className='text-muted-foreground text-sm font-medium'>
                  Last Activity
                </h3>
                <p className='text-sm'>
                  {new Date(client.last_activity).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Tasks</CardTitle>
              <IconClipboardList className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{tasks.length}</div>
              <p className='text-muted-foreground text-xs'>For this client</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Completed</CardTitle>
              <IconCheck className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {tasks.filter((task) => task.status === 'completed').length}
              </div>
              <p className='text-muted-foreground text-xs'>Finished tasks</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Pending</CardTitle>
              <IconClock className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {tasks.filter((task) => task.status === 'pending').length}
              </div>
              <p className='text-muted-foreground text-xs'>
                Awaiting completion
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Overdue</CardTitle>
              <IconAlertCircle className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {
                  tasks.filter((task) => getTaskStatus(task) === 'overdue')
                    .length
                }
              </div>
              <p className='text-muted-foreground text-xs'>Past due date</p>
            </CardContent>
          </Card>
        </div>

        {/* Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>
              View and manage tasks for {client.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <div className='py-8 text-center'>
                <IconClipboardList className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
                <h3 className='text-muted-foreground text-lg font-medium'>
                  No tasks found
                </h3>
                <p className='text-muted-foreground text-sm'>
                  Create the first task to get started.
                </p>
              </div>
            ) : (
              <div className='space-y-4'>
                {tasks.map((task) => {
                  const taskStatus = getTaskStatus(task);
                  const isOverdue = isTaskOverdue(task.due_date);

                  return (
                    <div
                      key={task.id}
                      className={`flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50 ${isOverdue ? 'border-red-200 bg-red-50' : ''}`}
                    >
                      <div className='flex items-center gap-4'>
                        <div
                          className={`rounded-lg p-2 ${task.type === 'upload' ? 'bg-blue-100' : task.type === 'review' ? 'bg-green-100' : 'bg-purple-100'}`}
                        >
                          {getTaskTypeIcon(task.type)}
                        </div>
                        <div className='flex-1'>
                          <div className='mb-1 flex items-center gap-2'>
                            <h4 className='font-medium'>{task.title}</h4>
                            {getTaskPriorityBadge(task.priority)}
                            {getTaskStatusBadge(taskStatus)}
                          </div>
                          <p className='text-muted-foreground mb-2 text-sm'>
                            {task.description}
                          </p>
                          <div className='text-muted-foreground flex items-center gap-4 text-xs'>
                            <div className='flex items-center gap-1'>
                              <IconCalendar className='h-3 w-3' />
                              <span>
                                Due:{' '}
                                {new Date(task.due_date).toLocaleDateString()}
                              </span>
                            </div>
                            <div className='flex items-center gap-1'>
                              <IconUser className='h-3 w-3' />
                              <span>Assigned to: {task.assigned_to}</span>
                            </div>
                            {isOverdue && (
                              <span className='font-medium text-red-600'>
                                Overdue
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Button variant='ghost' size='sm'>
                          <IconEye className='h-4 w-4' />
                        </Button>
                        <Button variant='ghost' size='sm'>
                          <IconEdit className='h-4 w-4' />
                        </Button>
                        {task.status === 'pending' && (
                          <Button
                            variant='ghost'
                            size='sm'
                            className='text-green-600'
                          >
                            <IconCheck className='h-4 w-4' />
                          </Button>
                        )}
                      </div>
                    </div>
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
