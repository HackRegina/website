import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary';
}

export function Badge({ children, className, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        variant === 'primary' && 'bg-primary-600 text-white dark:bg-primary-700 dark:text-white',
        variant === 'default' && 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
        className,
      )}
    >
      {children}
    </span>
  );
}
