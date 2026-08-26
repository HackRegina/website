import { NextResponse } from 'next/server';
import { fetchAdminEvents } from '@/fetch/adminEvents';
import { requireAdmin } from '@/lib/adminAuth';

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized', data: [] }, { status: 401 });
  }
  try {
    const data = await fetchAdminEvents();
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching admin events:', error);
    return NextResponse.json({ error: 'Failed to fetch events', data: [] }, { status: 500 });
  }
}
