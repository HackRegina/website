import { DateTime, Interval } from 'luxon';
import type { IEventbriteEvent } from '@/fetch/events';

export const createLinkedInEventMessage = (event: IEventbriteEvent): string => {
  const formattedDate = Interval.fromDateTimes(
    DateTime.fromISO(event.start.local),
    DateTime.fromISO(event.end.local),
  ).toLocaleString({
    ...DateTime.DATE_HUGE,
    ...DateTime.TIME_SIMPLE,
  });
  const formattedAddress = event.venue?.address
    ? [
        event.venue.name,
        event.venue.address.address_1,
        event.venue.address.address_2,
        event.venue.address.city,
      ]
        .filter((a) => !!a)
        .join(', ')
    : `TBA`;
  const randomGreetings = [
    `Hey everyone, there's a cool event happening soon!`,
    `We're excited to announce another great event in the tech community!`,
    `Happy to invite you all to another HackRegina event!`,
  ];
  return (
    `🎯 ${event.name.text} 🎯\n\n` +
    `${randomGreetings[Math.floor(Math.random() * randomGreetings.length)]}\n\n` +
    `📅 ${formattedDate}\n` +
    `📍 ${formattedAddress}\n\n` +
    `🎟️ Find tickets here: ${event.url}?src=linkedin`
  );
};
