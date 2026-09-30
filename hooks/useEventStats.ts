import { useQuery } from '@tanstack/react-query';
import { type EventStatsPayload, toEventStats } from '@/utils/eventStats';
import { generateQueryKey } from '@/utils/generateQueryKey';

export const eventStatsQueryKey = (eventId: string) =>
  generateQueryKey({ key: 'admin-event-stats', id: eventId });

export const useEventStats = (eventId: string) => {
  const { data: stats, isError } = useQuery({
    queryKey: eventStatsQueryKey(eventId),
    queryFn: async (): Promise<EventStatsPayload> => {
      const response = await fetch(`/api/admin/events/${eventId}/stats`);
      if (!response.ok) throw new Error(`Failed to load event stats (${response.status})`);
      return response.json();
    },
    select: toEventStats,
    refetchInterval: 60_000,
  });
  return { stats, isError };
};
