import { dehydrate, QueryClient } from '@tanstack/react-query';
import type { NextPage } from 'next';
import { Layout } from '@/components/layout/Layout';
import { EventsScene } from '@/scenes/EventsScene/EventsScene';
import { fetchEvents } from '../fetch/events';
import { generateQueryKey } from '../utils/generateQueryKey';

const Events: NextPage = () => {
  return (
    <Layout title="Events - HackRegina">
      <EventsScene />
    </Layout>
  );
};

export async function getServerSideProps() {
  const queryClient = new QueryClient();
  const query = { timeFilter: 'current_future' } as const;
  await queryClient.prefetchQuery({
    queryKey: generateQueryKey({ key: 'events', query }),
    queryFn: async () => {
      const { data } = await fetchEvents(query);
      return data;
    },
  });
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default Events;
