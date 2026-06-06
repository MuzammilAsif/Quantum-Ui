import { memo } from 'react';
import { motion } from 'framer-motion';
import { Search, Settings, Zap } from 'lucide-react';
import { IconButton } from './IconButton';
import { SearchBar } from './SearchBar';
import { AnimatePresence } from 'framer-motion';
import { useSidebarStore } from '../store';
import { useNavigation } from '../hooks/useNavigation';
import { cn } from '../utils';

interface HeaderProps {
  className?: string;
}

/**
 * Header — top bar of the Quantum UI sidebar.
 *
 * Layout:
 * [Logo + Name]  [Search icon]  [Settings icon]
 *
 * When search is toggled, the logo row slides up and SearchBar takes its place.
 */
export const Header = memo(function Header({ className }: HeaderProps) {
  const { isSearchOpen, toggleSearch, closeSearch } = useSidebarStore();
  const { navigate } = useNavigation();

  return (
    <header
      className={cn(
        'flex-shrink-0 flex flex-col gap-2 px-3 pt-3 pb-2',
        'border-b border-q-border-subtle',
        className
      )}
      role="banner"
    >
      <div className="flex items-center gap-2 h-7">
        <AnimatePresence mode="wait" initial={false}>
          {isSearchOpen ? (
            /* ── Search mode ─────────────────────────── */
            <motion.div
              key="search"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
              className="flex-1"
            >
              <SearchBar />
            </motion.div>
          ) : (
            /* ── Brand mode ──────────────────────────── */
            <motion.div
              key="brand"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
              className="flex items-center gap-2 flex-1 min-w-0"
            >
              {/* Logo mark */}
              <div
                className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #22bcff 100%)',
                  boxShadow: '0 0 12px rgba(139,92,246,0.4)',
                }}
                aria-hidden="true"
              >
                <Zap size={12} className="text-white" strokeWidth={2.5} />
              </div>

              {/* Wordmark */}
              <div className="min-w-0">
                <span className="text-xs font-bold tracking-tight text-gradient select-none">
                  Quantum
                </span>
                <span className="text-xs font-bold tracking-tight text-q-text-muted select-none">
                  {' '}UI
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <IconButton
            icon={<Search size={13} />}
            label={isSearchOpen ? 'Close search' : 'Open search'}
            size="sm"
            variant="ghost"
            isActive={isSearchOpen}
            onClick={isSearchOpen ? closeSearch : toggleSearch}
          />
          <IconButton
            icon={<Settings size={13} />}
            label="Open settings"
            size="sm"
            variant="ghost"
            onClick={() => navigate('settings' as Parameters<typeof navigate>[0])}
          />
        </div>
      </div>
    </header>
  );
});