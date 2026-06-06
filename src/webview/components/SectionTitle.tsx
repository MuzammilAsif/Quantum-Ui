import { type ReactNode, memo } from 'react';
import { cn } from '../utils';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

/**
 * SectionTitle — consistent heading block used throughout the sidebar pages.
 * Supports an optional right-aligned action slot (e.g. "See all" link).
 */
export const SectionTitle = memo(function SectionTitle({
  title,
  subtitle,
  action,
  className,
  size = 'md',
}: SectionTitleProps) {
  return (
    <div className={cn('flex items-center justify-between gap-2', className)}>
      <div className="min-w-0">
        <h2
          className={cn(
            'font-semibold text-q-text truncate',
            size === 'sm' ? 'text-2xs uppercase tracking-widest text-q-text-faint' : 'text-xs'
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-2xs text-q-text-faint mt-0.5 truncate">{subtitle}</p>
        )}
      </div>

      {action && (
        <div className="flex-shrink-0">{action}</div>
      )}
    </div>
  );
});