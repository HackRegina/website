import { fetchAdminEventById, type IAdminEvent } from '@/fetch/adminEvents';
import { fetchAttendeesForEvent, type IAttendee } from '@/fetch/attendees';

export interface EventAttendees {
  event: IAdminEvent;
  attendees: IAttendee[];
}

export const getEventAttendees = async (eventId: string): Promise<EventAttendees> => {
  const [event, attendees] = await Promise.all([
    fetchAdminEventById(eventId),
    fetchAttendeesForEvent(eventId),
  ]);
  return { event, attendees };
};
