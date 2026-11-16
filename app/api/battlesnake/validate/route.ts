import { NextResponse } from 'next/server';
import { verifyBattlesnake } from '@/lib/battlesnake';

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as { username?: unknown; snake?: unknown };
    const username = typeof body.username === 'string' ? body.username : '';
    const snake = typeof body.snake === 'string' ? body.snake : '';
    return NextResponse.json(await verifyBattlesnake(username, snake));
  } catch (error) {
    console.error('Error verifying Battlesnake:', error);
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
