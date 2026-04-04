import { createEvent, createTicketClass, setStructuredContent } from '@/fetch/createEvent';
import type { PlannedEvent } from './generateEvents';

export async function createEvents(events: PlannedEvent[]) {
  const eventsWithUrls = new Map<PlannedEvent, PlannedEvent & { url: string }>();
  for (const event of events) {
    const { id, url } = await createEvent({
      name: event.template.name,
      summary: event.template.summary,
      date: event.date,
      startHour: event.template.startHour,
      endHour: event.template.endHour,
      venueId: event.template.venue.venueId,
      formatId: event.template.formatId,
    });

    await setStructuredContent(id, {
      description: event.template.description,
      faqs: event.template.faqs,
      agenda: event.template.agenda,
    });

    const salesStart = event.date
      .minus({ days: event.template.onSaleDaysBefore })
      .set({ hour: 0, minute: 0, second: 0 });
    const salesEnd = event.date.set({
      hour: event.template.startHour,
      minute: 0,
      second: 0,
    });

    for (const tc of event.template.ticketClasses) {
      await createTicketClass(id, tc, salesStart, salesEnd);
    }

    eventsWithUrls.set(event, { ...event, url });
  }
  return Array.from(eventsWithUrls.values());
}
