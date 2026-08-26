'use client';

import { DateTime } from 'luxon';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { AttendeeReport } from '@/lib/attendeeReport';

interface EventSummaryHeaderProps {
  report: AttendeeReport;
}

// Red Swan order math: a large is 8 slices, budget 3 slices a person.
const SLICES_PER_PERSON = 3;
const SLICES_PER_LARGE_PIZZA = 8;

const largePizzasNeeded = (people: number): number =>
  Math.ceil((people * SLICES_PER_PERSON) / SLICES_PER_LARGE_PIZZA);

interface StatTileProps {
  label: string;
  value: string;
  hint?: string;
  children?: React.ReactNode;
}

const StatTile = ({ label, value, hint, children }: StatTileProps) => (
  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-50">{value}</p>
    {hint && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{hint}</p>}
    {children}
  </div>
);

export const EventSummaryHeader = ({ report }: EventSummaryHeaderProps) => {
  const { event, summary } = report;
  const start = DateTime.fromMillis(event.start).setZone('America/Regina');
  const registered = summary.total - summary.cancelled;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {event.imageUrl && (
          <Image
            src={event.imageUrl}
            alt=""
            width={160}
            height={80}
            className="rounded-lg object-cover"
          />
        )}
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">{event.name}</h2>
            {event.status !== 'live' && <Badge>{event.status}</Badge>}
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            {start.toLocaleString(DateTime.DATETIME_FULL)}
            {event.venueName ? ` · ${event.venueName}` : ''}
          </p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatTile label="Registered" value={String(registered)} />
        <StatTile label="Checked in" value={String(summary.checkedIn)} />
        <StatTile
          label="Expected turnout"
          value={String(summary.expectedTurnout)}
          hint={
            summary.eventsConsidered > 0
              ? `based on ${summary.eventsConsidered} past events · base rate ${Math.round(summary.baseRate * 100)}%`
              : 'no attendance history yet — showing default rates'
          }
        />
        <StatTile
          label="Pizza order"
          value={`${largePizzasNeeded(summary.expectedTurnout)} large`}
          hint={`from Red Swan · ${SLICES_PER_PERSON} slices/person`}
        />
        {event.capacity !== null && event.capacity > 0 ? (
          <StatTile label="Capacity" value={`${event.sold ?? registered} / ${event.capacity}`}>
            <Progress
              className="mt-2"
              value={Math.round(((event.sold ?? registered) / event.capacity) * 100)}
            />
          </StatTile>
        ) : (
          <StatTile label="Capacity" value="—" hint="no ticket classes" />
        )}
      </div>
    </div>
  );
};
