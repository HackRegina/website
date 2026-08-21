'use client';

import { DateTime } from 'luxon';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { IAdminEvent } from '@/fetch/adminEvents';
import { routes } from '@/lib/route';

interface AdminEventCardProps {
  event: IAdminEvent;
}

export const AdminEventCard = ({ event }: AdminEventCardProps) => {
  const start = DateTime.fromMillis(event.start).setZone('America/Regina');
  const soldPercent =
    event.capacity && event.capacity > 0
      ? Math.round(((event.sold ?? 0) / event.capacity) * 100)
      : null;

  return (
    <Link href={routes.admin.event(event.id)} className="block">
      <Card className="h-full transition-colors hover:border-primary-500 dark:hover:border-primary-400">
        <CardHeader className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg">{event.name}</CardTitle>
            {event.status !== 'live' && <Badge>{event.status}</Badge>}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {start.toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}
            {event.venueName ? ` · ${event.venueName}` : ''}
          </p>
        </CardHeader>
        <CardContent>
          {soldPercent !== null ? (
            <div className="space-y-1">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {event.sold} / {event.capacity} registered
              </p>
              <Progress value={soldPercent} />
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No ticket classes yet</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
