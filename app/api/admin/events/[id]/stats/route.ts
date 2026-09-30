import { NextResponse } from 'next/server';
import { fetchAttendanceHistory } from '@/fetch/attendanceHistory';
import { fetchAttendeesForEvent } from '@/fetch/attendees';
import { requireAdmin } from '@/lib/adminAuth';
import { buildEventStats } from '@/utils/eventStats';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id } = await params;
    const [attendees, history] = await Promise.all([
      fetchAttendeesForEvent(id),
      fetchAttendanceHistory(),
    ]);
    return NextResponse.json(buildEventStats(attendees, history));
  } catch (error) {
    console.error('Error building event stats:', error);
    return NextResponse.json({ error: 'Failed to build event stats' }, { status: 500 });
  }
}
