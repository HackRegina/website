import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { fetchOrganizations } from '@/fetch/organizations';
import { TechMapScene } from '@/scenes/TechMapScene/TechMapScene';
import { generateQueryKey } from '@/utils/generateQueryKey';

export const metadata: Metadata = { title: 'Tech Map - HackRegina' };

export default async function TechMapPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: generateQueryKey({ key: 'organizations', query: {} }),
    queryFn: () => fetchOrganizations(),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TechMapScene />
    </HydrationBoundary>
  );
}
