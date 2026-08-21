'use client';

import { Badge } from '@/components/ui/badge';

interface ProbabilityBadgeProps {
  probability: number | null;
  isNew: boolean;
}

const tierClasses = (percent: number): string => {
  if (percent >= 75) {
    return 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200';
  }
  if (percent >= 50) {
    return 'bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200';
  }
  return 'bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-200';
};

export const ProbabilityBadge = ({ probability, isNew }: ProbabilityBadgeProps) => {
  if (probability === null) {
    return <span className="text-gray-400 dark:text-gray-500">—</span>;
  }
  const percent = Math.round(probability * 100);
  return (
    <span className="inline-flex items-center gap-1.5">
      <Badge className={tierClasses(percent)}>{percent}%</Badge>
      {isNew && (
        <Badge className="bg-secondary-200 text-secondary-900 dark:bg-secondary-900 dark:text-secondary-200">
          New
        </Badge>
      )}
    </span>
  );
};
