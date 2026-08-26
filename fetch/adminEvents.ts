import { DateTime } from 'luxon';
import { eventbriteGet, ORG_ID } from '@/fetch/eventbrite';

interface EventbriteTicketClass {
  quantity_total?: number;
  quantity_sold?: number;
}

interface EventbriteAdminEvent {
  id: string;
  status: string;
  name: { text: string | null };
  url?: string;
  start: { local: string; timezone: string };
  end: { local: string; timezone: string };
  logo?: { url: string } | null;
  venue?: { name: string | null } | null;
  ticket_classes?: EventbriteTicketClass[];
}

export interface IAdminEvent {
  id: string;
  name: string;
  status: string;
  start: number;
  end: number;
  url: string | null;
  imageUrl: string | null;
  venueName: string | null;
  capacity: number | null;
  sold: number | null;
}

const toAdminEvent = (event: EventbriteAdminEvent): IAdminEvent => {
  const ticketClasses = event.ticket_classes ?? [];
  const hasTickets = ticketClasses.length > 0;
  return {
    id: event.id,
    name: event.name?.text ?? 'Untitled event',
    status: event.status,
    start: DateTime.fromISO(event.start.local, { zone: event.start.timezone }).toMillis(),
    end: DateTime.fromISO(event.end.local, { zone: event.end.timezone }).toMillis(),
    url: event.url ?? null,
    imageUrl: event.logo?.url ?? null,
    venueName: event.venue?.name ?? null,
    capacity: hasTickets
      ? ticketClasses.reduce((sum, tc) => sum + (tc.quantity_total ?? 0), 0)
      : null,
    sold: hasTickets ? ticketClasses.reduce((sum, tc) => sum + (tc.quantity_sold ?? 0), 0) : null,
  };
};

export const fetchAdminEvents = async (): Promise<IAdminEvent[]> => {
  const { events = [] } = await eventbriteGet<{ events?: EventbriteAdminEvent[] }>(
    `/organizations/${ORG_ID}/events/`,
    {
      time_filter: 'current_future',
      order_by: 'start_asc',
      page_size: '50',
      expand: 'ticket_classes,venue',
    },
  );
  return events.map(toAdminEvent);
};

export const fetchAdminEventById = async (id: string): Promise<IAdminEvent> => {
  const event = await eventbriteGet<EventbriteAdminEvent>(`/events/${id}/`, {
    expand: 'ticket_classes,venue',
  });
  return toAdminEvent(event);
};
