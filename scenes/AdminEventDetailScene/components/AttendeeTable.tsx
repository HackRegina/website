'use client';

import { Check } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { AttendeeReport, IAttendeeWithPrediction } from '@/lib/attendeeReport';
import { ProbabilityBadge } from './ProbabilityBadge';

interface AttendeeTableProps {
  report: AttendeeReport;
}

const StatusBadge = ({ attendee }: { attendee: IAttendeeWithPrediction }) => {
  if (attendee.refunded) {
    return (
      <Badge className="bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-200">
        Refunded
      </Badge>
    );
  }
  if (attendee.cancelled) return <Badge>Cancelled</Badge>;
  return <Badge variant="primary">{attendee.status}</Badge>;
};

export const AttendeeTable = ({ report }: AttendeeTableProps) => {
  const [filter, setFilter] = useState('');
  const needle = filter.trim().toLowerCase();
  const rows = needle
    ? report.attendees.filter(
        (attendee) =>
          attendee.name?.toLowerCase().includes(needle) ||
          attendee.email?.toLowerCase().includes(needle),
      )
    : report.attendees;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          Attendees ({report.summary.total})
        </h3>
        <input
          type="search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by name or email"
          className="h-9 w-64 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:placeholder:text-gray-500 dark:focus-visible:ring-gray-300"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Ticket</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Checked in</TableHead>
            <TableHead>Show-up chance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((attendee) => (
            <TableRow
              key={attendee.id}
              className={attendee.probability === null ? 'opacity-60' : undefined}
            >
              <TableCell className="font-medium text-gray-900 dark:text-gray-50">
                {attendee.name ?? '—'}
              </TableCell>
              <TableCell className="text-gray-500 dark:text-gray-400">
                {attendee.email ?? '—'}
              </TableCell>
              <TableCell className="text-gray-700 dark:text-gray-300">
                {attendee.ticketClassName ?? '—'}
              </TableCell>
              <TableCell>
                <StatusBadge attendee={attendee} />
              </TableCell>
              <TableCell>
                {attendee.checkedIn ? (
                  <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <span className="text-gray-400 dark:text-gray-500">—</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-0.5">
                  <ProbabilityBadge probability={attendee.probability} isNew={attendee.isNew} />
                  {!attendee.isNew && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {attendee.pastCheckins}/{attendee.pastRegistrations} past events
                    </span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-gray-500 dark:text-gray-400">
                {report.summary.total === 0 ? 'No attendees yet.' : 'No attendees match the filter.'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
