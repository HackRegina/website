import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number;
  className?: string;
  barClassName?: string;
  children?: React.ReactNode;
  size?: 'xs' | 'md';
}

export function Progress({ value, className, barClassName, children, size = 'xs' }: ProgressProps) {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800',
        size === 'xs' && 'h-1',
        size === 'md' && 'h-4',
        className,
      )}
    >
      <div
        className={cn('h-full bg-primary-600 dark:bg-primary-700 transition-all', barClassName)}
        style={{ width: `${value}%` }}
      />
      {children}
    </div>
  );
}
