import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isEventbriteNotFound } from '@/fetch/attendees';
import { attendeeReportQueryKey } from '@/hooks/useAttendeeReport';
import { requireAdminOrRedirect } from '@/lib/adminAuth';
import { getAttendeeReport } from '@/lib/attendeeReport';
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
    const report = await getAttendeeReport(id);
    queryClient.setQueryData(attendeeReportQueryKey(id), report);
  } catch (error) {
    if (isEventbriteNotFound(error)) notFound();
    // Non-404 failures fall through so the client hook can retry and show its error state.
    console.error('Failed to prefetch attendee report:', error);
  }
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminEventDetailScene eventId={id} />
    </HydrationBoundary>
  );
}
