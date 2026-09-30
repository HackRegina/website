'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useEventAttendees } from '@/hooks/useEventAttendees';
import { useEventStats } from '@/hooks/useEventStats';
import { routes } from '@/lib/route';
import { AttendeeTable, EventSummaryHeader } from './components';

interface AdminEventDetailSceneProps {
  eventId: string;
}

export const AdminEventDetailScene = ({ eventId }: AdminEventDetailSceneProps) => {
  const { data, isLoading, isError } = useEventAttendees(eventId);
  const { stats, isError: isStatsError } = useEventStats(eventId);

  return (
    <section>
      <Link
        href={routes.admin.dashboard()}
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
      >
        <ArrowLeft className="h-4 w-4" />
        All events
      </Link>
      {isError && (
        <p className="text-red-700 dark:text-red-300">Failed to load attendees. Try refreshing.</p>
      )}
      {isStatsError && (
        <p className="mb-4 text-red-700 dark:text-red-300">
          Failed to load event stats. Try refreshing.
        </p>
      )}
      {isLoading && (
        <div className="space-y-6">
          <div className="h-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
          <div className="h-96 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
        </div>
      )}
      {data && (
        <div className="space-y-8">
          <EventSummaryHeader event={data.event} stats={stats} />
          <AttendeeTable attendees={data.attendees} predictions={stats?.predictions ?? null} />
        </div>
      )}
    </section>
  );
};
