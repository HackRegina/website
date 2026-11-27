export const ARENA_BASE = 'https://arena.battlesnake.com';

const USERNAME_PATTERN = /^[A-Za-z0-9_.-]{1,64}$/;
const UUID_PATTERN = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
const SNAKE_LINK_PATTERN =
  /<a href="\/battlesnakes\/([0-9a-f-]{36})\/profile"[^>]*>([\s\S]*?)<\/a>/gi;

export interface ArenaSnake {
  id: string;
  name: string;
}

export interface VerifiedBattlesnake {
  username: string;
  snakeId: string;
  snakeName: string;
  snakeUrl: string;
}

export type BattlesnakeCheck =
  | { ok: true; snake: VerifiedBattlesnake }
  | { ok: false; field: 'username' | 'snake'; error: string };

const decodeEntities = (text: string) =>
  text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'");

const normalize = (text: string) => text.trim().replace(/\s+/g, ' ').toLowerCase();

/** Pulls the snakes listed on an arena.battlesnake.com profile page. */
export const parseProfileSnakes = (html: string): ArenaSnake[] => {
  const snakes = new Map<string, ArenaSnake>();
  for (const [, id, inner] of html.matchAll(SNAKE_LINK_PATTERN)) {
    const name = decodeEntities(inner.replace(/<[^>]*>/g, '')).trim();
    if (name && !snakes.has(id)) snakes.set(id, { id: id.toLowerCase(), name });
  }
  return [...snakes.values()];
};

/** Accepts a snake name, a snake ID, or a link to the snake's profile page. */
export const findSnake = (snakes: ArenaSnake[], input: string): ArenaSnake | undefined => {
  const id = input.match(UUID_PATTERN)?.[0]?.toLowerCase();
  if (id) return snakes.find((snake) => snake.id === id);
  const wanted = normalize(input);
  return snakes.find((snake) => normalize(snake.name) === wanted);
};

export const cleanUsername = (input: string) =>
  input
    .trim()
    .replace(/^https?:\/\/[^/]+\/users\//i, '')
    .replace(/^@/, '')
    .replace(/\/.*$/, '');

type Fetcher = (url: string) => Promise<Response>;
const defaultFetcher: Fetcher = (url) => fetch(url, { cache: 'no-store' });

export type ProfileLookup =
  | { ok: true; username: string; snakes: ArenaSnake[] }
  | { ok: false; field: 'username'; error: string };

/** Looks up a player on arena.battlesnake.com and lists their public snakes. */
export const fetchProfileSnakes = async (
  usernameInput: string,
  fetcher: Fetcher = defaultFetcher,
): Promise<ProfileLookup> => {
  const username = cleanUsername(usernameInput);
  if (!USERNAME_PATTERN.test(username)) {
    return { ok: false, field: 'username', error: 'Enter your Battlesnake username.' };
  }
  const res = await fetcher(`${ARENA_BASE}/users/${encodeURIComponent(username)}`);
  if (res.status === 404) {
    return {
      ok: false,
      field: 'username',
      error: `We couldn't find "${username}" on arena.battlesnake.com. If your account is on play.battlesnake.com, move it to arena.battlesnake.com first.`,
    };
  }
  if (!res.ok) throw new Error(`Battlesnake profile lookup failed with ${res.status}`);
  return { ok: true, username, snakes: parseProfileSnakes(await res.text()) };
};

/**
 * Checks that a Battlesnake account exists on arena.battlesnake.com and that the
 * snake is one of its public snakes. The snake doesn't need to be running.
 */
export const verifyBattlesnake = async (
  usernameInput: string,
  snakeInput: string,
  fetcher: Fetcher = defaultFetcher,
): Promise<BattlesnakeCheck> => {
  if (!snakeInput.trim()) {
    return { ok: false, field: 'snake', error: 'Pick the snake you will compete with.' };
  }
  const profile = await fetchProfileSnakes(usernameInput, fetcher);
  if (!profile.ok) return profile;
  const { username, snakes } = profile;

  const snake = findSnake(snakes, snakeInput);
  if (!snake) {
    return {
      ok: false,
      field: 'snake',
      error: snakes.length
        ? `"${snakeInput.trim()}" isn't one of ${username}'s public snakes.`
        : `${username} has no public snakes yet. Create one at arena.battlesnake.com (it doesn't need to work yet), then try again.`,
    };
  }

  return {
    ok: true,
    snake: {
      username,
      snakeId: snake.id,
      snakeName: snake.name,
      snakeUrl: `${ARENA_BASE}/battlesnakes/${snake.id}/profile`,
    },
  };
};
