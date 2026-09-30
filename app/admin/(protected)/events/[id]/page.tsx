import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isEventbriteNotFound } from '@/fetch/attendees';
import { eventAttendeesQueryKey } from '@/hooks/useEventAttendees';
import { requireAdminOrRedirect } from '@/lib/adminAuth';
import { getEventAttendees } from '@/lib/eventAttendees';
import { AdminEventDetailScene } from '@/scenes/AdminEventDetailScene/AdminEventDetailScene';

export const metadata: Metadata = { title: 'Event Attendees - HackRegina' };

interface AdminEventPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEventPage({ params }: AdminEventPageProps) {
  await requireAdminOrRedirect();
  const { id } = await params;
  const queryClient = new QueryClient();
  try {
    queryClient.setQueryData(eventAttendeesQueryKey(id), await getEventAttendees(id));
  } catch (error) {
    if (isEventbriteNotFound(error)) notFound();
    console.error('Failed to prefetch event attendees:', error);
  }
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminEventDetailScene eventId={id} />
    </HydrationBoundary>
  );
}
