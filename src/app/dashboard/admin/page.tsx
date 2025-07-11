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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  IconUsers,
  IconFileText,
  IconCalendar,
  IconActivity,
  IconTrendingUp,
  IconCheck,
  IconClock,
  IconAlertTriangle,
  IconUpload,
  IconDownload,
  IconEye,
  IconEdit,
  IconShield
} from '@tabler/icons-react';
import { supabaseAdmin } from '@/lib/supabase';

export default async function AdminDashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/auth/sign-in');
  }

  // Check if user is admin using the new auth utility
  const isAdmin = await isUserAdmin();

  if (!isAdmin) {
    return redirect('/dashboard/overview');
  }

  // Fetch dashboard data
  interface DashboardData {
    stats: {
      totalClients: number;
      activeClients: number;
      pendingClients: number;
      inactiveClients: number;
      totalRevenue: number;
      avgRevenuePerClient: number;
      taskCompletionRate: number;
      clientSatisfaction: number;
      responseTime: number;
      percentChangeTotal: number;
      percentChangeNew: number;
      newThisMonth: number;
    };
    recentClients: Array<{
      name: string;
      company: string;
      status: string;
      created_at: string;
    }>;
    statusBreakdown: Record<string, number>;
  }

  let dashboardData: DashboardData = {
    stats: {
      totalClients: 0,
      activeClients: 0,
      pendingClients: 0,
      inactiveClients: 0,
      totalRevenue: 0,
      avgRevenuePerClient: 12400,
      taskCompletionRate: 94,
      clientSatisfaction: 4.8,
      responseTime: 2.3,
      percentChangeTotal: 0,
      percentChangeNew: 0,
      newThisMonth: 0
    },
    recentClients: [],
    statusBreakdown: {}
  };

  try {
    // Get total clients count
    const { count: totalClients } = await supabaseAdmin
      .from('clients')
      .select('*', { count: 'exact', head: true });

    // Get clients by status
    const { data: clientsByStatus } = await supabaseAdmin
      .from('clients')
      .select('status');

    // Calculate status counts
    const statusCounts =
      clientsByStatus?.reduce(
        (acc, client) => {
          acc[client.status] = (acc[client.status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ) || {};

    // Get recent clients (last 5)
    const { data: recentClients } = await supabaseAdmin
      .from('clients')
      .select('name, company, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    // Calculate revenue
    const activeClients = statusCounts.active || 0;
    const totalRevenue =
      activeClients * dashboardData.stats.avgRevenuePerClient;

    dashboardData = {
      stats: {
        totalClients: totalClients || 0,
        activeClients: statusCounts.active || 0,
        pendingClients: statusCounts.pending || 0,
        inactiveClients: statusCounts.inactive || 0,
        totalRevenue,
        avgRevenuePerClient: dashboardData.stats.avgRevenuePerClient,
        taskCompletionRate: dashboardData.stats.taskCompletionRate,
        clientSatisfaction: dashboardData.stats.clientSatisfaction,
        responseTime: dashboardData.stats.responseTime,
        percentChangeTotal: 0, // Placeholder, will be calculated later
        percentChangeNew: 0, // Placeholder, will be calculated later
        newThisMonth: 0 // Placeholder, will be calculated later
      },
      recentClients: recentClients || [],
      statusBreakdown: statusCounts
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
              <IconShield className='h-6 w-6 text-blue-600' />
              <Badge variant='secondary' className='text-blue-600'>
                Admin Only
              </Badge>
            </div>
            <h1 className='text-3xl font-bold tracking-tight'>
              Admin Dashboard
            </h1>
            <p className='text-muted-foreground'>
              Manage all clients, monitor team activity, and track firm-wide
              performance
            </p>
          </div>
          <div className='flex items-center space-x-2'>
            <Button variant='outline'>
              <IconDownload className='mr-2 h-4 w-4' />
              Export Report
            </Button>
            <Button>
              <IconEdit className='mr-2 h-4 w-4' />
              Quick Actions
            </Button>
          </div>
        </div>

        {/* 🔍 Client Snapshot Grid */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <IconUsers className='h-5 w-5' />
              Client Snapshot
            </CardTitle>
            <CardDescription>
              Overview of all clients and their current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <div className='flex flex-col justify-between rounded-lg border p-4'>
                <div>
                  <p className='text-muted-foreground text-sm font-medium'>
                    Total Clients
                  </p>
                  <p className='text-2xl font-bold'>
                    {dashboardData.stats.totalClients}
                  </p>
                </div>
                <span className='text-muted-foreground mt-2 text-xs'>
                  {dashboardData.stats.percentChangeTotal >= 0 ? '+' : ''}
                  {dashboardData.stats.percentChangeTotal}% from last month
                </span>
              </div>
              <div className='flex flex-col justify-between rounded-lg border p-4'>
                <div>
                  <p className='text-muted-foreground text-sm font-medium'>
                    Active Clients
                  </p>
                  <p className='text-2xl font-bold'>
                    {dashboardData.stats.activeClients}
                  </p>
                </div>
                <span className='text-muted-foreground mt-2 text-xs'>
                  Currently active
                </span>
              </div>
              <div className='flex flex-col justify-between rounded-lg border p-4'>
                <div>
                  <p className='text-muted-foreground text-sm font-medium'>
                    New This Month
                  </p>
                  <p className='text-2xl font-bold'>
                    {dashboardData.stats.newThisMonth}
                  </p>
                </div>
                <span className='text-muted-foreground mt-2 text-xs'>
                  {dashboardData.stats.percentChangeNew >= 0 ? '+' : ''}
                  {dashboardData.stats.percentChangeNew}% from last month
                </span>
              </div>
              <div className='flex flex-col justify-between rounded-lg border p-4'>
                <div>
                  <p className='text-muted-foreground text-sm font-medium'>
                    Pending
                  </p>
                  <p className='text-2xl font-bold'>
                    {dashboardData.stats.pendingClients}
                  </p>
                </div>
                <span className='text-muted-foreground mt-2 text-xs'>
                  Awaiting approval
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          {/* 📌 Key Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <IconCalendar className='h-5 w-5' />
                Key Deadlines
              </CardTitle>
              <CardDescription>
                Firm-wide tax and reporting deadlines across all clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center justify-between rounded-lg border p-3'>
                  <div className='flex items-center gap-3'>
                    <div className='h-2 w-2 rounded-full bg-red-500'></div>
                    <div>
                      <p className='font-medium'>Q4 Tax Returns</p>
                      <p className='text-muted-foreground text-sm'>
                        Johnson Corp, Smith LLC
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='font-medium text-red-600'>Due Today</p>
                    <p className='text-muted-foreground text-sm'>2 clients</p>
                  </div>
                </div>
                <div className='flex items-center justify-between rounded-lg border p-3'>
                  <div className='flex items-center gap-3'>
                    <div className='h-2 w-2 rounded-full bg-orange-500'></div>
                    <div>
                      <p className='font-medium'>Annual Reports</p>
                      <p className='text-muted-foreground text-sm'>
                        TechStart Inc, Global Solutions
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='font-medium text-orange-600'>Due in 3 days</p>
                    <p className='text-muted-foreground text-sm'>2 clients</p>
                  </div>
                </div>
                <div className='flex items-center justify-between rounded-lg border p-3'>
                  <div className='flex items-center gap-3'>
                    <div className='h-2 w-2 rounded-full bg-yellow-500'></div>
                    <div>
                      <p className='font-medium'>Payroll Tax Filing</p>
                      <p className='text-muted-foreground text-sm'>
                        Retail Partners, Service Co
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='font-medium text-yellow-600'>Due in 1 week</p>
                    <p className='text-muted-foreground text-sm'>2 clients</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 📄 Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <IconActivity className='h-5 w-5' />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest actions from team members and clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {dashboardData.recentClients.length > 0 ? (
                  dashboardData.recentClients.map((client, index) => (
                    <div key={index} className='flex items-start gap-3'>
                      <div
                        className={`mt-1 h-2 w-2 rounded-full ${
                          client.status === 'active'
                            ? 'bg-green-500'
                            : client.status === 'pending'
                              ? 'bg-orange-500'
                              : 'bg-gray-500'
                        }`}
                      ></div>
                      <div className='flex-1'>
                        <p className='text-sm font-medium'>
                          New client added: {client.name}
                        </p>
                        <p className='text-muted-foreground text-xs'>
                          {client.company} •{' '}
                          {new Date(client.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='text-muted-foreground py-4 text-center'>
                    No recent client activity
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 📈 Client Performance */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <IconTrendingUp className='h-5 w-5' />
              Client Performance
            </CardTitle>
            <CardDescription>
              Key performance indicators across all clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <div className='rounded-lg border p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-muted-foreground text-sm font-medium'>
                      Avg Revenue per Client
                    </p>
                    <p className='text-2xl font-bold'>
                      $
                      {(dashboardData.stats.avgRevenuePerClient / 1000).toFixed(
                        1
                      )}
                      K
                    </p>
                  </div>
                  <Badge variant='secondary' className='text-green-600'>
                    +8.2%
                  </Badge>
                </div>
              </div>
              <div className='rounded-lg border p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-muted-foreground text-sm font-medium'>
                      Task Completion Rate
                    </p>
                    <p className='text-2xl font-bold'>
                      {dashboardData.stats.taskCompletionRate}%
                    </p>
                  </div>
                  <Badge variant='secondary' className='text-green-600'>
                    +2.1%
                  </Badge>
                </div>
              </div>
              <div className='rounded-lg border p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-muted-foreground text-sm font-medium'>
                      Client Satisfaction
                    </p>
                    <p className='text-2xl font-bold'>
                      {dashboardData.stats.clientSatisfaction}/5
                    </p>
                  </div>
                  <Badge variant='secondary' className='text-green-600'>
                    +0.3
                  </Badge>
                </div>
              </div>
              <div className='rounded-lg border p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-muted-foreground text-sm font-medium'>
                      Response Time
                    </p>
                    <p className='text-2xl font-bold'>
                      {dashboardData.stats.responseTime}h
                    </p>
                  </div>
                  <Badge variant='secondary' className='text-red-600'>
                    +0.5h
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          {/* ✅ Tasks Summary */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <IconCheck className='h-5 w-5' />
                Tasks Summary
              </CardTitle>
              <CardDescription>
                Overview of pending and in-progress tasks across all clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center justify-between rounded-lg border p-3'>
                  <div className='flex items-center gap-3'>
                    <IconClock className='h-5 w-5 text-orange-500' />
                    <div>
                      <p className='font-medium'>Pending Review</p>
                      <p className='text-muted-foreground text-sm'>
                        Tax returns awaiting approval
                      </p>
                    </div>
                  </div>
                  <Badge variant='outline'>8 tasks</Badge>
                </div>
                <div className='flex items-center justify-between rounded-lg border p-3'>
                  <div className='flex items-center gap-3'>
                    <IconActivity className='h-5 w-5 text-blue-500' />
                    <div>
                      <p className='font-medium'>In Progress</p>
                      <p className='text-muted-foreground text-sm'>
                        Currently being worked on
                      </p>
                    </div>
                  </div>
                  <Badge variant='outline'>15 tasks</Badge>
                </div>
                <div className='flex items-center justify-between rounded-lg border p-3'>
                  <div className='flex items-center gap-3'>
                    <IconAlertTriangle className='h-5 w-5 text-red-500' />
                    <div>
                      <p className='font-medium'>Overdue</p>
                      <p className='text-muted-foreground text-sm'>
                        Past due date
                      </p>
                    </div>
                  </div>
                  <Badge variant='destructive'>3 tasks</Badge>
                </div>
                <div className='flex items-center justify-between rounded-lg border p-3'>
                  <div className='flex items-center gap-3'>
                    <IconCheck className='h-5 w-5 text-green-500' />
                    <div>
                      <p className='font-medium'>Completed This Week</p>
                      <p className='text-muted-foreground text-sm'>
                        Successfully finished
                      </p>
                    </div>
                  </div>
                  <Badge variant='outline'>24 tasks</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 🧑‍💻 Team Activity */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <IconUsers className='h-5 w-5' />
                Team Activity
              </CardTitle>
              <CardDescription>
                Recent actions and uploads from team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-100'>
                    <span className='text-sm font-medium text-blue-600'>S</span>
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>Sarah Johnson</p>
                    <p className='text-muted-foreground text-xs'>
                      Uploaded Q4 financials for Johnson Corp
                    </p>
                    <p className='text-muted-foreground text-xs'>2 hours ago</p>
                  </div>
                  <IconUpload className='h-4 w-4 text-green-500' />
                </div>
                <div className='flex items-center gap-3'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-green-100'>
                    <span className='text-sm font-medium text-green-600'>
                      M
                    </span>
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>Mike Chen</p>
                    <p className='text-muted-foreground text-xs'>
                      Reviewed tax return for Smith LLC
                    </p>
                    <p className='text-muted-foreground text-xs'>4 hours ago</p>
                  </div>
                  <IconEye className='h-4 w-4 text-blue-500' />
                </div>
                <div className='flex items-center gap-3'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-purple-100'>
                    <span className='text-sm font-medium text-purple-600'>
                      L
                    </span>
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>Lisa Rodriguez</p>
                    <p className='text-muted-foreground text-xs'>
                      Started onboarding for TechStart Inc
                    </p>
                    <p className='text-muted-foreground text-xs'>6 hours ago</p>
                  </div>
                  <IconEdit className='h-4 w-4 text-purple-500' />
                </div>
                <div className='flex items-center gap-3'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-orange-100'>
                    <span className='text-sm font-medium text-orange-600'>
                      D
                    </span>
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>David Kim</p>
                    <p className='text-muted-foreground text-xs'>
                      Downloaded reports for Global Solutions
                    </p>
                    <p className='text-muted-foreground text-xs'>1 day ago</p>
                  </div>
                  <IconDownload className='h-4 w-4 text-orange-500' />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
