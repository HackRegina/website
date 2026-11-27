import { DateTime } from 'luxon';
import { fetchAttendeesForEvent, type IAttendee } from '@/fetch/attendees';
import { eventbriteGet, eventbritePost, ORG_ID } from '@/fetch/eventbrite';
import type { VerifiedBattlesnake } from '@/lib/battlesnake';

/**
 * The Eventbrite event for this year's tournament. Nothing is stored on this site:
 * every registration is an Eventbrite order. Competitor tickets are hidden on
 * Eventbrite and unlocked by a one-use access code that this site creates after it
 * verifies the player's snake. The code names the player and snake, so Eventbrite's
 * order and attendee reports show which snake each competitor registered.
 */
export const TOURNAMENT = {
  eventId: '1987198013753',
  eventUrl: 'https://www.eventbrite.ca/e/battlesnake-tickets-1987198013753',
};

interface EventbriteTime {
  local: string;
  timezone: string;
}

interface EventbriteEventDetails {
  name?: { text?: string };
  start: EventbriteTime;
  end: EventbriteTime;
  venue?: { name?: string; address?: { address_1?: string; city?: string } } | null;
}

const clockLabel = (time: DateTime) =>
  time.toFormat(time.minute ? 'h:mm' : 'h').concat(time.hour < 12 ? ' AM' : ' PM');

/** e.g. "Wednesday, December 2, 2026 · 5 to 9 PM", in the event's own time zone. */
export const eventDateLabel = (start: EventbriteTime, end: EventbriteTime) => {
  const from = DateTime.fromISO(start.local, { zone: start.timezone });
  const to = DateTime.fromISO(end.local, { zone: end.timezone });
  const sameHalf = from.hour < 12 === to.hour < 12;
  const fromLabel = sameHalf ? clockLabel(from).replace(/ [AP]M$/, '') : clockLabel(from);
  return `${from.toFormat('cccc, LLLL d, yyyy')} · ${fromLabel} to ${clockLabel(to)}`;
};

export const venueLabel = (venue: EventbriteEventDetails['venue']) =>
  [venue?.name, venue?.address?.address_1, venue?.address?.city].filter(Boolean).join(', ');

/** The tournament's name, time and venue, read from Eventbrite so they never drift. */
export const fetchTournament = async () => {
  const event = await eventbriteGet<EventbriteEventDetails>(`/events/${TOURNAMENT.eventId}/`, {
    expand: 'venue',
  });
  return {
    ...TOURNAMENT,
    name: event.name?.text ?? 'Battlesnake',
    dateLabel: eventDateLabel(event.start, event.end),
    venue: venueLabel(event.venue),
  };
};

export const BRACKETS = {
  student: { label: 'Student', ticketClassName: 'Student Participant' },
  rookie: { label: 'Rookie', ticketClassName: 'Rookie Participant' },
  veteran: { label: 'Veteran', ticketClassName: 'Veteran Participant' },
} as const;

export type Bracket = keyof typeof BRACKETS;

/** Spectator tickets stay public on Eventbrite, so they need no access code. */
export const SPECTATOR_TICKETS = {
  inPerson: { label: 'In person', ticketClassName: 'Spectator' },
  virtual: { label: 'Virtual', ticketClassName: 'Virtual Spectator' },
} as const;

export type SpectatorTicket = keyof typeof SPECTATOR_TICKETS;

export const isBracket = (value: unknown): value is Bracket =>
  typeof value === 'string' && Object.hasOwn(BRACKETS, value);

export interface EventbriteTicketClass {
  id: string;
  name: string;
  quantity_total?: number;
  quantity_sold?: number;
  on_sale_status?: string;
}

interface EventbriteDiscount {
  id: string;
  code: string;
  type: string;
  ticket_class_ids?: string[];
  quantity_sold?: number;
}

export interface BracketStatus {
  id: Bracket;
  label: string;
  ticketClassId: string;
  capacity: number;
  remaining: number;
}

const fetchTicketClasses = async () => {
  const { ticket_classes = [] } = await eventbriteGet<{ ticket_classes?: EventbriteTicketClass[] }>(
    `/events/${TOURNAMENT.eventId}/ticket_classes/`,
  );
  return ticket_classes;
};

export interface SpectatorStatus {
  id: SpectatorTicket;
  label: string;
  ticketClassName: string;
  remaining: number;
}

