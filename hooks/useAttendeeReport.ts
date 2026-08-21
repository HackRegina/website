import { useQuery } from '@tanstack/react-query';
import type { AttendeeReport } from '@/lib/attendeeReport';
import { generateQueryKey } from '@/utils/generateQueryKey';

// Shared with the server prefetch in app/admin/(protected)/events/[id]/page.tsx.
export const attendeeReportQueryKey = (eventId: string) =>
  generateQueryKey({ key: 'admin-attendees', id: eventId });

export const useAttendeeReport = (eventId: string) => {
  const {
    data: report,
    isLoading,
    isError,
  } = useQuery<AttendeeReport>({
    queryKey: attendeeReportQueryKey(eventId),
    queryFn: async () => {
      const response = await fetch(`/api/admin/events/${eventId}/attendees`);
      if (!response.ok) throw new Error(`Failed to load attendees (${response.status})`);
      return response.json();
    },
    // Keep the checked-in column live while an event is running.
    refetchInterval: 60_000,
  });
  return { report, isLoading, isError };
};
