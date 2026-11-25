import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { listRegistrations, registrationsCsv } from '@/lib/battlesnakeRegistrations';

/** Admins download the tournament's competitors as a CSV. */
export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const csv = registrationsCsv(await listRegistrations());
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="battlesnake-competitors.csv"',
      },
    });
  } catch (error) {
    console.error('Error listing Battlesnake registrations:', error);
    return NextResponse.json({ error: 'Failed to list registrations' }, { status: 500 });
  }
}
