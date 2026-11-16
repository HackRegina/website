import { NextResponse } from 'next/server';
import { fetchProfileSnakes } from '@/lib/battlesnake';

export async function GET(req: Request) {
  try {
    const username = new URL(req.url).searchParams.get('username') ?? '';
    return NextResponse.json(await fetchProfileSnakes(username));
  } catch (error) {
    console.error('Error loading Battlesnake profile:', error);
    return NextResponse.json(
      {
        ok: false,
        field: 'username',
        error: "We couldn't reach Battlesnake. Try again in a minute.",
      },
      { status: 502 },
    );
  }
}
