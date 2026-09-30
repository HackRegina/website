import type { IAttendee } from '@/fetch/attendees';

export const attendee = (overrides: Partial<IAttendee> & Pick<IAttendee, 'id'>): IAttendee => ({
  name: null,
  email: null,
  ticketClassName: null,
  status: 'Attending',
  checkedIn: false,
  cancelled: false,
  refunded: false,
  createdAt: '2026-01-01T00:00:00Z',
  eventId: 'event-1',
  ...overrides,
});

export const checkedInAttendee = attendee({
  id: 'a',
  email: 'a@example.com',
  checkedIn: true,
  createdAt: '2026-01-04T00:00:00Z',
});

export const loyalAttendee = attendee({
  id: 'b',
  email: 'b@example.com',
  createdAt: '2026-01-03T00:00:00Z',
});

export const newAttendee = attendee({
  id: 'c',
  email: 'c@example.com',
  createdAt: '2026-01-02T00:00:00Z',
});

export const cancelledAttendee = attendee({
  id: 'd',
  email: 'd@example.com',
  cancelled: true,
  createdAt: '2026-01-01T00:00:00Z',
});
