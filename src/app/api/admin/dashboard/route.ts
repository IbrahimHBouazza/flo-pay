import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isUserAdmin } from '@/lib/auth';

function getMonthRange(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return { start, end };
}

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get total clients count
    const { count: totalClients, error: clientsError } = await supabaseAdmin
      .from('clients')
      .select('*', { count: 'exact', head: true });
    if (clientsError) {
      return NextResponse.json(
        { error: clientsError.message },
        { status: 500 }
      );
    }

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

    return NextResponse.json({
      data: {
        totalClients: Number(totalClients ?? 0),
        percentChangeTotal,
        activeClients: Number(activeClients ?? 0),
        newThisMonth: Number(newThisMonth ?? 0),
        percentChangeNew,
        pendingClients: Number(pendingClients ?? 0)
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
