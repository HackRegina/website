import { describe, expect, test } from 'bun:test';
import { cleanUsername, findSnake, parseProfileSnakes, verifyBattlesnake } from '@/lib/battlesnake';

const PROFILE = `<section class="section"><h2>Battlesnakes</h2><div class="snakes">
<div class="scard"><div class="name"><a href="/battlesnakes/0aa45f39-ecb3-4e19-a03a-3fb732aa2d2c/profile">Amphibious Arthur</a></div></div>
<div class="scard"><div class="name"><a href="/battlesnakes/a0389d07-cfd6-45ae-a9f5-2bf7ec83ce68/profile">Bob &amp; Co</a></div></div>
</div></section>`;

const respond =
  (status: number, body = '') =>
  async () =>
    new Response(body, { status });

describe('parseProfileSnakes', () => {
  test('reads each snake link on a profile page', () => {
    expect(parseProfileSnakes(PROFILE)).toEqual([
      { id: '0aa45f39-ecb3-4e19-a03a-3fb732aa2d2c', name: 'Amphibious Arthur' },
      { id: 'a0389d07-cfd6-45ae-a9f5-2bf7ec83ce68', name: 'Bob & Co' },
    ]);
  });
});

describe('findSnake', () => {
  const snakes = parseProfileSnakes(PROFILE);
  test('matches a name regardless of case and spacing', () => {
    expect(findSnake(snakes, '  amphibious   ARTHUR ')?.id).toBe(
      '0aa45f39-ecb3-4e19-a03a-3fb732aa2d2c',
    );
  });
  test('matches a pasted profile link', () => {
    expect(
      findSnake(
        snakes,
        'https://arena.battlesnake.com/battlesnakes/a0389d07-cfd6-45ae-a9f5-2bf7ec83ce68/profile',
      )?.name,
    ).toBe('Bob & Co');
  });
  test('returns undefined for another snake', () => {
    expect(findSnake(snakes, 'Constant Carter')).toBeUndefined();
  });
});

describe('cleanUsername', () => {
  test('accepts a pasted profile link or @handle', () => {
    expect(cleanUsername('https://arena.battlesnake.com/users/coreyja')).toBe('coreyja');
    expect(cleanUsername('@coreyja ')).toBe('coreyja');
  });
});

describe('verifyBattlesnake', () => {
  test('verifies an existing account and snake', async () => {
    const result = await verifyBattlesnake('coreyja', 'Amphibious Arthur', respond(200, PROFILE));
    expect(result).toEqual({
      ok: true,
      snake: {
        username: 'coreyja',
        snakeId: '0aa45f39-ecb3-4e19-a03a-3fb732aa2d2c',
        snakeName: 'Amphibious Arthur',
        snakeUrl:
          'https://arena.battlesnake.com/battlesnakes/0aa45f39-ecb3-4e19-a03a-3fb732aa2d2c/profile',
      },
    });
  });
  test('rejects an account that does not exist', async () => {
    const result = await verifyBattlesnake('nobody', 'Arthur', respond(404));
    expect(result.ok).toBe(false);
    expect(!result.ok && result.field).toBe('username');
  });
  test('rejects a snake the account does not own', async () => {
    const result = await verifyBattlesnake('coreyja', 'Someone Else', respond(200, PROFILE));
    expect(!result.ok && result.field).toBe('snake');
  });
  test('rejects a malformed username without calling the site', async () => {
    let called = false;
    const result = await verifyBattlesnake('bad name/../x', 'Arthur', async () => {
      called = true;
      return new Response('');
    });
    expect(result.ok).toBe(false);
    expect(called).toBe(false);
  });
});
