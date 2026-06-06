import { type ReactNode, memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils';
import { SLIDE_UP_VARIANTS } from '../constants';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  compact?: boolean;
}

/**
 * EmptyState — displayed when a page section has no content yet.
 * Used across all pages as a placeholder during the foundation phase.
 */
export const EmptyState = memo(function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <motion.div
      variants={SLIDE_UP_VARIANTS}
      initial="hidden"
      animate="visible"
      className={cn(
        'flex flex-col items-center text-center',
        compact ? 'gap-2 py-6' : 'gap-3 py-10',
        className
      )}
    >
      {/* Icon container with subtle glow ring */}
      <div
        className={cn(
          'flex items-center justify-center rounded-xl',
          'bg-q-elevated border border-q-border',
          'text-q-text-faint',
          compact ? 'w-9 h-9' : 'w-12 h-12'
        )}
        style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)' }}
      >
        {icon}
      </div>

      {/* Text */}
      <div className={cn('space-y-1', compact ? 'max-w-[160px]' : 'max-w-[200px]')}>
        <p className={cn(
          'font-medium text-q-text-muted',
          compact ? 'text-xs' : 'text-sm'
        )}>
          {title}
        </p>
        {description && (
          <p className="text-2xs text-q-text-faint leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* CTA */}
      {action && (
        <div className="mt-1">{action}</div>
      )}
    </motion.div>
  );
});