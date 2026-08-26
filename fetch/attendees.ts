import { eventbriteGet } from '@/fetch/eventbrite';

interface EventbriteAttendee {
  id: string;
  created: string;
  status: string;
  ticket_class_name?: string;
  checked_in?: boolean;
  cancelled?: boolean;
  refunded?: boolean;
  profile?: { name?: string | null; email?: string | null };
  event_id?: string;
}

interface EventbriteAttendeesPage {
  attendees?: EventbriteAttendee[];
  pagination?: { continuation?: string; has_more_items?: boolean };
}

export interface IAttendee {
  id: string;
  name: string | null;
  email: string | null;
  ticketClassName: string | null;
  status: string;
  checkedIn: boolean;
  cancelled: boolean;
  refunded: boolean;
  createdAt: string;
  eventId: string;
}

const MAX_PAGES = 40;

export const isEventbriteNotFound = (error: unknown): boolean =>
  error instanceof Error && error.message.startsWith('Eventbrite API error 404');

export const fetchAttendeesForEvent = async (eventId: string): Promise<IAttendee[]> => {
  const attendees: IAttendee[] = [];
  let continuation: string | undefined;
  for (let page = 0; page < MAX_PAGES; page++) {
    let data: EventbriteAttendeesPage;
    try {
      data = await eventbriteGet<EventbriteAttendeesPage>(
        `/events/${eventId}/attendees/`,
        continuation ? { continuation } : {},
      );
    } catch (error) {
      if (isEventbriteNotFound(error)) return attendees;
      throw error;
    }
    for (const attendee of data.attendees ?? []) {
      attendees.push({
        id: attendee.id,
        name: attendee.profile?.name ?? null,
        email: attendee.profile?.email ?? null,
        ticketClassName: attendee.ticket_class_name ?? null,
        status: attendee.status,
        checkedIn: !!attendee.checked_in,
        cancelled: !!attendee.cancelled,
        refunded: !!attendee.refunded,
        createdAt: attendee.created,
        eventId: attendee.event_id ?? eventId,
      });
    }
    if (!data.pagination?.has_more_items || !data.pagination.continuation) break;
    continuation = data.pagination.continuation;
  }
  return attendees;
};
