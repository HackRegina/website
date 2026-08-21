import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { fetchAdminEvents } from '@/fetch/adminEvents';
import { adminEventsQueryKey } from '@/hooks/useAdminEvents';
import { requireAdminOrRedirect } from '@/lib/adminAuth';
import { AdminEventsScene } from '@/scenes/AdminEventsScene/AdminEventsScene';

export const metadata: Metadata = { title: 'Admin - HackRegina' };

export default async function AdminPage() {
  await requireAdminOrRedirect();
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: adminEventsQueryKey,
    queryFn: () => fetchAdminEvents(),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminEventsScene />
    </HydrationBoundary>
  );
}
