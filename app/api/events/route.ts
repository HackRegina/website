import { NextResponse } from 'next/server';
import { fetchEvents } from '@/fetch/events';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const timeFilter = url.searchParams.get('time_filter') || 'current_future';
    if (timeFilter !== 'current_future' && timeFilter !== 'past') {
      return NextResponse.json({ error: 'Invalid time filter' }, { status: 400 });
    }
    const result = await fetchEvents({ timeFilter });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events', data: [] },
      { status: 500 },
    );
  }
}
