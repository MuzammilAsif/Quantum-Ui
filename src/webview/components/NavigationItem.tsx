import { memo } from 'react';
import { motion } from 'framer-motion';
import {
  Home, Layers, Layout, Sparkles, Star, Clock,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '../utils';
import type { NavItem } from '../types';

const ICON_MAP: Record<string, LucideIcon> = {
  Home,
  Layers,
  Layout,
  Sparkles,
  Star,
  Clock,
};

interface NavigationItemProps {
  item: NavItem;
  isActive: boolean;
  isCompact?: boolean;
  onClick: () => void;
}

/**
 * NavigationItem — animated sidebar navigation button.
 * Renders icon + label in full mode, icon-only in compact mode.
 * Shows active indicator bar, glow on hover, and smooth spring transitions.
 */
export const NavigationItem = memo(function NavigationItem({
  item,
  isActive,
  isCompact = false,
  onClick,
}: NavigationItemProps) {
  const Icon = ICON_MAP[item.icon] ?? Home;

  return (
    <motion.button
      onClick={onClick}
      aria-label={item.label}
      aria-current={isActive ? 'page' : undefined}
      title={isCompact ? item.label : undefined}
      whileHover={{ x: isCompact ? 0 : 2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 0.6 }}
      className={cn(
        'relative group flex items-center w-full cursor-pointer select-none',
        'rounded-md transition-colors duration-150',
        isCompact
          ? 'justify-center h-8 w-8 mx-auto'
          : 'gap-2.5 px-2.5 h-8',
        isActive
          ? 'text-q-text bg-[var(--q-accent-subtle)]'
          : 'text-q-text-muted hover:text-q-text hover:bg-q-elevated'
      )}
    >
      {/* Active left-edge indicator bar */}
      {isActive && (
        <motion.span
          layoutId="nav-active-indicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4
            bg-[var(--q-accent)] rounded-r-full"
          style={{ boxShadow: '0 0 8px var(--q-accent-glow)' }}
          transition={{ type: 'spring', stiffness: 500, damping: 40 }}
        />
      )}

      {/* Icon */}
      <span
        className={cn(
          'flex-shrink-0 transition-all duration-150',
          isActive
            ? 'text-[var(--q-accent)]'
            : 'text-q-text-faint group-hover:text-q-text-muted'
        )}
        style={isActive ? { filter: 'drop-shadow(0 0 6px var(--q-accent-glow))' } : undefined}
      >
        <Icon size={14} strokeWidth={isActive ? 2 : 1.75} aria-hidden="true" />
      </span>

      {/* Label (hidden in compact mode) */}
      {!isCompact && (
        <span className={cn(
          'flex-1 text-left text-xs font-medium truncate transition-colors duration-150',
          isActive ? 'text-q-text' : 'text-q-text-muted group-hover:text-q-text'
        )}>
          {item.label}
        </span>
      )}

     {/* Badges — full pill in expanded mode, small dot in compact mode */}
      {!isCompact ? (
        <span className="flex-shrink-0 flex items-center gap-1">
          {item.isNew && (
            <span className="q-pill-new">New</span>
          )}
          {item.badge !== undefined && item.badge > 0 && (
            <span className="q-badge">{item.badge}</span>
          )}
        </span>
      ) : (
        item.isNew && (
          <span
            className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full
              bg-[var(--q-accent)]"
            style={{ boxShadow: '0 0 4px var(--q-accent-glow)' }}
            aria-hidden="true"
          />
        )
      )}
    </motion.button>
  );
});