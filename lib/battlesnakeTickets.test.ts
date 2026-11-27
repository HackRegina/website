import { describe, expect, test } from 'bun:test';
import {
  accessCodeFor,
  checkoutUrl,
  eventDateLabel,
  isBracket,
  matchCompetitor,
  spectatorStatuses,
  venueLabel,
} from '@/lib/battlesnakeTickets';

describe('accessCodeFor', () => {
  test('names the player and snake so Eventbrite reports show them', () => {
    expect(accessCodeFor({ username: 'coreyja', snakeName: 'Amphibious Arthur' })).toBe(
      'COREYJA-AMPHIBIOUS-ARTHUR',
    );
  });
  test('keeps codes to letters, numbers and dashes', () => {
    expect(accessCodeFor({ username: 'joe.todes_99', snakeName: 'Snek #2 (beta)!' })).toBe(
      'JOE-TODES-99-SNEK-2-BETA',
    );
  });
  test('caps long names', () => {
    const code = accessCodeFor({ username: 'a'.repeat(40), snakeName: 'b'.repeat(40) });
    expect(code.length).toBeLessThanOrEqual(45);
  });
});

describe('checkoutUrl', () => {
  test('applies the code on the Eventbrite page', () => {
    expect(checkoutUrl('COREYJA-AMPHIBIOUS-ARTHUR')).toBe(
      'https://www.eventbrite.ca/e/battlesnake-tickets-1987198013753?discount=COREYJA-AMPHIBIOUS-ARTHUR',
    );
  });
});

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

describe('spectatorStatuses', () => {
  test('lists the spectator tickets that exist, with spots left', () => {
    expect(
      spectatorStatuses([
        { id: '1', name: 'Spectator', quantity_total: 12, quantity_sold: 5 },
        { id: '2', name: 'Rookie Participant', quantity_total: 16, quantity_sold: 1 },
      ]),
    ).toEqual([{ id: 'inPerson', label: 'In person', ticketClassName: 'Spectator', remaining: 7 }]);
  });
  test('shows a sold-out ticket as full', () => {
    expect(
      spectatorStatuses([
        { id: '3', name: 'Virtual Spectator', quantity_total: 50, quantity_sold: 50 },
      ])[0].remaining,
    ).toBe(0);
  });
});

describe('eventDateLabel', () => {
  const zone = 'America/Regina';
  test('reads the time from Eventbrite in the event time zone', () => {
    expect(
      eventDateLabel(
        { local: '2026-12-02T17:00:00', timezone: zone },
        { local: '2026-12-02T21:00:00', timezone: zone },
      ),
    ).toBe('Wednesday, December 2, 2026 · 5 to 9 PM');
  });
  test('shows minutes and both halves of the day when needed', () => {
    expect(
      eventDateLabel(
        { local: '2026-12-02T11:30:00', timezone: zone },
        { local: '2026-12-02T13:00:00', timezone: zone },
      ),
    ).toBe('Wednesday, December 2, 2026 · 11:30 AM to 1 PM');
  });
});

describe('venueLabel', () => {
  test('joins the venue name and address', () => {
    expect(
      venueLabel({
        name: 'Cultivator',
        address: { address_1: '2375 College Ave', city: 'Regina' },
      }),
    ).toBe('Cultivator, 2375 College Ave, Regina');
  });
});
