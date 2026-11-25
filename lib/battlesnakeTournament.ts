import { fetchAttendeesForEvent, type IAttendee } from '@/fetch/attendees';
import { eventbriteGet } from '@/fetch/eventbrite';

/**
 * This year's tournament. Competitors register on this site, and their registrations
 * are saved in the site's database. Eventbrite only sells spectator tickets, plus the
 * competitor tickets bought there before this page existed, which still count
 * toward each bracket's spots.
 */
export const TOURNAMENT = {
  id: 'battlesnake-2026',
  eventId: '1987198013753',
  eventUrl: 'https://www.eventbrite.ca/e/battlesnake-tickets-1987198013753',
  name: 'Battlesnake 2026',
  dateLabel: 'Wednesday, December 2, 2026 · 5 to 9 PM',
  venue: 'Cultivator, 2375 College Ave, Regina',
};

export const BRACKETS = {
  student: { label: 'Student', ticketClassName: 'Student Participant' },
  rookie: { label: 'Rookie', ticketClassName: 'Rookie Participant' },
  veteran: { label: 'Veteran', ticketClassName: 'Veteran Participant' },
} as const;

export type Bracket = keyof typeof BRACKETS;

export const isBracket = (value: unknown): value is Bracket =>
  typeof value === 'string' && Object.hasOwn(BRACKETS, value);

interface EventbriteTicketClass {
  id: string;
  name: string;
  quantity_total?: number;
  quantity_sold?: number;
  on_sale_status?: string;
}

export interface EventbriteBracket {
  id: Bracket;
  label: string;
  /** Spots set on the Eventbrite ticket. */
  capacity: number;
  /** Competitor tickets already sold on Eventbrite. */
  soldOnEventbrite: number;
}

/** Reads each bracket's spots and earlier Eventbrite sales from its ticket. */
export const fetchEventbriteBrackets = async (): Promise<EventbriteBracket[]> => {
  const { ticket_classes = [] } = await eventbriteGet<{ ticket_classes?: EventbriteTicketClass[] }>(
    `/events/${TOURNAMENT.eventId}/ticket_classes/`,
  );
  return Object.entries(BRACKETS).flatMap(([id, bracket]) => {
    const ticketClass = ticket_classes.find((tc) => tc.name === bracket.ticketClassName);
    if (!ticketClass) return [];
    return [
      {
        id: id as Bracket,
        label: bracket.label,
        capacity: ticketClass.quantity_total ?? 0,
        soldOnEventbrite: ticketClass.quantity_sold ?? 0,
      },
    ];
  });
};

const COMPETITOR_TICKETS = new Map<string, string>(
  Object.values(BRACKETS).map((b) => [b.ticketClassName, b.label]),
);

/**
 * Finds an active competitor ticket bought on Eventbrite under this email, from before
 * competitors registered on this site.
 */
export const matchCompetitor = (
  attendees: Pick<IAttendee, 'email' | 'ticketClassName' | 'cancelled' | 'refunded'>[],
  email: string,
): { bracketLabel: string } | undefined => {
  const wanted = email.trim().toLowerCase();
  const match = attendees.find(
    (a) =>
      !a.cancelled &&
      !a.refunded &&
      a.email?.trim().toLowerCase() === wanted &&
      a.ticketClassName !== null &&
      COMPETITOR_TICKETS.has(a.ticketClassName),
  );
  return match?.ticketClassName
    ? { bracketLabel: COMPETITOR_TICKETS.get(match.ticketClassName) ?? match.ticketClassName }
    : undefined;
};

export const findExistingCompetitor = async (email: string) =>
  matchCompetitor(await fetchAttendeesForEvent(TOURNAMENT.eventId), email);
