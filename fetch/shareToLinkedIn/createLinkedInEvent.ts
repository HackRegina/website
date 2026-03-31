import { DateTime } from 'luxon';
import type { IEventbriteEvent } from '../events';

type LinkedInEventCreateRequest = {
  name: {
    localized: {
      [locale: string]: string;
    };
  };
  type:
    | {
        inPerson: {
          location: {
            name: string;
            address: {
              streetAddress?: string;
              city?: string;
              state?: string;
              postalCode?: string;
              country?: string;
            };
          };
          endsAt?: number; // timestamp in milliseconds
          url?: string; // optional external URL for the event
        };
      }
    | {
        online: {
          format: {
            liveVideo?: {
              endsAt: number; // timestamp in milliseconds
            };
          };
        };
      };
  organizer: string; // e.g. "urn:li:organization:123456"
  startsAt: number; // timestamp in milliseconds
  endsAt?: number; // timestamp in milliseconds, optional for some event types
  leadGenFormSpec?: {
    privacyPolicyUrl: string;
  };
  backgroundImage?: string; // e.g. "urn:li:digitalmediaAsset:XYZ"
};

type LinkedInEventCreateResponse = {
  vanityName: string;
  discoveryMode: string;
  leadGenForm: string;
  created: {
    actor: string;
    time: number;
  };
  organizer: string;
  name: {
    localized: {
      en_US: string;
    };
  };
  startsAt: number;
  id: number;
  lastModified: {
    actor: string;
    time: number;
  };
  type: {
    inPerson: {
      address: {
        streetAddress?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
      };
      endsAt: number;
      url: string;
    };
  };
  backgroundImage: string;
};

export const createLinkedInEvent = async ({
  event,
  accessToken,
  organizationUrn,
  backgroundImage,
}: {
  event: IEventbriteEvent;
  accessToken: string;
  organizationUrn: string;
  backgroundImage?: string;
}) => {
  const startTime = DateTime.fromISO(event.start.local, { zone: event.start.timezone }).toMillis();
  const endTime = DateTime.fromISO(event.end.local, { zone: event.end.timezone }).toMillis();

  const hasVenue = event.venue?.address?.address_1;

  const eventData: LinkedInEventCreateRequest = {
    name: {
      localized: {
        en_US: event.name.text,
      },
    },
    organizer: organizationUrn,
    startsAt: startTime,
    endsAt: endTime,
    type: hasVenue
      ? {
          inPerson: {
            location: {
              name: event.venue.name,
              address: {
                streetAddress: event.venue.address.address_1,
                city: event.venue.address.city,
                country: 'CA',
              },
            },
            url: event.url,
          },
        }
      : {
          online: {
            format: {
              liveVideo: {
                endsAt: endTime,
              },
            },
          },
        },
    backgroundImage,
  };

  const response = await fetch('https://api.linkedin.com/rest/events', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'LinkedIn-Version': '202603',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LinkedIn API returned ${response.status}: ${errorText}`);
  }

  const data: LinkedInEventCreateResponse = await response.json();
  const eventUrn = `urn:li:event:${data.id}`;
  const actorUrn = data.created?.actor || organizationUrn;
  return { ...data, id: data.id, eventUrn, actorUrn };
};
