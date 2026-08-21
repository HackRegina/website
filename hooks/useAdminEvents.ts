import { useQuery } from '@tanstack/react-query';
import type { IAdminEvent } from '@/fetch/adminEvents';
import { generateQueryKey } from '@/utils/generateQueryKey';

export const adminEventsQueryKey = generateQueryKey({ key: 'admin-events' });

export const useAdminEvents = () => {
  const {
    data: events = [],
    isLoading,
    isError,
  } = useQuery<IAdminEvent[]>({
    queryKey: adminEventsQueryKey,
    queryFn: async () => {
      const response = await fetch('/api/admin/events');
      if (!response.ok) throw new Error(`Failed to load admin events (${response.status})`);
      const { data } = await response.json();
      return data;
    },
  });
  return { events, isLoading, isError };
};
