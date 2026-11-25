import { NextResponse } from 'next/server';
import { verifyBattlesnake } from '@/lib/battlesnake';
import { notifyOrganizers, sendConfirmationEmail } from '@/lib/battlesnakeEmail';
import { bracketStatuses, countByBracket, register } from '@/lib/battlesnakeRegistrations';
import {
  fetchEventbriteBrackets,
  findExistingCompetitor,
  isBracket,
  TOURNAMENT,
} from '@/lib/battlesnakeTournament';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fail = (field: string, error: string, status = 400) =>
  NextResponse.json({ ok: false, field, error }, { status });

export async function GET() {
  try {
    const [eventbrite, registered] = await Promise.all([
      fetchEventbriteBrackets(),
      countByBracket(),
    ]);
    return NextResponse.json({
      tournament: TOURNAMENT,
      brackets: bracketStatuses(eventbrite, registered),
    });
  } catch (error) {
    console.error('Error loading Battlesnake brackets:', error);
    return NextResponse.json({ error: 'Failed to load brackets' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const text = (key: string, max = 200) =>
    typeof body[key] === 'string' ? (body[key] as string).trim().slice(0, max) : '';

  if (!isBracket(body.bracket)) return fail('bracket', 'Pick a bracket.');
  const firstName = text('firstName');
  if (!firstName) return fail('firstName', 'Enter your first name.');
  const lastName = text('lastName');
  if (!lastName) return fail('lastName', 'Enter your last name.');
  const email = text('email');
  if (!EMAIL_PATTERN.test(email)) return fail('email', 'Enter a valid email.');
  const dietaryRestrictions = text('dietaryRestrictions', 500);

  try {
    const check = await verifyBattlesnake(text('username'), text('snake'));
    if (!check.ok) return fail(check.field, check.error);

    const existing = await findExistingCompetitor(email);
    if (existing) {
      return fail(
        'email',
        `You're already registered in the ${existing.bracketLabel} bracket with this email through Eventbrite, so there's no need to register again. Need to change brackets? Ask in #battlesnake on Slack.`,
        409,
      );
    }

    const bracket = (await fetchEventbriteBrackets()).find((b) => b.id === body.bracket);
    if (!bracket) return fail('bracket', 'That bracket is not open for registration.');

    const result = await register(
      { firstName, lastName, email, dietaryRestrictions, bracket: bracket.id, snake: check.snake },
      bracket,
    );
    if (!result.ok) return fail(result.field, result.error, 409);

    const emailed = await sendConfirmationEmail(result.registration);
    await notifyOrganizers(result.registration, emailed);
    return NextResponse.json({
      ok: true,
      emailed,
      bracket: bracket.label,
      snake: result.registration.snake,
    });
  } catch (error) {
    console.error('Error registering Battlesnake competitor:', error);
    return fail('form', 'Something went wrong. Try again in a minute.', 500);
  }
}
