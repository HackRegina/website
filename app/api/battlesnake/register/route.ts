import { NextResponse } from 'next/server';
import { verifyBattlesnake } from '@/lib/battlesnake';
import {
  fetchBrackets,
  fetchTicketOptions,
  findExistingCompetitor,
  isBracket,
  reserveTicket,
  TOURNAMENT,
} from '@/lib/battlesnakeTickets';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fail = (field: string, error: string, status = 400) =>
  NextResponse.json({ ok: false, field, error }, { status });

export async function GET() {
  try {
    const { brackets, spectators } = await fetchTicketOptions();
    return NextResponse.json({
      tournament: TOURNAMENT,
      brackets: brackets.map(({ id, label, capacity, remaining }) => ({
        id,
        label,
        capacity,
        remaining,
      })),
      spectators,
    });
  } catch (error) {
    console.error('Error loading Battlesnake brackets:', error);
    return NextResponse.json({ error: 'Failed to load brackets' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const text = (key: string) => (typeof body[key] === 'string' ? (body[key] as string).trim() : '');
  if (!isBracket(body.bracket)) return fail('bracket', 'Pick a bracket.');
  const email = text('email');
  if (!EMAIL_PATTERN.test(email)) return fail('email', 'Enter a valid email.');

  try {
    const check = await verifyBattlesnake(text('username'), text('snake'));
    if (!check.ok) return fail(check.field, check.error);

    const existing = await findExistingCompetitor(email);
    if (existing) {
      return fail(
        'email',
        `You're already registered in the ${existing.bracketLabel} bracket with this email, so there's no need to register again. Need to change brackets? Reply to your Eventbrite confirmation or ask in #battlesnake on Slack.`,
        409,
      );
    }

    const bracket = (await fetchBrackets()).find((b) => b.id === body.bracket);
    if (!bracket) return fail('bracket', 'That bracket is not open for registration.');

    const result = await reserveTicket(bracket, check.snake);
    if (!result.ok) return fail(result.field, result.error, 409);
    return NextResponse.json({ ...result, snake: check.snake });
  } catch (error) {
    console.error('Error reserving Battlesnake ticket:', error);
    return fail('form', 'Something went wrong. Try again in a minute.', 500);
  }
}
