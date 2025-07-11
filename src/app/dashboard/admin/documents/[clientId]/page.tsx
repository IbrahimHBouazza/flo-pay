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
  IconBuilding,
  IconArrowLeft
} from '@tabler/icons-react';
import Link from 'next/link';

interface PageProps {
  params: {
    clientId: string;
  };
}

export default async function ClientDocumentsPage({ params }: PageProps) {
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
        },
        {
          id: '4',
          name: 'Invoice Template Q4',
          type: 'Word',
          size: '245 KB',
          uploaded_at: '2024-01-03T16:45:00Z',
          status: 'draft',
          category: 'Invoices'
        },
        {
          id: '5',
          name: 'Employee Handbook 2024',
          type: 'PDF',
          size: '3.2 MB',
          uploaded_at: '2024-01-01T11:20:00Z',
          status: 'completed',
          category: 'HR Documents'
        }
      ],
      '2': [
        // TechStart Inc
        {
          id: '6',
          name: 'Annual Financial Report 2024',
          type: 'PDF',
          size: '1.8 MB',
          uploaded_at: '2024-01-10T14:20:00Z',
          status: 'pending',
          category: 'Financial Reports'
        },
        {
          id: '7',
          name: 'Invoice Template',
          type: 'Word',
          size: '245 KB',
          uploaded_at: '2024-01-03T16:45:00Z',
          status: 'draft',
          category: 'Invoices'
        },
        {
          id: '8',
          name: 'Q4 Tax Return 2024',
          type: 'PDF',
          size: '2.4 MB',
          uploaded_at: '2024-01-15T10:30:00Z',
          status: 'completed',
          category: 'Tax Returns'
        }
      ],
      '3': [
        // Global Solutions
        {
          id: '9',
          name: 'Payroll Records Q4',
          type: 'Excel',
          size: '856 KB',
          uploaded_at: '2024-01-05T09:15:00Z',
          status: 'completed',
          category: 'Payroll'
        },
        {
          id: '10',
          name: 'Contract Agreement',
          type: 'PDF',
          size: '1.1 MB',
          uploaded_at: '2023-12-28T13:10:00Z',
          status: 'pending',
          category: 'Contracts'
        },
        {
          id: '11',
          name: 'Financial Report Q4',
          type: 'PDF',
          size: '1.8 MB',
          uploaded_at: '2024-01-10T14:20:00Z',
          status: 'completed',
          category: 'Financial Reports'
        }
      ],
      '4': [
        // StartupXYZ
        {
          id: '12',
          name: 'Invoice Template',
          type: 'Word',
          size: '245 KB',
          uploaded_at: '2024-01-03T16:45:00Z',
          status: 'draft',
          category: 'Invoices'
        },
        {
          id: '13',
          name: 'Employee Handbook',
          type: 'PDF',
          size: '3.2 MB',
          uploaded_at: '2024-01-01T11:20:00Z',
          status: 'completed',
          category: 'HR Documents'
        }
      ],
      '5': [
        // MegaCorp
        {
          id: '14',
          name: 'Employee Handbook 2024',
          type: 'PDF',
          size: '3.2 MB',
          uploaded_at: '2024-01-01T11:20:00Z',
          status: 'completed',
          category: 'HR Documents'
        },
        {
          id: '15',
          name: 'Q4 Tax Return 2024',
          type: 'PDF',
          size: '2.4 MB',
          uploaded_at: '2024-01-15T10:30:00Z',
          status: 'completed',
          category: 'Tax Returns'
        },
        {
          id: '16',
          name: 'Annual Financial Report 2024',
          type: 'PDF',
          size: '1.8 MB',
          uploaded_at: '2024-01-10T14:20:00Z',
          status: 'completed',
          category: 'Financial Reports'
        }
      ],
      '6': [
        // SmallBiz Ltd
        {
          id: '17',
          name: 'Contract Agreement',
          type: 'PDF',
          size: '1.1 MB',
          uploaded_at: '2023-12-28T13:10:00Z',
          status: 'pending',
          category: 'Contracts'
        },
        {
          id: '18',
          name: 'Invoice Template',
          type: 'Word',
          size: '245 KB',
          uploaded_at: '2024-01-03T16:45:00Z',
          status: 'draft',
          category: 'Invoices'
        }
      ]
    };

    return documentsByClient[clientId as keyof typeof documentsByClient] || [];
  };

  const client = clients.find((c) => c.id === params.clientId);
  const documents = getClientDocuments(params.clientId);

  if (!client) {
    return redirect('/dashboard/admin/documents');
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
          <div className='flex items-center gap-4'>
            <Link href='/dashboard/admin/documents'>
              <Button variant='ghost' size='sm'>
                <IconArrowLeft className='mr-2 h-4 w-4' />
                Back to Clients
              </Button>
            </Link>
            <div>
              <div className='mb-2 flex items-center gap-2'>
                <IconBuilding className='h-6 w-6 text-blue-600' />
                {getClientStatusBadge(client.status)}
              </div>
              <h1 className='text-3xl font-bold tracking-tight'>
                {client.name}
              </h1>
              <p className='text-muted-foreground'>
                Documents and files for {client.name}
              </p>
            </div>
          </div>
          <div className='flex items-center space-x-2'>
            <Button variant='outline'>
              <IconUpload className='mr-2 h-4 w-4' />
              Upload Document
            </Button>
            <Button>
              <IconDownload className='mr-2 h-4 w-4' />
              Export All
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
                  Total Documents
                </h3>
                <p className='text-sm'>{client.document_count}</p>
              </div>
              <div>
                <h3 className='text-muted-foreground text-sm font-medium'>
                  Total Size
                </h3>
                <p className='text-sm'>{client.total_size}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Documents
              </CardTitle>
              <IconFileText className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{documents.length}</div>
              <p className='text-muted-foreground text-xs'>For this client</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Completed</CardTitle>
              <IconFileText className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {documents.filter((doc) => doc.status === 'completed').length}
              </div>
              <p className='text-muted-foreground text-xs'>
                Processed documents
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Pending</CardTitle>
              <IconFileText className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {documents.filter((doc) => doc.status === 'pending').length}
              </div>
              <p className='text-muted-foreground text-xs'>Awaiting review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Size</CardTitle>
              <IconFileText className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{client.total_size}</div>
              <p className='text-muted-foreground text-xs'>Combined storage</p>
            </CardContent>
          </Card>
        </div>

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>
              View and manage documents for {client.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {documents.length === 0 ? (
              <div className='py-8 text-center'>
                <IconFileText className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
                <h3 className='text-muted-foreground text-lg font-medium'>
                  No documents found
                </h3>
                <p className='text-muted-foreground text-sm'>
                  Upload the first document to get started.
                </p>
              </div>
            ) : (
              <div className='space-y-4'>
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className='flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50'
                  >
                    <div className='flex items-center gap-4'>
                      <div className='rounded-lg bg-blue-100 p-2'>
                        <IconFileText className='h-6 w-6 text-blue-600' />
                      </div>
                      <div>
                        <h4 className='font-medium'>{doc.name}</h4>
                        <div className='text-muted-foreground flex items-center gap-4 text-sm'>
                          <span>{doc.type}</span>
                          <span>{doc.size}</span>
                          <span>
                            {new Date(doc.uploaded_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className='mt-1 flex items-center gap-2'>
                          {getCategoryBadge(doc.category)}
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      {getDocumentStatusBadge(doc.status)}
                      <Button variant='ghost' size='sm'>
                        <IconEye className='h-4 w-4' />
                      </Button>
                      <Button variant='ghost' size='sm'>
                        <IconDownload className='h-4 w-4' />
                      </Button>
                      <Button variant='ghost' size='sm'>
                        <IconEdit className='h-4 w-4' />
                      </Button>
                      <Button variant='ghost' size='sm'>
                        <IconTrash className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
