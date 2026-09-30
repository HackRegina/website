import { useQuery } from '@tanstack/react-query';
import type { EventAttendees } from '@/lib/eventAttendees';
import { generateQueryKey } from '@/utils/generateQueryKey';

export const eventAttendeesQueryKey = (eventId: string) =>
  generateQueryKey({ key: 'admin-attendees', id: eventId });

export const useEventAttendees = (eventId: string) => {
  const { data, isLoading, isError } = useQuery<EventAttendees>({
    queryKey: eventAttendeesQueryKey(eventId),
    queryFn: async () => {
      const response = await fetch(`/api/admin/events/${eventId}/attendees`);
      if (!response.ok) throw new Error(`Failed to load attendees (${response.status})`);
      return response.json();
    },
    refetchInterval: 60_000,
  });
  return { data, isLoading, isError };
};
