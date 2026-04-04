import { DateTime } from 'luxon';
import { TIMEZONE } from './templates';

export function getLastTuesday(year: number, month: number): DateTime {
  const endOfMonth = DateTime.fromObject({ year, month }, { zone: TIMEZONE }).endOf('month');
  const diff = (endOfMonth.weekday - 2 + 7) % 7;
  return endOfMonth.minus({ days: diff }).startOf('day');
}

export function getTuesdayBeforeChristmas(year: number): DateTime {
  const christmas = DateTime.fromObject({ year, month: 12, day: 25 }, { zone: TIMEZONE });
  const diff = (christmas.weekday - 2 + 7) % 7 || 7;
  return christmas.minus({ days: diff }).startOf('day');
}

export function getSecondFriday(year: number, month: number): DateTime {
  const firstOfMonth = DateTime.fromObject({ year, month, day: 1 }, { zone: TIMEZONE });
  const daysToFriday = (5 - firstOfMonth.weekday + 7) % 7;
  return firstOfMonth.plus({ days: daysToFriday }).plus({ weeks: 1 }).startOf('day');
}

export function getFirstWednesday(year: number, month: number): DateTime {
  const firstOfMonth = DateTime.fromObject({ year, month, day: 1 }, { zone: TIMEZONE });
  const daysToWednesday = (3 - firstOfMonth.weekday + 7) % 7;
  return firstOfMonth.plus({ days: daysToWednesday }).startOf('day');
}
