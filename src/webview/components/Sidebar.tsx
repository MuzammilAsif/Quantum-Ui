import { memo } from 'react';
import { motion } from 'framer-motion';
import { User, ChevronRight } from 'lucide-react';
import { NavigationItem } from './NavigationItem';
import { ThemeToggle } from './ThemeToggle';
import { IconButton } from './IconButton';
import { useNavigation } from '../hooks/useNavigation';
import { useUserStore } from '../store';
import { NAV_ITEMS_CONFIG } from '../constants';
import { cn } from '../utils';
import { EXTENSION_VERSION } from '../../shared/constants';

interface SidebarProps {
  className?: string;
}

/**
 * Sidebar — the vertical navigation rail.
 *
 * Sections:
 * 1. Nav items (Home, Components, Templates, AI Studio, Favorites, History)
 * 2. Footer (User avatar, Theme toggle, Version, Compact toggle)
 */
export const Sidebar = memo(function Sidebar({ className }: SidebarProps) {
  const { navigate, isActive, isCompact, toggleCompact } = useNavigation();
  const { profile, isAuthenticated } = useUserStore();

  return (
    <nav
      role="navigation"
      aria-label="Quantum UI navigation"
      className={cn(
        'flex flex-col flex-shrink-0 h-full',
        'border-r border-q-border-subtle bg-q-base',
        'transition-all duration-200',
        isCompact ? 'w-[48px]' : 'w-full',
        className
      )}
    >
      {/* ── Navigation Items ─────────────────────────── */}
      <div className={cn('flex-1 flex flex-col gap-0.5 overflow-y-auto py-2', isCompact ? 'px-1.5' : 'px-2')}>
        {NAV_ITEMS_CONFIG.map((item) => (
          <NavigationItem
            key={item.id}
            item={item}
            isActive={isActive(item.id)}
            isCompact={isCompact}
            onClick={() => navigate(item.id)}
          />
        ))}
      </div>

      {/* ── Divider ───────────────────────────────────── */}
      <div className="q-divider mx-2" aria-hidden="true" />

      {/* ── Footer ───────────────────────────────────── */}
      <div className={cn(
        'flex flex-col gap-2 py-2',
        isCompact ? 'px-1.5 items-center' : 'px-2'
      )}>

        {/* User profile row */}
        <motion.div
          className={cn(
            'flex items-center rounded-md cursor-pointer',
            'hover:bg-q-elevated transition-colors duration-150',
            isCompact ? 'justify-center p-1.5' : 'gap-2 px-2 py-1.5'
          )}
          whileTap={{ scale: 0.97 }}
          title={isCompact ? (isAuthenticated ? profile?.displayName : 'Sign in') : undefined}
        >
          {/* Avatar */}
          <div className={cn(
            'flex-shrink-0 flex items-center justify-center rounded-full',
            'bg-q-elevated border border-q-border',
            isAuthenticated
              ? 'border-[var(--q-accent-border)]'
              : '',
            'w-6 h-6'
          )}>
            {isAuthenticated && profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.displayName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User size={11} className="text-q-text-faint" aria-hidden="true" />
            )}
          </div>

          {/* Name / sign-in prompt */}
          {!isCompact && (
            <div className="flex-1 min-w-0">
              {isAuthenticated && profile ? (
                <>
                  <p className="text-2xs font-medium text-q-text truncate leading-tight">
                    {profile.displayName}
                  </p>
                  <p className="text-2xs text-q-text-faint truncate leading-tight capitalize">
                    {profile.plan} plan
                  </p>
                </>
              ) : (
                <p className="text-2xs text-q-text-faint">Sign in</p>
              )}
            </div>
          )}
        </motion.div>

        {/* Theme + compact row */}
        {!isCompact && (
          <div className="flex items-center justify-between px-1">
            <ThemeToggle size="sm" />
            <span className="text-2xs text-q-text-ghost select-none">
              v{EXTENSION_VERSION}
            </span>
          </div>
        )}

        {/* Compact toggle */}
        <IconButton
          icon={
            <ChevronRight
              size={12}
              className={cn('transition-transform duration-200', isCompact ? '' : 'rotate-180')}
              aria-hidden="true"
            />
          }
          label={isCompact ? 'Expand sidebar' : 'Collapse sidebar'}
          size="sm"
          variant="ghost"
          onClick={toggleCompact}
          className={cn('self-center', isCompact && 'mx-auto')}
        />
      </div>
    </nav>
  );
});