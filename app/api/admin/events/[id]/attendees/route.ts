import { NextResponse } from 'next/server';
import { isEventbriteNotFound } from '@/fetch/attendees';
import { requireAdmin } from '@/lib/adminAuth';
import { getAttendeeReport } from '@/lib/attendeeReport';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id } = await params;
    const report = await getAttendeeReport(id);
    return NextResponse.json(report);
  } catch (error) {
    if (isEventbriteNotFound(error)) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    console.error('Error building attendee report:', error);
    return NextResponse.json({ error: 'Failed to fetch attendees' }, { status: 500 });
  }
}
