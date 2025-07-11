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
  IconUsers,
  IconPlus,
  IconSearch,
  IconFilter,
  IconBuilding,
  IconMail,
  IconPhone,
  IconFileText
} from '@tabler/icons-react';
import { supabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';

function getMonthRange(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return { start, end };
}

export default async function AdminClientsPage() {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/auth/sign-in');
  }

  const isAdmin = await isUserAdmin();

  if (!isAdmin) {
    return redirect('/dashboard/overview');
  }

  // Fetch dashboard stats directly from Supabase
  let stats = {
    totalClients: 0,
    percentChangeTotal: 0,
    activeClients: 0,
    newThisMonth: 0,
    percentChangeNew: 0,
    pendingClients: 0
  };

  // Fetch all clients
  let clients = [];
  let searchTerm = '';

  try {
    // Get total clients count
    const { count: totalClients } = await supabaseAdmin
      .from('clients')
      .select('*', { count: 'exact', head: true });

    // Get active clients count
    const { count: activeClients } = await supabaseAdmin
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Get pending clients count
    const { count: pendingClients } = await supabaseAdmin
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Get new clients this month
    const { start: monthStart, end: monthEnd } = getMonthRange();
    const { count: newThisMonth } = await supabaseAdmin
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', monthStart.toISOString())
      .lt('created_at', monthEnd.toISOString());

    // Get new clients last month
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const { start: lastMonthStart, end: lastMonthEnd } =
      getMonthRange(lastMonth);
    const { count: newLastMonth } = await supabaseAdmin
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', lastMonthStart.toISOString())
      .lt('created_at', lastMonthEnd.toISOString());

    // Get total clients last month
    const { count: totalLastMonth } = await supabaseAdmin
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .lt('created_at', monthStart.toISOString());

    // Calculate percent changes
    const percentChangeTotal =
      totalLastMonth && totalLastMonth > 0
        ? Math.round(
            ((Number(totalClients ?? 0) - totalLastMonth) / totalLastMonth) *
              100
          )
        : 0;
    const percentChangeNew =
      newLastMonth && newLastMonth > 0
        ? Math.round(
            ((Number(newThisMonth ?? 0) - newLastMonth) / newLastMonth) * 100
          )
        : 0;

    stats = {
      totalClients: Number(totalClients ?? 0),
      percentChangeTotal,
      activeClients: Number(activeClients ?? 0),
      newThisMonth: Number(newThisMonth ?? 0),
      percentChangeNew,
      pendingClients: Number(pendingClients ?? 0)
    };

    // Fetch all clients
    const { data: clientsData } = await supabaseAdmin
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    clients = clientsData || [];
  } catch (error) {
    console.error('Error fetching data:', error);
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

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <div className='mb-2 flex items-center gap-2'>
              <IconUsers className='h-6 w-6 text-blue-600' />
              <Badge variant='secondary' className='text-blue-600'>
                Admin Only
              </Badge>
            </div>
            <h1 className='text-3xl font-bold tracking-tight'>Clients</h1>
            <p className='text-muted-foreground'>
              Manage all client information, contacts, and relationships
            </p>
          </div>
          <div className='flex items-center space-x-2'>
            <Button variant='outline'>
              <IconFilter className='mr-2 h-4 w-4' />
              Filter
            </Button>
            <Button>
              <IconPlus className='mr-2 h-4 w-4' />
              Add Client
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
              <div className='text-2xl font-bold'>{stats.totalClients}</div>
              <p className='text-muted-foreground text-xs'>
                {stats.percentChangeTotal >= 0 ? '+' : ''}
                {stats.percentChangeTotal}% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Active Clients
              </CardTitle>
              <IconUsers className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.activeClients}</div>
              <p className='text-muted-foreground text-xs'>Currently active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                New This Month
              </CardTitle>
              <IconUsers className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.newThisMonth}</div>
              <p className='text-muted-foreground text-xs'>
                {stats.percentChangeNew >= 0 ? '+' : ''}
                {stats.percentChangeNew}% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Pending</CardTitle>
              <IconUsers className='text-muted-foreground h-4 w-4' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stats.pendingClients}</div>
              <p className='text-muted-foreground text-xs'>Awaiting approval</p>
            </CardContent>
          </Card>
        </div>

        {/* Clients Grid */}
        <Card>
          <CardHeader>
            <CardTitle>All Clients</CardTitle>
            <CardDescription>
              Click on any client to view their documents and information
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
                  Get started by adding your first client.
                </p>
              </div>
            ) : (
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {clients.map((client) => (
                  <Link
                    key={client.client_id}
                    href={`/dashboard/admin/clients/${client.client_id}/documents`}
                    className='block'
                  >
                    <Card className='cursor-pointer transition-shadow hover:shadow-md'>
                      <CardHeader className='pb-3'>
                        <div className='flex items-center justify-between'>
                          <CardTitle className='text-lg'>
                            {client.name || 'Unnamed Client'}
                          </CardTitle>
                          {getStatusBadge(client.status)}
                        </div>
                      </CardHeader>
                      <CardContent className='space-y-3'>
                        <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                          <IconBuilding className='h-4 w-4' />
                          <span>{client.company || 'No company'}</span>
                        </div>
                        <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                          <IconMail className='h-4 w-4' />
                          <span>{client.email}</span>
                        </div>
                        {client.phone && (
                          <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                            <IconPhone className='h-4 w-4' />
                            <span>{client.phone}</span>
                          </div>
                        )}
                        <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                          <IconFileText className='h-4 w-4' />
                          <span>View Documents</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
