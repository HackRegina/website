import { NextResponse } from 'next/server';
import { fetchMembers } from '@/fetch/members';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const cursor = url.searchParams.get('cursor') || undefined;
    const data = await fetchMembers({ cursor });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch members', members: [], cursor: null },
      { status: 500 },
    );
  }
}
