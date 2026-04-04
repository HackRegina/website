import type { DateTime } from 'luxon';
import {
  getFirstWednesday,
  getLastTuesday,
  getSecondFriday,
  getTuesdayBeforeChristmas,
} from './dates';
import { EVENT_TEMPLATES, type EventTemplate, type EventType } from './templates';

export interface PlannedEvent {
  type: EventType;
  template: EventTemplate;
  date: DateTime;
  displayName: string;
}

export function generateEvents(): PlannedEvent[] {
  const events: PlannedEvent[] = [];

  // Apr 2026 through Mar 2027
  const fiscalMonths = [
    ...Array.from({ length: 9 }, (_, i) => ({ year: 2026, month: i + 4 })),
    ...Array.from({ length: 3 }, (_, i) => ({ year: 2027, month: i + 1 })),
  ];

  const lunchMonths = new Set([5, 7, 9, 11, 1, 3]);

  let codeTogetherIndex = 0;
  for (const { year, month } of fiscalMonths) {
    const isDecember = month === 12 && year === 2026;
    const codeDate = isDecember ? getTuesdayBeforeChristmas(year) : getLastTuesday(year, month);

    const isBeerAndCode = codeTogetherIndex % 2 === 1 && !isDecember;
    const type: EventType = isBeerAndCode ? 'beerAndCode' : 'codeTogether';
    const template = EVENT_TEMPLATES[type];

    events.push({ type, template, date: codeDate, displayName: template.name });
    codeTogetherIndex++;

    if (lunchMonths.has(month)) {
      events.push({
        type: 'lunchAndLearn',
        template: EVENT_TEMPLATES.lunchAndLearn,
        date: getSecondFriday(year, month),
        displayName: 'Lunch & Learn',
      });
    }

    if (isDecember) {
      events.push({
        type: 'battlesnake',
        template: EVENT_TEMPLATES.battlesnake,
        date: getFirstWednesday(year, month),
        displayName: 'Battlesnake',
      });
    }
  }

  return events.sort((a, b) => a.date.toMillis() - b.date.toMillis());
}
