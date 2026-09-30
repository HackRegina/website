import { describe, expect, test } from 'bun:test';
import {
  cancelledAttendee,
  checkedInAttendee,
  loyalAttendee,
  newAttendee,
} from '@/utils/attendeeFixtures';
import { buildEventStats, sortByShowUpChance, toEventStats } from '@/utils/eventStats';
import { type AttendanceHistory, expectedTurnout } from '@/utils/showUpProbability';

const attendees = [checkedInAttendee, loyalAttendee, newAttendee, cancelledAttendee];

const history: AttendanceHistory = {
  byEmail: {
    'a@example.com': { registrations: 3, checkins: 1 },
    'b@example.com': { registrations: 3, checkins: 3 },
  },
  totals: { registrations: 6, checkins: 4 },
  eventsConsidered: 3,
  generatedAt: 0,
};

const idsOf = (sorted: { id: string }[]) => sorted.map((attendee) => attendee.id);

describe('buildEventStats', () => {
  const { summary, turnout, predictions } = buildEventStats(attendees, history);

  test('counts active attendees', () => {
    expect(summary).toEqual({ registered: 3, checkedIn: 1 });
  });

  test('predicts only active attendees', () => {
    expect(Object.keys(predictions).sort()).toEqual(['a', 'b', 'c']);
  });

  test('treats checked-in attendees as certain', () => {
    expect(predictions.a.probability).toBe(1);
  });

  test('ranks loyal attendees above newcomers', () => {
    expect(predictions.b.probability).toBeGreaterThan(predictions.c.probability);
    expect(predictions.b).toMatchObject({ isNew: false, pastRegistrations: 3, pastCheckins: 3 });
    expect(predictions.c).toMatchObject({ isNew: true, pastRegistrations: 0, pastCheckins: 0 });
  });

  test('forecasts turnout from the active predictions', () => {
    expect(turnout.baseRate).toBeCloseTo(4 / 6);
    expect(turnout.eventsConsidered).toBe(3);
    expect(turnout.expected).toBe(
      expectedTurnout([1, predictions.b.probability, predictions.c.probability]),
    );
  });
});

describe('sortByShowUpChance', () => {
  test('orders by registration with cancellations last until predictions arrive', () => {
    expect(idsOf(sortByShowUpChance(attendees, null))).toEqual(['c', 'b', 'a', 'd']);
  });

  test('orders by show-up chance with cancellations last once predicted', () => {
    const { predictions } = toEventStats(buildEventStats(attendees, history));
    expect(idsOf(sortByShowUpChance(attendees, predictions))).toEqual(['a', 'b', 'c', 'd']);
  });
});
