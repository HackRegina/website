import type { DateTime } from 'luxon';
import { API_BASE, ORG_ID } from '@/fetch/eventbrite';

const token = process.env.EVENTBRITE_TOKEN;

async function apiRequest(path: string, body: unknown): Promise<Record<string, unknown>> {
  if (!token) throw new Error('EVENTBRITE_TOKEN is required');

  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Eventbrite API error ${res.status}: ${text}`);
  }

  return res.json() as Promise<Record<string, unknown>>;
}

const TIMEZONE = 'America/Regina';
const CURRENCY = 'CAD';

interface CreateEventParams {
  name: string;
  summary: string;
  date: DateTime;
  startHour: number;
  endHour: number;
  venueId: string;
  formatId: string;
}

export const createEvent = async (
  params: CreateEventParams,
): Promise<{ id: string; url: string }> => {
  const { name, summary, date, startHour, endHour, venueId, formatId } = params;
  const start = date.set({ hour: startHour, minute: 0, second: 0 });
  const end = date.set({ hour: endHour, minute: 0, second: 0 });

  const result = await apiRequest(`/organizations/${ORG_ID}/events/`, {
    event: {
      name: { html: name },
      summary,
      start: {
        timezone: TIMEZONE,
        utc: start.toUTC().toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"),
      },
      end: {
        timezone: TIMEZONE,
        utc: end.toUTC().toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"),
      },
      currency: CURRENCY,
      venue_id: venueId,
      listed: false,
      shareable: true,
      format_id: formatId,
      category_id: '101',
      subcategory_id: '1010',
      locale: 'en_CA',
    },
  });

  return { id: result.id as string, url: result.url as string };
};

// --- Structured Content ---

export interface FAQ {
  question: string;
  answer: string;
}

export interface AgendaSlot {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

export const setStructuredContent = async (
  eventId: string,
  {
    description,
    faqs,
    agenda,
  }: {
    description: string;
    faqs?: FAQ[];
    agenda?: AgendaSlot[];
  },
): Promise<void> => {
  // Fetch current version to avoid PAGE_VERSION_DISCONTINUITY on updates
  let version = 1;
  const res = await fetch(`${API_BASE}/events/${eventId}/structured_content/`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });
  if (res.ok) {
    const current = (await res.json()) as Record<string, unknown>;
    if (typeof current.page_version_number === 'number') {
      version = current.page_version_number;
    } else if (typeof current.page_version_number === 'string') {
      version = Number.parseInt(current.page_version_number, 10);
    }
  }
  const modules = [
    {
      type: 'text' as const,
      data: { body: { text: description, alignment: 'left' } },
    },
  ];

  const widgets: Record<string, unknown>[] = [];

  if (faqs?.length) {
    widgets.push({ type: 'faqs', data: { faqs } });
  }

  if (agenda?.length) {
    // Note: the Eventbrite API does not support the agenda widget via structured content.
    // Agendas must be added manually through the Eventbrite UI.
    // widgets.push({
    //   type: 'agenda',
    //   data: { tabs: [{ name: 'Agenda', slots: agenda }] },
    // });
  }

  await apiRequest(`/events/${eventId}/structured_content/${version}/`, {
    modules,
    ...(widgets.length > 0 && { widgets }),
    publish: true,
    purpose: 'listing',
  });
};

export interface TicketClassConfig {
  name: string;
  free: boolean;
  quantity_total: number;
  donation: boolean;
}

export const createTicketClass = async (
  eventId: string,
  tc: TicketClassConfig,
  salesStart: DateTime,
  salesEnd: DateTime,
): Promise<void> => {
  await apiRequest(`/events/${eventId}/ticket_classes/`, {
    ticket_class: {
      name: tc.name,
      free: tc.free,
      quantity_total: tc.quantity_total,
      donation: tc.donation,
      sales_start: salesStart.toUTC().toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"),
      sales_end: salesEnd.toUTC().toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"),
    },
  });
};
