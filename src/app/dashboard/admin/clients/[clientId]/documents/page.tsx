import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { isUserAdmin } from '@/lib/auth';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  IconArrowLeft,
  IconFileText,
  IconUpload,
  IconDownload,
  IconEye,
  IconEdit,
  IconTrash,
  IconBuilding,
  IconMail,
  IconPhone,
  IconCalendar
} from '@tabler/icons-react';
import { supabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';

export default async function ClientDocumentsPage({
  params
}: {
  params: { clientId: string };
}) {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/auth/sign-in');
  }

  const isAdmin = await isUserAdmin();

  if (!isAdmin) {
    return redirect('/dashboard/overview');
  }

  // Fetch client details
  let client = null;
  let documents = [];

  try {
    const { data: clientData, error: clientError } = await supabaseAdmin
      .from('clients')
      .select('*')
      .eq('client_id', params.clientId)
      .single();

    if (clientError || !clientData) {
      return redirect('/dashboard/admin/clients');
    }

    client = clientData;

    // TODO: Fetch documents for this client
    // For now, we'll use mock data
    documents = [
      {
        id: '1',
        name: 'Q4 Tax Return 2024',
        type: 'PDF',
        size: '2.4 MB',
        uploaded_at: '2024-01-15T10:30:00Z',
        status: 'completed'
      },
      {
        id: '2',
        name: 'Annual Financial Report',
        type: 'PDF',
        size: '1.8 MB',
        uploaded_at: '2024-01-10T14:20:00Z',
        status: 'pending'
      },
      {
        id: '3',
        name: 'Payroll Records',
        type: 'Excel',
        size: '856 KB',
        uploaded_at: '2024-01-05T09:15:00Z',
        status: 'completed'
      }
    ];
  } catch (error) {
    console.error('Error fetching client data:', error);
    return redirect('/dashboard/admin/clients');
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      inactive: 'secondary',
      pending: 'outline'
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

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <div className='mb-2 flex items-center gap-2'>
              <Link href='/dashboard/admin/clients'>
                <Button variant='ghost' size='sm' className='gap-2'>
                  <IconArrowLeft className='h-4 w-4' />
                  Back to Clients
                </Button>
              </Link>
            </div>
            <div className='mb-2 flex items-center gap-2'>
              <IconFileText className='h-6 w-6 text-blue-600' />
              <Badge variant='secondary' className='text-blue-600'>
                Client Documents
              </Badge>
            </div>
            <h1 className='text-3xl font-bold tracking-tight'>
              {client.name || 'Client'}
            </h1>
            <p className='text-muted-foreground'>
              View and manage documents for {client.company || 'this client'}
            </p>
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

        {/* Client Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <IconBuilding className='text-muted-foreground h-4 w-4' />
                  <span className='font-medium'>Company:</span>
                  <span>{client.company || 'No company'}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <IconMail className='text-muted-foreground h-4 w-4' />
                  <span className='font-medium'>Email:</span>
                  <span>{client.email}</span>
                </div>
                {client.phone && (
                  <div className='flex items-center gap-2'>
                    <IconPhone className='text-muted-foreground h-4 w-4' />
                    <span className='font-medium'>Phone:</span>
                    <span>{client.phone}</span>
                  </div>
                )}
              </div>
              <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <span className='font-medium'>Status:</span>
                  {getStatusBadge(client.status)}
                </div>
                <div className='flex items-center gap-2'>
                  <IconCalendar className='text-muted-foreground h-4 w-4' />
                  <span className='font-medium'>Created:</span>
                  <span>
                    {new Date(client.created_at).toLocaleDateString()}
                  </span>
                </div>
                {client.notes && (
                  <div className='flex items-start gap-2'>
                    <span className='font-medium'>Notes:</span>
                    <span className='text-muted-foreground text-sm'>
                      {client.notes}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>
              All documents uploaded for this client
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
                    className='flex items-center justify-between rounded-lg border p-4'
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
