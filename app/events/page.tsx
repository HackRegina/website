import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { fetchEvents } from '@/fetch/events';
import { EventsScene } from '@/scenes/EventsScene/EventsScene';
import { generateQueryKey } from '@/utils/generateQueryKey';

export const metadata: Metadata = { title: 'Events - HackRegina' };

export default async function EventsPage() {
  const queryClient = new QueryClient();
  const query = { timeFilter: 'current_future' } as const;
  await queryClient.prefetchQuery({
    queryKey: generateQueryKey({ key: 'events', query }),
    queryFn: async () => {
      const { data } = await fetchEvents(query);
      return data;
    },
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EventsScene />
    </HydrationBoundary>
  );
}
