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
  IconFolder,
  IconUpload,
  IconDownload,
  IconEye,
  IconEdit,
  IconTrash,
  IconFileText,
  IconSearch,
  IconFilter,
  IconBuilding,
  IconUsers,
  IconArrowLeft
} from '@tabler/icons-react';
import Link from 'next/link';

export default async function AdminDocumentsPage() {
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
      document_count: 12,
      total_size: '15.2 MB',
      last_activity: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'TechStart Inc',
      email: 'hello@techstart.com',
      status: 'active',
      document_count: 8,
      total_size: '8.7 MB',
      last_activity: '2024-01-10T14:20:00Z'
    },
    {
      id: '3',
      name: 'Global Solutions',
      email: 'info@globalsolutions.com',
      status: 'active',
      document_count: 15,
      total_size: '22.1 MB',
      last_activity: '2024-01-05T09:15:00Z'
    },
    {
      id: '4',
      name: 'StartupXYZ',
      email: 'team@startupxyz.com',
      status: 'pending',
      document_count: 3,
      total_size: '1.2 MB',
      last_activity: '2024-01-03T16:45:00Z'
    },
    {
      id: '5',
      name: 'MegaCorp',
      email: 'admin@megacorp.com',
      status: 'active',
      document_count: 25,
      total_size: '45.8 MB',
      last_activity: '2024-01-01T11:20:00Z'
    },
    {
      id: '6',
      name: 'SmallBiz Ltd',
      email: 'contact@smallbiz.com',
      status: 'inactive',
      document_count: 5,
      total_size: '3.4 MB',
      last_activity: '2023-12-28T13:10:00Z'
    }
  ];

  // Mock documents data for selected client - in a real app, this would come from the database
  const getClientDocuments = (clientId: string) => {
    const documentsByClient = {
      '1': [
        // Acme Corporation
        {
          id: '1',
          name: 'Q4 Tax Return 2024',
          type: 'PDF',
          size: '2.4 MB',
          uploaded_at: '2024-01-15T10:30:00Z',
          status: 'completed',
          category: 'Tax Returns'
        },
        {
          id: '2',
          name: 'Annual Financial Report 2024',
          type: 'PDF',
          size: '1.8 MB',
          uploaded_at: '2024-01-10T14:20:00Z',
          status: 'completed',
          category: 'Financial Reports'
        },
        {
          id: '3',
          name: 'Employee Payroll Records',
          type: 'Excel',
          size: '856 KB',
          uploaded_at: '2024-01-05T09:15:00Z',
          status: 'completed',
          category: 'Payroll'
        }
      ],
      '2': [
        // TechStart Inc
        {
          id: '4',
          name: 'Annual Financial Report 2024',
          type: 'PDF',
          size: '1.8 MB',
          uploaded_at: '2024-01-10T14:20:00Z',
          status: 'pending',
          category: 'Financial Reports'
        },
        {
          id: '5',
          name: 'Invoice Template',
          type: 'Word',
          size: '245 KB',
          uploaded_at: '2024-01-03T16:45:00Z',
          status: 'draft',
          category: 'Invoices'
        }
      ],
      '3': [
        // Global Solutions
        {
          id: '6',
          name: 'Payroll Records Q4',
          type: 'Excel',
          size: '856 KB',
          uploaded_at: '2024-01-05T09:15:00Z',
          status: 'completed',
          category: 'Payroll'
        },
        {
          id: '7',
          name: 'Contract Agreement',
          type: 'PDF',
          size: '1.1 MB',
          uploaded_at: '2023-12-28T13:10:00Z',
          status: 'pending',
          category: 'Contracts'
        }
      ],
      '4': [
        // StartupXYZ
        {
          id: '8',
          name: 'Invoice Template',
          type: 'Word',
          size: '245 KB',
          uploaded_at: '2024-01-03T16:45:00Z',
          status: 'draft',
          category: 'Invoices'
        }
      ],
      '5': [
        // MegaCorp
        {
          id: '9',
          name: 'Employee Handbook 2024',
          type: 'PDF',
          size: '3.2 MB',
          uploaded_at: '2024-01-01T11:20:00Z',
          status: 'completed',
          category: 'HR Documents'
        },
        {
          id: '10',
          name: 'Q4 Tax Return 2024',
          type: 'PDF',
          size: '2.4 MB',
          uploaded_at: '2024-01-15T10:30:00Z',
          status: 'completed',
          category: 'Tax Returns'
        }
      ],
      '6': [
        // SmallBiz Ltd
        {
          id: '11',
          name: 'Contract Agreement',
          type: 'PDF',
          size: '1.1 MB',
          uploaded_at: '2023-12-28T13:10:00Z',
          status: 'pending',
          category: 'Contracts'
        }
      ]
    };

    return documentsByClient[clientId as keyof typeof documentsByClient] || [];
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

  const getDocumentStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      pending: 'secondary',
      draft: 'outline'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    );
  };

  const getCategoryBadge = (category: string) => {
    const variants = {
      'Tax Returns': 'destructive',
      'Financial Reports': 'default',
      Payroll: 'secondary',
      Invoices: 'outline',
      'HR Documents': 'default',
      Contracts: 'secondary'
    } as const;

    return (
      <Badge
        variant={variants[category as keyof typeof variants] || 'outline'}
        className='text-xs'
      >
        {category}
      </Badge>
    );
  };

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <div className='mb-2 flex items-center gap-2'>
              <IconFolder className='h-6 w-6 text-orange-600' />
              <Badge variant='secondary' className='text-orange-600'>
                Admin Only
              </Badge>
            </div>
            <h1 className='text-3xl font-bold tracking-tight'>Documents</h1>
            <p className='text-muted-foreground'>
              Select a client to view and manage their documents
            </p>
          </div>
          <div className='flex items-center space-x-2'>
            <Button variant='outline'>
              <IconFilter className='mr-2 h-4 w-4' />
              Filter Clients
            </Button>
            <Button>
              <IconUpload className='mr-2 h-4 w-4' />
              Upload Document
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
              <p className='text-muted-foreground text-xs'>With documents</p>
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
              <CardTitle className='text-sm font-medium'>
                Total Documents
              </CardTitle>
              <IconFileText className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {clients.reduce(
                  (total, client) => total + client.document_count,
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
              <CardTitle className='text-sm font-medium'>Total Size</CardTitle>
              <IconFileText className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>96.4 MB</div>
              <p className='text-muted-foreground text-xs'>Combined storage</p>
            </CardContent>
          </Card>
        </div>

        {/* Client Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select a Client</CardTitle>
            <CardDescription>
              Choose a client to view and manage their documents
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
                  const documents = getClientDocuments(client.id);
                  return (
                    <Link
                      key={client.id}
                      href={`/dashboard/admin/documents/${client.id}`}
                    >
                      <Card className='cursor-pointer transition-shadow hover:shadow-md'>
                        <CardContent className='p-6'>
                          <div className='mb-4 flex items-start justify-between'>
                            <div className='rounded-lg bg-blue-100 p-2'>
                              <IconBuilding className='h-6 w-6 text-blue-600' />
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
                                {client.document_count} documents
                              </span>
                              <span className='text-muted-foreground'>
                                {client.total_size}
                              </span>
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
