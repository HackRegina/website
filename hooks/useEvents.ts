import { useQuery } from '@tanstack/react-query';
import { generateQueryKey } from '../utils/generateQueryKey';

export const useEvents = () => {
  const query = { time_filter: 'current_future' } as const;
  const { data: events = [] } = useQuery({
    queryKey: generateQueryKey({ key: 'events', query }),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.set('time_filter', query.time_filter);
      const response = await fetch(`/api/events?${searchParams.toString()}`);
      const { data } = await response.json();
      return data;
    },
  });
  return { events };
};
