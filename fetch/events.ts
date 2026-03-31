import { DateTime } from 'luxon';

const token = process.env.EVENTBRITE_TOKEN;

export interface IEventbriteEvent {
  id: string;
  status: 'draft' | 'live';
  name: {
    text: string;
  };
  description: {
    text: string;
  };
  url: string;
  start: {
    local: string;
    timezone: string;
  };
  end: {
    local: string;
    timezone: string;
  };
  venue: {
    name: string;
    address: {
      address_1: string;
      address_2?: string;
      city: string;
    };
  };
  venue_id: string;
  logo: {
    url: string;
  };
  sales_data_with_null?: {
    max_possible_ticket_sales: number;
  };
}

export interface IEventBriteResponse {
  event: IEventbriteEvent;
}

interface Venue {
  place_name: string;
  address_1: string;
  address_2: string;
  city: string;
  region: string;
  postal_code: string;
  country: string;
  latitude: string;
  longitude: string;
  localized_address_display: string;
  localized_area_display: string;
  localized_multi_line_address_display: string[];
}

export interface IDraftEvent {
  id: string;
  name: string;
  status: 'draft';
  start: number;
  end: number;
  summary: string;
  image: string;
  venue?: Venue;
}

export interface ILiveEvent {
  id: string;
  name: string;
  status: 'live';
  start: number;
  end: number;
  url: string;
  summary: string;
  image: string;
  venue?: Venue;
}

export type IEvent = IDraftEvent | ILiveEvent;

export interface IEventResponse {
  data: IEvent[];
}

export const fetchEventByUrl = async ({ url }: { url?: string } = {}) => {
  if (!token) throw new Error('No token provided');
  if (!url) throw new Error('No url provided');
  const response = await fetch(`${url}?token=${token}&expand=venue`);
  const event: IEventBriteResponse['event'] = await response.json();
  return {
    event,
  };
};

export const fetchEventById = async (id: string) => {
  return fetchEventByUrl({ url: `https://www.eventbriteapi.com/v3/events/${id}/` });
};

export const fetchEvents = async ({
  timeFilter,
}: {
  timeFilter: 'current_future' | 'past';
}): Promise<IEventResponse> => {
  if (!token) throw new Error('No token provided');
  const response = await fetch(
    `https://www.eventbriteapi.com/v3/organizations/168322805152/events?token=${token}&time_filter=${timeFilter}&expand=sales_data_with_null`,
  );
  const { events = [] } = await response.json();
  const venueMap = new Map();
  await Promise.all(
    events
      .reduce(
        (venueIds: string[], event: IEventbriteEvent) =>
          // biome-ignore lint/performance/noAccumulatingSpread: the list of venueIds is expected to be small
          venueIds.includes(event.venue_id) ? venueIds : [...venueIds, event.venue_id],
        [],
      )
      .map(async (venueId: string) => {
        try {
          if (!venueMap.has(venueId)) {
            const venueResponse = await fetch(
              `https://www.eventbriteapi.com/v3/venues/${venueId}?token=${token}`,
            );
            const venue = await venueResponse.json();
            venueMap.set(venueId, venue);
          }
        } catch (error) {
          console.error(error);
        }
      }),
  );
  return {
    data: await Promise.all(
      events
        .filter((e: IEventbriteEvent) => e.sales_data_with_null?.max_possible_ticket_sales)
        .map(async (event: IEventbriteEvent): Promise<IEvent> => {
          const venue = venueMap.get(event.venue_id);
          if (event.status === 'draft') {
            return {
              id: event.id,
              name: event.name.text,
              status: 'draft',
              start: DateTime.fromISO(event.start.local, { zone: event.start.timezone }).toMillis(),
              end: DateTime.fromISO(event.end.local, { zone: event.end.timezone }).toMillis(),
              summary: event.description.text,
              image: event.logo ? event.logo.url : '',
              venue: venue && {
                place_name: venue.name || 'TBA',
                ...venue.address,
              },
            };
          }
          return {
            id: event.id,
            name: event.name.text,
            status: 'live',
            start: DateTime.fromISO(event.start.local, { zone: event.start.timezone }).toMillis(),
            end: DateTime.fromISO(event.end.local, { zone: event.end.timezone }).toMillis(),
            url: event.url,
            summary: event.description.text,
            image: event.logo ? event.logo.url : '',
            venue: venue && {
              place_name: venue.name || 'TBA',
              ...venue.address,
            },
          };
        }),
    ),
  };
};
