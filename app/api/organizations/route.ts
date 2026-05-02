import { NextResponse } from 'next/server';
import { fetchOrganizations } from '@/fetch/organizations';

export async function GET() {
  try {
    const data = await fetchOrganizations();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch organizations',
        partners: [],
        organizations: [],
        sponsors: [],
      },
      { status: 500 },
    );
  }
}
