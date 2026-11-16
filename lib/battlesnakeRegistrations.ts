import { neon } from '@neondatabase/serverless';
import type { VerifiedBattlesnake } from '@/lib/battlesnake';

export const BRACKETS = {
  student: { label: 'Student', capacity: 16 },
  rookie: { label: 'Rookie', capacity: 16 },
  veteran: { label: 'Veteran', capacity: 16 },
} as const;

export type Bracket = keyof typeof BRACKETS;

/** The tournament these registrations belong to. Change it for next year's event. */
export const TOURNAMENT = {
  id: 'battlesnake-2026',
  name: 'Battlesnake 2026',
  dateLabel: 'Wednesday, December 2, 2026 · 5 to 9 PM',
  venue: 'Cultivator, 2375 College Ave, Regina',
  closesAt: '2026-12-02T12:00:00-06:00',
};

export interface RegistrationInput {
  name: string;
  email: string;
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

export const isBracket = (value: unknown): value is Bracket =>
  typeof value === 'string' && value in BRACKETS;

const sql = () => {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is required for Battlesnake registrations');
  return neon(url);
};

let schemaReady: Promise<unknown> | undefined;
const ensureSchema = () => {
  schemaReady ??= sql()`
    CREATE TABLE IF NOT EXISTS battlesnake_registrations (
      id SERIAL PRIMARY KEY,
      tournament TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      bracket TEXT NOT NULL,
      battlesnake_username TEXT NOT NULL,
      snake_id TEXT NOT NULL,
      snake_name TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE (tournament, email),
      UNIQUE (tournament, snake_id)
    )`;
  return schemaReady;
};

interface Row {
  id: number;
  name: string;
  email: string;
  bracket: Bracket;
  battlesnake_username: string;
  snake_id: string;
  snake_name: string;
  created_at: string;
}

const toRegistration = (row: Row): Registration => ({
  id: row.id,
  name: row.name,
  email: row.email,
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
  const rows = (await sql()`
    SELECT bracket, count(*)::int AS count FROM battlesnake_registrations
    WHERE tournament = ${TOURNAMENT.id} GROUP BY bracket`) as { bracket: Bracket; count: number }[];
  const counts = { student: 0, rookie: 0, veteran: 0 };
  for (const row of rows) if (isBracket(row.bracket)) counts[row.bracket] = row.count;
  return counts;
};

export const listRegistrations = async (): Promise<Registration[]> => {
  await ensureSchema();
  const rows = (await sql()`
    SELECT * FROM battlesnake_registrations
    WHERE tournament = ${TOURNAMENT.id} ORDER BY bracket, created_at`) as Row[];
  return rows.map(toRegistration);
};

/** Saves a reservation. The insert only succeeds while the bracket still has room. */
export const register = async (input: RegistrationInput): Promise<RegisterResult> => {
  await ensureSchema();
  const email = input.email.trim().toLowerCase();
  const { capacity, label } = BRACKETS[input.bracket];

  const existing = (await sql()`
    SELECT email, snake_id FROM battlesnake_registrations
    WHERE tournament = ${TOURNAMENT.id}
      AND (email = ${email} OR snake_id = ${input.snake.snakeId})`) as Pick<
    Row,
    'email' | 'snake_id'
  >[];
  if (existing.some((row) => row.email === email)) {
    return {
      ok: false,
      field: 'email',
      error: 'This email is already registered for the tournament.',
    };
  }
  if (existing.length) {
    return { ok: false, field: 'snake', error: `${input.snake.snakeName} is already registered.` };
  }

  try {
    const rows = (await sql()`
      INSERT INTO battlesnake_registrations
        (tournament, name, email, bracket, battlesnake_username, snake_id, snake_name)
      SELECT ${TOURNAMENT.id}, ${input.name.trim()}, ${email}, ${input.bracket},
             ${input.snake.username}, ${input.snake.snakeId}, ${input.snake.snakeName}
      WHERE (SELECT count(*) FROM battlesnake_registrations
             WHERE tournament = ${TOURNAMENT.id} AND bracket = ${input.bracket}) < ${capacity}
      RETURNING *`) as Row[];
    if (!rows.length) {
      return {
        ok: false,
        field: 'bracket',
        error: `The ${label} bracket is full. Join the waitlist on Eventbrite or pick another bracket.`,
      };
    }
    return { ok: true, registration: toRegistration(rows[0]) };
  } catch (error) {
    if ((error as { code?: string }).code === '23505') {
      return { ok: false, field: 'email', error: 'This email or snake is already registered.' };
    }
    throw error;
  }
};
