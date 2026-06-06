import { useRef, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, ArrowRight } from 'lucide-react';
import { cn } from '../utils';
import { useSearch } from '../hooks/useSearch';

interface SearchBarProps {
  className?: string;
}

/**
 * SearchBar — full-featured search input with recent searches dropdown.
 * Expands inline when activated, collapses on blur/escape.
 */
export const SearchBar = memo(function SearchBar({ className }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    query,
    isOpen,
    isFocused,
    isSearching,
    recentSearches,
    handleQueryChange,
    handleSubmit,
    handleClear,
    handleSelectRecent,
    openSearch,
    setFocused,
    removeRecentSearch,
  } = useSearch();

  const showDropdown = isFocused && !query && recentSearches.length > 0;

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') {
      handleClear();
      inputRef.current?.blur();
    }
  };

  return (
    <div className={cn('relative', className)}>
      <motion.div
        layout
        className={cn(
          'flex items-center gap-2 h-8 px-2.5 rounded-md',
          'border border-q-border bg-q-surface',
          'transition-all duration-200',
          isFocused && 'border-[var(--q-accent-border)] bg-q-elevated shadow-[0_0_0_2px_var(--q-accent-subtle)]'
        )}
      >
        {/* Search icon / spinner */}
        <div className="flex-shrink-0 text-q-text-faint">
          {isSearching ? (
            <svg
              className="animate-spin text-[var(--q-accent)]"
              width={12} height={12} viewBox="0 0 16 16" fill="none"
            >
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"
                strokeDasharray="20" strokeDashoffset="8" opacity="0.4" />
              <path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor"
                strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            <Search size={12} />
          )}
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => { setFocused(true); openSearch(); }}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder="Search components…"
          aria-label="Search Quantum UI"
          className={cn(
            'flex-1 min-w-0 bg-transparent border-none outline-none',
            'text-xs text-q-text placeholder:text-q-text-faint',
            'caret-[var(--q-accent)]'
          )}
        />

        {/* Clear button */}
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.1 }}
              onClick={handleClear}
              aria-label="Clear search"
              className="flex-shrink-0 text-q-text-faint hover:text-q-text
                rounded transition-colors duration-100 cursor-pointer"
            >
              <X size={11} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Recent searches dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className={cn(
              'absolute top-full left-0 right-0 mt-1 z-40',
              'glass-elevated rounded-md overflow-hidden',
              'border border-q-border shadow-q-lg py-1'
            )}
          >
            <p className="px-3 py-1.5 text-2xs font-semibold uppercase tracking-widest
              text-q-text-faint">
              Recent
            </p>

            {recentSearches.slice(0, 6).map((item) => (
              <div
                key={item}
                className="group flex items-center gap-2 px-3 py-1.5
                  hover:bg-q-elevated cursor-pointer transition-colors duration-100"
                onMouseDown={() => handleSelectRecent(item)}
              >
                <Clock size={11} className="text-q-text-faint flex-shrink-0" />
                <span className="flex-1 text-xs text-q-text-muted group-hover:text-q-text
                  transition-colors truncate">
                  {item}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100
                  transition-opacity">
                  <button
                    onMouseDown={(e) => { e.stopPropagation(); removeRecentSearch(item); }}
                    aria-label={`Remove ${item} from recent searches`}
                    className="text-q-text-faint hover:text-q-text transition-colors cursor-pointer"
                  >
                    <X size={10} />
                  </button>
                  <ArrowRight size={10} className="text-q-text-faint" />
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});