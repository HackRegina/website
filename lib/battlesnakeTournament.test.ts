import { describe, expect, test } from 'bun:test';
import { isBracket, matchCompetitor } from '@/lib/battlesnakeTournament';

describe('isBracket', () => {
  test('accepts only the three competitor brackets', () => {
    expect(isBracket('rookie')).toBe(true);
    expect(isBracket('spectator')).toBe(false);
    expect(isBracket('toString')).toBe(false);
  });
});

describe('matchCompetitor', () => {
  const attendee = (overrides: Partial<Parameters<typeof matchCompetitor>[0][number]>) => ({
    email: 'sam@example.com',
    ticketClassName: 'Rookie Participant',
    cancelled: false,
    refunded: false,
    ...overrides,
  });

  test('finds an existing competitor ticket regardless of email case', () => {
    expect(matchCompetitor([attendee({})], ' Sam@Example.com ')).toEqual({
      bracketLabel: 'Rookie',
    });
  });
  test('lets spectators register to compete', () => {
    expect(
      matchCompetitor([attendee({ ticketClassName: 'Spectator' })], 'sam@example.com'),
    ).toBeUndefined();
  });
  test('ignores cancelled or refunded tickets', () => {
    expect(
      matchCompetitor(
        [attendee({ cancelled: true }), attendee({ refunded: true })],
        'sam@example.com',
      ),
    ).toBeUndefined();
  });
  test('ignores other people', () => {
    expect(matchCompetitor([attendee({})], 'alex@example.com')).toBeUndefined();
  });
});
