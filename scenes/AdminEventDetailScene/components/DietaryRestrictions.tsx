'use client';

import type { IAttendee } from '@/fetch/attendees';
import { isInactiveAttendee } from '@/utils/eventStats';

interface DietaryRestrictionsProps {
  attendees: IAttendee[];
}

export const DietaryRestrictions = ({ attendees }: DietaryRestrictionsProps) => {
  const withRestrictions = attendees.filter(
    (attendee) => attendee.dietaryRestrictions && !isInactiveAttendee(attendee),
  );

  return (
    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
        Dietary restrictions ({withRestrictions.length})
      </h3>
      {withRestrictions.length === 0 ? (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          No dietary restrictions reported.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {withRestrictions.map((attendee) => (
            <li key={attendee.id} className="text-sm">
              <span className="font-medium text-gray-900 dark:text-gray-50">
                {attendee.name ?? attendee.email ?? 'Unnamed attendee'}
              </span>
              <span className="text-gray-500 dark:text-gray-400"> · </span>
              <span className="text-gray-700 dark:text-gray-300">
                {attendee.dietaryRestrictions}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
