import { NextResponse } from 'next/server';
import { verifyBattlesnake } from '@/lib/battlesnake';
import {
  BRACKETS,
  countByBracket,
  isBracket,
  register,
  TOURNAMENT,
} from '@/lib/battlesnakeRegistrations';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fail = (field: string, error: string, status = 400) =>
  NextResponse.json({ ok: false, field, error }, { status });

export async function GET() {
  try {
    const counts = await countByBracket();
    const brackets = Object.entries(BRACKETS).map(([id, { label, capacity }]) => ({
      id,
      label,
      capacity,
      remaining: Math.max(0, capacity - counts[id as keyof typeof counts]),
    }));
    return NextResponse.json({ tournament: TOURNAMENT, brackets });
  } catch (error) {
    console.error('Error loading Battlesnake brackets:', error);
    return NextResponse.json({ error: 'Failed to load brackets' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (Date.now() > Date.parse(TOURNAMENT.closesAt)) {
    return fail('bracket', 'Registration for this tournament is closed.');
  }
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const text = (key: string) => (typeof body[key] === 'string' ? (body[key] as string).trim() : '');

  const name = text('name');
  const email = text('email');
  if (!name || name.length > 120) return fail('name', 'Enter your name.');
  if (!EMAIL_PATTERN.test(email) || email.length > 200)
    return fail('email', 'Enter a valid email.');
  if (!isBracket(body.bracket)) return fail('bracket', 'Pick a bracket.');

  try {
    const check = await verifyBattlesnake(text('username'), text('snake'));
    if (!check.ok) return fail(check.field, check.error);

    const result = await register({ name, email, bracket: body.bracket, snake: check.snake });
    if (!result.ok) return fail(result.field, result.error, 409);
    return NextResponse.json({ ok: true, registration: result.registration });
  } catch (error) {
    console.error('Error registering for Battlesnake:', error);
    return fail(
      'form',
      'Something went wrong saving your registration. Try again in a minute.',
      500,
    );
  }
}
