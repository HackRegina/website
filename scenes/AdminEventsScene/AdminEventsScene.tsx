'use client';

import { useAdminEvents } from '@/hooks/useAdminEvents';
import { AdminEventCard } from './components';

export const AdminEventsScene = () => {
  const { events, isLoading, isError } = useAdminEvents();

  return (
    <section>
      <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-gray-50">
        Upcoming events
      </h2>
      {isError && (
        <p className="text-red-700 dark:text-red-300">
          Failed to load events. Try refreshing, or sign in again.
        </p>
      )}
      {isLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static list of skeleton placeholders
            <div key={i} className="h-44 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
          ))}
        </div>
      )}
      {!isLoading && !isError && events.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">No upcoming events.</p>
      )}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <AdminEventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
};
