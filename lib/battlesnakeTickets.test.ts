import { describe, expect, test } from 'bun:test';
import { accessCodeFor, checkoutUrl, isBracket } from '@/lib/battlesnakeTickets';

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
