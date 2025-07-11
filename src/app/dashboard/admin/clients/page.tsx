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
  IconFilter
} from '@tabler/icons-react';
import { ClientsTable } from './components/clients-table';
import { supabaseAdmin } from '@/lib/supabase';

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
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }

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

        {/* Clients Table */}
        <Card>
          <CardHeader>
            <CardTitle>Client Management</CardTitle>
            <CardDescription>
              View and manage all client information, contacts, and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClientsTable />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
