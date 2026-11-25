import { neon } from '@neondatabase/serverless';
import type { VerifiedBattlesnake } from '@/lib/battlesnake';
import {
  BRACKETS,
  type Bracket,
  type EventbriteBracket,
  TOURNAMENT,
} from '@/lib/battlesnakeTournament';

export interface Competitor {
  firstName: string;
  lastName: string;
  email: string;
  dietaryRestrictions: string;
}

export interface RegistrationInput extends Competitor {
  bracket: Bracket;
  snake: VerifiedBattlesnake;
}

export interface Registration extends RegistrationInput {
  id: number;
  createdAt: string;
}

export type RegisterResult =
  | { ok: true; registration: Registration }
  | { ok: false; field: 'email' | 'bracket' | 'snake'; error: string };

export interface BracketStatus {
  id: Bracket;
  label: string;
  capacity: number;
  remaining: number;
}

/** Spots left once Eventbrite sales and this site's registrations are both counted. */
export const bracketStatuses = (
  eventbrite: EventbriteBracket[],
  registered: Partial<Record<Bracket, number>>,
): BracketStatus[] =>
  eventbrite.map(({ id, label, capacity, soldOnEventbrite }) => ({
    id,
    label,
    capacity,
    remaining: Math.max(0, capacity - soldOnEventbrite - (registered[id] ?? 0)),
  }));

const db = () => {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is required for Battlesnake registrations');
  return neon(url);
};

let schemaReady: Promise<unknown> | undefined;
const ensureSchema = () => {
  schemaReady ??= db()`
    CREATE TABLE IF NOT EXISTS battlesnake_registrations (
      id SERIAL PRIMARY KEY,
      tournament TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      dietary_restrictions TEXT NOT NULL DEFAULT '',
      bracket TEXT NOT NULL,
      battlesnake_username TEXT NOT NULL,
      snake_id TEXT NOT NULL,
      snake_name TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE (tournament, email),
      UNIQUE (tournament, snake_id)
    )`.catch((error) => {
    schemaReady = undefined;
    throw error;
  });
  return schemaReady;
};

interface Row {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  dietary_restrictions: string;
  bracket: Bracket;
  battlesnake_username: string;
  snake_id: string;
  snake_name: string;
  created_at: string;
}

const toRegistration = (row: Row): Registration => ({
  id: row.id,
  firstName: row.first_name,
  lastName: row.last_name,
  email: row.email,
  dietaryRestrictions: row.dietary_restrictions,
  bracket: row.bracket,
  createdAt: new Date(row.created_at).toISOString(),
  snake: {
    username: row.battlesnake_username,
    snakeId: row.snake_id,
    snakeName: row.snake_name,
    snakeUrl: `https://arena.battlesnake.com/battlesnakes/${row.snake_id}/profile`,
  },
});

export const countByBracket = async (): Promise<Record<Bracket, number>> => {
  await ensureSchema();
  const rows = (await db()`
    SELECT bracket, count(*)::int AS count FROM battlesnake_registrations
    WHERE tournament = ${TOURNAMENT.id} GROUP BY bracket`) as { bracket: Bracket; count: number }[];
  const counts: Record<Bracket, number> = { student: 0, rookie: 0, veteran: 0 };
  for (const row of rows) if (row.bracket in counts) counts[row.bracket] = row.count;
  return counts;
};

export const listRegistrations = async (): Promise<Registration[]> => {
  await ensureSchema();
  const rows = (await db()`
    SELECT * FROM battlesnake_registrations
    WHERE tournament = ${TOURNAMENT.id} ORDER BY bracket, created_at`) as Row[];
  return rows.map(toRegistration);
};

/**
 * Saves a competitor. Registrations for the tournament are taken one at a time, so a
 * bracket never goes over its spots, and each email and snake can register once.
 */
export const register = async (
  input: RegistrationInput,
  bracket: EventbriteBracket,
): Promise<RegisterResult> => {
  await ensureSchema();
  const sql = db();
  const email = input.email.trim().toLowerCase();
  const limit = Math.max(0, bracket.capacity - bracket.soldOnEventbrite);

  try {
    const [, existing, inserted] = (await sql.transaction([
      sql`SELECT pg_advisory_xact_lock(hashtext(${TOURNAMENT.id}))`,
      sql`SELECT email, snake_id FROM battlesnake_registrations
          WHERE tournament = ${TOURNAMENT.id}
            AND (email = ${email} OR snake_id = ${input.snake.snakeId})`,
      sql`INSERT INTO battlesnake_registrations
            (tournament, first_name, last_name, email, dietary_restrictions, bracket,
             battlesnake_username, snake_id, snake_name)
          SELECT ${TOURNAMENT.id}, ${input.firstName.trim()}, ${input.lastName.trim()}, ${email},
                 ${input.dietaryRestrictions.trim()}, ${input.bracket},
                 ${input.snake.username}, ${input.snake.snakeId}, ${input.snake.snakeName}
          WHERE NOT EXISTS (
                  SELECT 1 FROM battlesnake_registrations
                  WHERE tournament = ${TOURNAMENT.id}
                    AND (email = ${email} OR snake_id = ${input.snake.snakeId}))
            AND (SELECT count(*) FROM battlesnake_registrations
                 WHERE tournament = ${TOURNAMENT.id} AND bracket = ${input.bracket}) < ${limit}
          RETURNING *`,
    ])) as [unknown, Pick<Row, 'email' | 'snake_id'>[], Row[]];

    if (inserted.length) return { ok: true, registration: toRegistration(inserted[0]) };
    if (existing.some((row) => row.email === email)) {
      return {
        ok: false,
        field: 'email',
        error:
          "You're already registered with this email, so there's no need to register again. Need to change something? Ask in #battlesnake on Slack.",
      };
    }
    if (existing.length) {
      return {
        ok: false,
        field: 'snake',
        error: `${input.snake.snakeName} is already registered. Pick another snake.`,
      };
    }
    return {
      ok: false,
      field: 'bracket',
      error: `The ${BRACKETS[input.bracket].label} bracket is full. Pick another bracket, or come watch with a spectator ticket.`,
    };
  } catch (error) {
    if ((error as { code?: string }).code === '23505') {
      return { ok: false, field: 'email', error: 'This email or snake is already registered.' };
    }
    throw error;
  }
};

const csvCell = (value: string) => {
  const safe = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return /[",\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

/** One row per competitor, for organizers to build the brackets. */
export const registrationsCsv = (registrations: Registration[]) =>
  [
    [
      'Bracket',
      'First name',
      'Last name',
      'Email',
      'Dietary restrictions',
      'Battlesnake user',
      'Snake',
      'Snake link',
      'Registered',
    ],
    ...registrations.map((r) => [
      BRACKETS[r.bracket]?.label ?? r.bracket,
      r.firstName,
      r.lastName,
      r.email,
      r.dietaryRestrictions,
      r.snake.username,
      r.snake.snakeName,
      r.snake.snakeUrl,
      r.createdAt,
    ]),
  ]
    .map((row) => row.map(csvCell).join(','))
    .join('\n');