/** Spectator options that exist on Eventbrite, with the spots left in each. */
export const spectatorStatuses = (ticketClasses: EventbriteTicketClass[]): SpectatorStatus[] =>
  Object.entries(SPECTATOR_TICKETS).flatMap(([id, option]) => {
    const ticketClass = ticketClasses.find((tc) => tc.name === option.ticketClassName);
    if (!ticketClass) return [];
    return [
      {
        id: id as SpectatorTicket,
        label: option.label,
        ticketClassName: option.ticketClassName,
        remaining: Math.max(
          0,
          (ticketClass.quantity_total ?? 0) - (ticketClass.quantity_sold ?? 0),
        ),
      },
    ];
  });

export const fetchTicketOptions = async () => {
  const ticketClasses = await fetchTicketClasses();
  return { brackets: bracketStatuses(ticketClasses), spectators: spectatorStatuses(ticketClasses) };
};

export const fetchBrackets = async () => bracketStatuses(await fetchTicketClasses());

const bracketStatuses = (ticket_classes: EventbriteTicketClass[]): BracketStatus[] => {
  return Object.entries(BRACKETS).flatMap(([id, bracket]) => {
    const ticketClass = ticket_classes.find((tc) => tc.name === bracket.ticketClassName);
    if (!ticketClass) return [];
    const capacity = ticketClass.quantity_total ?? 0;
    return [
      {
        id: id as Bracket,
        label: bracket.label,
        ticketClassId: ticketClass.id,
        capacity,
        remaining: Math.max(0, capacity - (ticketClass.quantity_sold ?? 0)),
      },
    ];
  });
};

const slug = (text: string, max: number) =>
  text
    .normalize('NFKD')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, max)
    .replace(/-+$/g, '')
    .toUpperCase();

/** e.g. "coreyja" + "Amphibious Arthur" → "COREYJA-AMPHIBIOUS-ARTHUR". */
export const accessCodeFor = (snake: Pick<VerifiedBattlesnake, 'username' | 'snakeName'>) =>
  `${slug(snake.username, 20)}-${slug(snake.snakeName, 24)}`;

export const checkoutUrl = (code: string) =>
  `${TOURNAMENT.eventUrl}?discount=${encodeURIComponent(code)}`;

const findAccessCode = async (code: string) => {
  const { discounts = [] } = await eventbriteGet<{ discounts?: EventbriteDiscount[] }>(
    `/organizations/${ORG_ID}/discounts/`,
    { scope: 'event', event_id: TOURNAMENT.eventId, code },
  );
  return discounts.find((discount) => discount.code.toUpperCase() === code);
};

export type ReserveResult =
  | { ok: true; code: string; checkoutUrl: string }
  | { ok: false; field: 'bracket' | 'snake'; error: string };

/**
 * Creates (or reuses) the one-use access code that unlocks this snake's bracket
 * ticket. Picking a different bracket before checking out moves the code.
 */
export const reserveTicket = async (
  bracket: BracketStatus,
  snake: VerifiedBattlesnake,
): Promise<ReserveResult> => {
  const code = accessCodeFor(snake);
  const existing = await findAccessCode(code);

  if (existing && (existing.quantity_sold ?? 0) > 0) {
    return {
      ok: false,
      field: 'snake',
      error: `${snake.snakeName} is already registered. Check your email for the Eventbrite confirmation.`,
    };
  }
  if (bracket.remaining === 0) {
    return {
      ok: false,
      field: 'bracket',
      error: `The ${bracket.label} bracket is full. Join the waitlist on Eventbrite or pick another bracket.`,
    };
  }

  if (!existing) {
    await eventbritePost(`/organizations/${ORG_ID}/discounts/`, {
      discount: {
        type: 'access',
        code,
        event_id: TOURNAMENT.eventId,
        ticket_class_ids: [bracket.ticketClassId],
        quantity_available: 1,
      },
    });
  } else if (!existing.ticket_class_ids?.includes(bracket.ticketClassId)) {
    await eventbritePost(`/discounts/${existing.id}/`, {
      discount: { ticket_class_ids: [bracket.ticketClassId] },
    });
  }

  return { ok: true, code, checkoutUrl: checkoutUrl(code) };
};

const COMPETITOR_TICKETS = new Map<string, string>(
  Object.values(BRACKETS).map((b) => [b.ticketClassName, b.label]),
);

/**
 * Finds an active competitor ticket already held under this email, whether it was
 * bought on Eventbrite before this page existed or through this page.
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
