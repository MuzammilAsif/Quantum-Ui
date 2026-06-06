import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils';

type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg';
type IconButtonVariant = 'ghost' | 'subtle' | 'filled' | 'danger';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string; // Required for accessibility
  size?: IconButtonSize;
  variant?: IconButtonVariant;
  isActive?: boolean;
  isLoading?: boolean;
  tooltip?: string;
}

const sizeClasses: Record<IconButtonSize, string> = {
  xs: 'w-5 h-5 rounded-[4px]',
  sm: 'w-6 h-6 rounded-[5px]',
  md: 'w-7 h-7 rounded-[6px]',
  lg: 'w-8 h-8 rounded-[7px]',
};

const iconSizes: Record<IconButtonSize, number> = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
};

const variantClasses: Record<IconButtonVariant, string> = {
  ghost:
    'text-q-text-muted hover:text-q-text hover:bg-q-elevated focus-visible:bg-q-elevated',
  subtle:
    'text-q-text-muted bg-q-elevated hover:text-q-text hover:bg-q-overlay focus-visible:bg-q-overlay border border-q-border',
  filled:
    'text-white bg-[var(--q-accent)] hover:bg-[var(--q-accent-hover)] shadow-sm',
  danger:
    'text-q-text-muted hover:text-red-400 hover:bg-red-500/10',
};

/**
 * IconButton — accessible, size-variant icon button with smooth hover animation.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      label,
      size = 'md',
      variant = 'ghost',
      isActive = false,
      isLoading = false,
      className,
      disabled,
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        aria-label={label}
        aria-pressed={isActive}
        disabled={isDisabled}
        whileHover={isDisabled ? {} : { scale: 1.05 }}
        whileTap={isDisabled ? {} : { scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 0.6 }}
        className={cn(
          'inline-flex items-center justify-center',
          'transition-colors duration-150 cursor-pointer select-none',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          sizeClasses[size],
          variantClasses[variant],
          isActive && variant === 'ghost' && 'text-[var(--q-accent)] bg-[var(--q-accent-subtle)]',
          className
        )}
        {...(rest as object)}
      >
        {isLoading ? (
          <svg
            className="animate-spin"
            width={iconSizes[size]}
            height={iconSizes[size]}
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="8" cy="8" r="6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="20"
              strokeDashoffset="8"
              opacity="0.4"
            />
            <path
              d="M8 2a6 6 0 0 1 6 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          icon
        )}
      </motion.button>
    );
  }
);

IconButton.displayName = 'IconButton';