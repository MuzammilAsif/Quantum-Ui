import { memo } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../utils';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md';
}

/**
 * ThemeToggle — animated pill toggle for switching dark ↔ light theme.
 * Syncs with the VS Code extension configuration.
 */
export const ThemeToggle = memo(function ThemeToggle({
  className,
  size = 'sm',
}: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={!isDark}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
      className={cn(
        'relative flex items-center gap-1 rounded-full cursor-pointer select-none',
        'border border-q-border bg-q-elevated',
        'hover:border-[var(--q-accent-border)] transition-colors duration-150',
        size === 'sm' ? 'h-6 w-12 px-1' : 'h-7 w-14 px-1.5',
        className
      )}
    >
      {/* Sliding thumb */}
      <motion.span
        layout
        animate={{ x: isDark ? 0 : '100%' }}
        transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 0.6 }}
        className={cn(
          'absolute flex items-center justify-center rounded-full',
          'bg-[var(--q-accent)] shadow-sm',
          size === 'sm' ? 'w-4 h-4 left-1' : 'w-5 h-5 left-1.5'
        )}
        style={{ boxShadow: '0 0 8px var(--q-accent-glow)' }}
      >
        {isDark ? (
          <Moon size={size === 'sm' ? 9 : 11} className="text-white" aria-hidden="true" />
        ) : (
          <Sun size={size === 'sm' ? 9 : 11} className="text-white" aria-hidden="true" />
        )}
      </motion.span>

      {/* Track icons */}
      <span className="flex items-center justify-between w-full px-0.5 pointer-events-none">
        <Moon
          size={size === 'sm' ? 9 : 11}
          className={cn(
            'transition-opacity duration-150',
            isDark ? 'opacity-0' : 'text-q-text-faint opacity-60'
          )}
          aria-hidden="true"
        />
        <Sun
          size={size === 'sm' ? 9 : 11}
          className={cn(
            'transition-opacity duration-150',
            !isDark ? 'opacity-0' : 'text-q-text-faint opacity-60'
          )}
          aria-hidden="true"
        />
      </span>
    </motion.button>
  );
});