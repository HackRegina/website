import { describe, expect, test } from 'bun:test';
import { confirmationEmail } from '@/lib/battlesnakeEmail';
import {
  bracketStatuses,
  type Registration,
  registrationsCsv,
} from '@/lib/battlesnakeRegistrations';

const registration: Registration = {
  id: 1,
  firstName: 'Sam',
  lastName: 'Lee',
  email: 'sam@example.com',
  dietaryRestrictions: 'Vegetarian, no nuts',
  bracket: 'rookie',
  createdAt: '2026-11-25T01:00:00.000Z',
  snake: {
    username: 'samlee',
    snakeId: '00000000-0000-0000-0000-000000000001',
    snakeName: 'Noodle <3',
    snakeUrl:
      'https://arena.battlesnake.com/battlesnakes/00000000-0000-0000-0000-000000000001/profile',
  },
};

describe('bracketStatuses', () => {
  test('counts Eventbrite sales and site registrations against the spots', () => {
    expect(
      bracketStatuses(
        [
          { id: 'student', label: 'Student', capacity: 16, soldOnEventbrite: 5 },
          { id: 'rookie', label: 'Rookie', capacity: 16, soldOnEventbrite: 15 },
        ],
        { student: 3, rookie: 4 },
      ),
    ).toEqual([
      { id: 'student', label: 'Student', capacity: 16, remaining: 8 },
      { id: 'rookie', label: 'Rookie', capacity: 16, remaining: 0 },
    ]);
  });
});

describe('registrationsCsv', () => {
  test('quotes commas and neutralises spreadsheet formulas', () => {
    const csv = registrationsCsv([{ ...registration, lastName: '=HYPERLINK("x")' }]);
    const [header, row] = csv.split('\n');
    expect(header.startsWith('Bracket,First name,Last name,Email')).toBe(true);
    expect(row).toContain('Rookie,Sam,"\'=HYPERLINK(""x"")",sam@example.com,"Vegetarian, no nuts"');
  });
});

describe('confirmationEmail', () => {
  test('names the bracket and snake, and escapes HTML', () => {
    const email = confirmationEmail(registration);
    expect(email.subject).toBe("You're registered for Battlesnake 2026");
    expect(email.text).toContain('in the Rookie bracket with Noodle <3 (samlee)');
    expect(email.html).toContain('Noodle &#60;3</a>');
    expect(email.html).not.toContain('Noodle <3');
  });
});
