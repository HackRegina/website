import { NextResponse } from 'next/server';
import { isEventbriteNotFound } from '@/fetch/attendees';
import { requireAdmin } from '@/lib/adminAuth';
import { getEventAttendees } from '@/lib/eventAttendees';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id } = await params;
    return NextResponse.json(await getEventAttendees(id));
  } catch (error) {
    if (isEventbriteNotFound(error)) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    console.error('Error fetching event attendees:', error);
    return NextResponse.json({ error: 'Failed to fetch attendees' }, { status: 500 });
  }
}
