'use client';

import { DateTime } from 'luxon';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { IAdminEvent } from '@/fetch/adminEvents';
import type { EventStats, TurnoutForecast } from '@/utils/eventStats';

interface EventSummaryHeaderProps {
  event: IAdminEvent;
  stats: EventStats | undefined;
}

const SLICES_PER_PERSON = 3;
const SLICES_PER_LARGE_PIZZA = 8;

const largePizzasNeeded = (people: number): number =>
  Math.ceil((people * SLICES_PER_PERSON) / SLICES_PER_LARGE_PIZZA);

const turnoutHint = (turnout: TurnoutForecast | undefined): string => {
  if (!turnout) return 'loading attendance history';
  if (turnout.eventsConsidered === 0) return 'no attendance history yet — showing default rates';
  return `based on ${turnout.eventsConsidered} past events · base rate ${Math.round(turnout.baseRate * 100)}%`;
};

export const EventSummaryHeader = ({ event, stats }: EventSummaryHeaderProps) => {
  const start = DateTime.fromMillis(event.start).setZone('America/Regina');
  const summary = stats?.summary;
  const turnout = stats?.turnout;
  const sold = event.sold ?? summary?.registered;

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
        <StatTile label="Registered" value={summary ? String(summary.registered) : null} />
        <StatTile label="Checked in" value={summary ? String(summary.checkedIn) : null} />
        <StatTile
          label="Expected turnout"
          value={turnout ? String(turnout.expected) : null}
          hint={turnoutHint(turnout)}
        />
        <StatTile
          label="Pizza order"
          value={turnout ? `${largePizzasNeeded(turnout.expected)} large` : null}
          hint={`from Red Swan · ${SLICES_PER_PERSON} slices/person`}
        />
        {event.capacity !== null && event.capacity > 0 ? (
          <StatTile
            label="Capacity"
            value={sold === undefined ? null : `${sold} / ${event.capacity}`}
          >
            {sold !== undefined && (
              <Progress className="mt-2" value={Math.round((sold / event.capacity) * 100)} />
            )}
          </StatTile>
        ) : (
          <StatTile label="Capacity" value="—" hint="no ticket classes" />
        )}
      </div>
    </div>
  );
};

interface StatTileProps {
  label: string;
  value: string | null;
  hint?: string;
  children?: React.ReactNode;
}

const StatTile = ({ label, value, hint, children }: StatTileProps) => (
  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    {value === null ? (
      <div className="my-1 h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
    ) : (
      <p className="text-2xl font-semibold text-gray-900 dark:text-gray-50">{value}</p>
    )}
    {hint && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{hint}</p>}
    {children}
  </div>
);
