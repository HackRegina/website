import { describe, expect, test } from 'bun:test';
import { agendaFor, EVENT_TEMPLATES } from './templates';

describe('agendaFor', () => {
  test('starts the Battlesnake agenda when the event starts', () => {
    const { startHour, agenda } = EVENT_TEMPLATES.battlesnake;
    const slots = agendaFor(startHour, agenda);
    expect(slots[0]).toMatchObject({ title: 'Doors Open', startTime: '17:00', endTime: '17:45' });
    expect(slots.at(-1)?.endTime).toBe('20:30');
  });
});
