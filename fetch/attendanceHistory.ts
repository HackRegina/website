import { unstable_cache } from 'next/cache';
import { fetchAttendeesForEvent, type IAttendee } from '@/fetch/attendees';
import { eventbriteGet, ORG_ID } from '@/fetch/eventbrite';
import type { AttendanceHistory, AttendanceStats } from '@/utils/showUpProbability';

const HISTORY_EVENT_COUNT = 25;
const CONCURRENCY = 3;

interface PastEvent {
  id: string;
  status: string;
}

const emptyHistory = (): AttendanceHistory => ({
  byEmail: {},
  totals: { registrations: 0, checkins: 0 },
  eventsConsidered: 0,
  generatedAt: Date.now(),
});

const fetchPastEventAttendees = async (eventIds: string[]): Promise<IAttendee[][]> => {
  const results: IAttendee[][] = [];
  for (let i = 0; i < eventIds.length; i += CONCURRENCY) {
    const batch = eventIds.slice(i, i + CONCURRENCY);
    const settled = await Promise.all(
      batch.map(async (eventId) => {
        try {
          return await fetchAttendeesForEvent(eventId);
        } catch (error) {
          console.error(`Failed to fetch attendees for past event ${eventId}:`, error);
          return [];
        }
      }),
    );
    results.push(...settled);
  }
  return results;
};

const checkedInByUniqueEmail = (eventAttendees: IAttendee[]): Map<string, boolean> => {
  const checkedInByEmail = new Map<string, boolean>();
  for (const attendee of eventAttendees) {
    const email = attendee.email?.trim().toLowerCase();
    if (!email || attendee.cancelled || attendee.refunded) continue;
    checkedInByEmail.set(email, (checkedInByEmail.get(email) ?? false) || attendee.checkedIn);
  }
  return checkedInByEmail;
};

const hasCheckInSignal = (checkedInByEmail: Map<string, boolean>): boolean =>
  [...checkedInByEmail.values()].some(Boolean);

export const buildHistory = (eventAttendeeLists: IAttendee[][]): AttendanceHistory => {
  const byEmail: Record<string, AttendanceStats> = {};
  const totals: AttendanceStats = { registrations: 0, checkins: 0 };
  let eventsConsidered = 0;

  for (const eventAttendees of eventAttendeeLists) {
    const checkedInByEmail = checkedInByUniqueEmail(eventAttendees);
    if (!hasCheckInSignal(checkedInByEmail)) continue;

    eventsConsidered += 1;
    for (const [email, checkedIn] of checkedInByEmail) {
      const stats = byEmail[email] ?? { registrations: 0, checkins: 0 };
      byEmail[email] = stats;
      stats.registrations += 1;
      totals.registrations += 1;
      if (checkedIn) {
        stats.checkins += 1;
        totals.checkins += 1;
      }
    }
  }

  return { byEmail, totals, eventsConsidered, generatedAt: Date.now() };
};

const fetchAttendanceHistoryCached = unstable_cache(
  async (): Promise<AttendanceHistory> => {
    const { events = [] } = await eventbriteGet<{ events?: PastEvent[] }>(
      `/organizations/${ORG_ID}/events/`,
      {
        time_filter: 'past',
        order_by: 'start_desc',
        page_size: String(HISTORY_EVENT_COUNT),
      },
    );
    const eventIds = events.filter((event) => event.status !== 'canceled').map((e) => e.id);
    return buildHistory(await fetchPastEventAttendees(eventIds));
  },
  ['eventbrite-attendance-history-v1'],
  { revalidate: 21600, tags: ['attendance-history'] },
);

export const fetchAttendanceHistory = async (): Promise<AttendanceHistory> => {
  try {
    return await fetchAttendanceHistoryCached();
  } catch (error) {
    console.error('Failed to build attendance history:', error);
    return emptyHistory();
  }
};
