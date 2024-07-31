import { Interval, DateTime } from "luxon";
import { IEventbriteEvent } from "../interfaces/eventbrite-event";

export const createEventMessage = (event: IEventbriteEvent): string => {
  let formattedDate = Interval.fromDateTimes(
    DateTime.fromISO(event.start.local),
    DateTime.fromISO(event.end.local)
  ).toLocaleString({
    ...DateTime.DATE_HUGE,
    ...DateTime.TIME_SIMPLE,
  });
  let formattedAddress = event.venue && event.venue.address
    ? [
      event.venue.name,
      event.venue.address.address_1,
      event.venue.address.address_2,
      event.venue.address.city,
    ]
      .filter((a) => !!a)
      .join(', ')
    : `TBA`;
  let randomGreetings = [
    `Hey <!here>, There is a cool event happening soon!`,
    `<!here> As a bot, I am programmed to be excited to annouce that there is a event happening in the tech community.`,
    `Hackbot here, happy to invite <!here> to another great event!`,
  ];
  return (
    `:hackregina: *${event.name.text}* :hackregina:\n\n` +
    `${randomGreetings[Math.floor(Math.random() * randomGreetings.length)]}\n\n` +
    `:calendar: ${formattedDate}\n` +
    `:round_pushpin: ${formattedAddress}\n\n\n` +
    `:admission_tickets: Find tickets here: ${event.url}?src=hackregina`
  );
};
