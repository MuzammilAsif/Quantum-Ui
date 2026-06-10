import { memo, useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  X,
  Layers,
  Star,
} from 'lucide-react';
import { ContentContainer } from '../components/ContentContainer';
import { EmptyState } from '../Components/EmptyState';
import { ComponentCard } from '../features/Components/ComponentCard';
import { PreviewPanel } from '../features/Components/PreviewPanel';
import { FilterPanel } from '../features/Components/FilterPanel';
import { CategoryList } from '../features/Components/CategoryList';
import { useAssetStore } from '../store/assetStore';
import { TOTAL_ASSET_COUNT } from '../features/Components/data';
import { SEARCH_DEBOUNCE_MS } from '../constants';
import { cn } from '../utils';

// ─── Loading skeleton card ────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-lg border border-q-border bg-q-elevated overflow-hidden animate-pulse">
      <div className="h-[72px] bg-q-surface" />
      <div className="flex flex-col gap-2 p-2.5">
        <div className="h-3 w-3/4 rounded bg-q-overlay" />
        <div className="h-2 w-1/2 rounded bg-q-overlay" />
        <div className="flex items-center justify-between mt-1">
          <div className="h-4 w-12 rounded-full bg-q-overlay" />
          <div className="h-4 w-14 rounded bg-q-overlay" />
        </div>
      </div>
    </div>
  );
}

// ─── Empty state for no search results ───────────────────────────────────────

function NoResultsState({
  query,
  onClear,
}: {
  query: string;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col items-center text-center py-10 gap-3">
      <div className="w-12 h-12 rounded-xl bg-q-elevated border border-q-border
        flex items-center justify-center">
        <Search size={18} className="text-q-text-faint" aria-hidden="true" />
      </div>
      <div className="space-y-1 max-w-[200px]">
        <p className="text-xs font-semibold text-q-text-muted">
          No results for &ldquo;{query}&rdquo;
        </p>
        <p className="text-2xs text-q-text-faint leading-relaxed">
          Try different keywords or browse by category
        </p>
      </div>
      <button
        onClick={onClear}
        className="px-3 py-1.5 rounded-md text-2xs font-semibold
          bg-q-elevated border border-q-border text-q-text-muted
          hover:text-q-text hover:border-[var(--q-accent-border)]
          cursor-pointer transition-all duration-150"
      >
        Clear search
      </button>
    </div>
  );
}

// ─── Empty state for no category assets ──────────────────────────────────────

function NoCategoryState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center text-center py-10 gap-3">
      <div className="w-12 h-12 rounded-xl bg-q-elevated border border-q-border
        flex items-center justify-center">
        <Layers size={18} className="text-q-text-faint" aria-hidden="true" />
      </div>
      <div className="space-y-1 max-w-[200px]">
        <p className="text-xs font-semibold text-q-text-muted">
          No assets in this category
        </p>
        <p className="text-2xs text-q-text-faint leading-relaxed">
          Assets for this category are coming soon
        </p>
      </div>
      <button
        onClick={onClear}
        className="px-3 py-1.5 rounded-md text-2xs font-semibold
          bg-q-elevated border border-q-border text-q-text-muted
          hover:text-q-text hover:border-[var(--q-accent-border)]
          cursor-pointer transition-all duration-150"
      >
        View all assets
      </button>
    </div>
  );
}

// ─── Results header bar ───────────────────────────────────────────────────────

function ResultsBar({
  count,
  total,
  isFiltered,
  onClear,
}: {
  count: number;
  total: number;
  isFiltered: boolean;
  onClear: () => void;
}) {
  if (!isFiltered) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.15 }}
      className="flex items-center justify-between px-2.5 py-1.5 rounded-md
        bg-q-elevated border border-q-border"
    >
      <span className="text-2xs text-q-text-muted">
        Showing{' '}
        <span className="font-semibold text-q-text">{count}</span>
        {' '}of{' '}
        <span className="font-semibold text-q-text">{total}</span>
        {' '}assets
      </span>
      <button
        onClick={onClear}
        aria-label="Clear all filters and search"
        className="flex items-center gap-1 text-2xs text-q-text-faint
          hover:text-[var(--q-accent)] cursor-pointer transition-colors duration-150"
      >
        <X size={10} aria-hidden="true" />
        Clear
      </button>
    </motion.div>
  );
}

// ─── Main ComponentsPage ──────────────────────────────────────────────────────

/**
 * ComponentsPage — the main asset browser page.
 *
 * Layout (top to bottom):
 * 1. Search bar
 * 2. Filter toggle button + active filter indicator
 * 3. FilterPanel (collapsible)
 * 4. CategoryList (collapsible)
 * 5. Results bar (shown when filtered)
 * 6. Asset grid (ComponentCard list)
 * 7. PreviewPanel (overlay, slides up on card click)
 */
export const ComponentsPage = memo(function ComponentsPage() {
  const {
    visibleAssets,
    searchQuery,
    filters,
    activeCategory,
    isPreviewOpen,
    setSearchQuery,
    clearFilters,
  } = useAssetStore();

  // ── Local UI state ──────────────────────────────────────────────────────────
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Simulate initial load ───────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // ── Debounced search ────────────────────────────────────────────────────────
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalQuery(value);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        setSearchQuery(value);
      }, SEARCH_DEBOUNCE_MS);
    },
    [setSearchQuery]
  );

  // ── Clear search ────────────────────────────────────────────────────────────
  const handleClearSearch = useCallback(() => {
    setLocalQuery('');
    setSearchQuery('');
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  }, [setSearchQuery]);

  // ── Clear everything ────────────────────────────────────────────────────────
  const handleClearAll = useCallback(() => {
    handleClearSearch();
    clearFilters();
    setIsFilterOpen(false);
  }, [handleClearSearch, clearFilters]);

  // ── Cleanup debounce on unmount ─────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // ── Derived state ───────────────────────────────────────────────────────────
  const hasActiveFilters =
    filters.framework !== 'all' ||
    filters.difficulty !== 'all' ||
    filters.styleTag !== 'all';

  const isFiltered =
    localQuery.trim() !== '' ||
    hasActiveFilters ||
    activeCategory !== 'all';

  const showNoResults = !isLoading && visibleAssets.length === 0 && localQuery.trim() !== '';
  const showNoCategory = !isLoading && visibleAssets.length === 0 && localQuery.trim() === '';

  return (
    // Relative so PreviewPanel can be positioned absolutely inside
    <div className="relative flex flex-col h-full overflow-hidden">

      <ContentContainer className="flex-1 overflow-y-auto">

        {/* ── Search bar ───────────────────────────────────────────────────── */}
        <div className={cn(
          'flex items-center gap-2 h-8 px-2.5 rounded-md',
          'border bg-q-surface transition-all duration-150',
          localQuery
            ? 'border-[var(--q-accent-border)] shadow-[0_0_0_2px_var(--q-accent-subtle)]'
            : 'border-q-border focus-within:border-[var(--q-accent-border)]'
        )}>
          <Search
            size={11}
            className="text-q-text-faint flex-shrink-0"
            aria-hidden="true"
          />

          <input
            type="text"
            value={localQuery}
            onChange={handleSearchChange}
            placeholder={`Search ${TOTAL_ASSET_COUNT} assets…`}
            aria-label="Search assets"
            className="flex-1 bg-transparent text-xs text-q-text
              placeholder:text-q-text-faint outline-none
              caret-[var(--q-accent)]"
          />

          <AnimatePresence>
            {localQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.1 }}
                onClick={handleClearSearch}
                aria-label="Clear search"
                className="flex-shrink-0 text-q-text-faint hover:text-q-text
                  cursor-pointer transition-colors duration-100"
              >
                <X size={11} aria-hidden="true" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* ── Filter toggle row ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-2">
          <motion.button
            onClick={() => setIsFilterOpen((prev) => !prev)}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 500, damping: 40 }}
            aria-expanded={isFilterOpen}
            aria-label={isFilterOpen ? 'Close filters' : 'Open filters'}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md',
              'text-2xs font-semibold border cursor-pointer transition-all duration-150',
              isFilterOpen || hasActiveFilters
                ? 'bg-[var(--q-accent-subtle)] border-[var(--q-accent-border)] text-[var(--q-accent)]'
                : 'bg-q-elevated border-q-border text-q-text-muted hover:text-q-text hover:border-[var(--q-accent-border)]'
            )}
          >
            <SlidersHorizontal size={11} aria-hidden="true" />
            Filters
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--q-accent)]"
                aria-hidden="true" />
            )}
          </motion.button>

          {/* Asset count */}
          <span className="text-2xs text-q-text-faint">
            {visibleAssets.length} asset{visibleAssets.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* ── Filter panel ─────────────────────────────────────────────────── */}
        <FilterPanel
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        />

        {/* ── Category list ─────────────────────────────────────────────────── */}
        <CategoryList />

        {/* ── Divider ──────────────────────────────────────────────────────── */}
        <div className="q-divider" aria-hidden="true" />

        {/* ── Results bar ──────────────────────────────────────────────────── */}
        <AnimatePresence>
          {isFiltered && (
            <ResultsBar
              count={visibleAssets.length}
              total={TOTAL_ASSET_COUNT}
              isFiltered={isFiltered}
              onClear={handleClearAll}
            />
          )}
        </AnimatePresence>

        {/* ── Asset grid ───────────────────────────────────────────────────── */}
        {isLoading ? (
          // Loading skeletons
          <div className="grid grid-cols-1 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : showNoResults ? (
          // No search results
          <NoResultsState
            query={localQuery}
            onClear={handleClearSearch}
          />
        ) : showNoCategory ? (
          // No assets in this category yet
          <NoCategoryState onClear={handleClearAll} />
        ) : (
          // Asset grid
          <motion.div
            layout
            className="grid grid-cols-1 gap-2"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {visibleAssets.map((asset, index) => (
                <motion.div
                  key={asset.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.2,
                      delay: index < 10 ? index * 0.03 : 0,
                    },
                  }}
                  exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.1 } }}
                >
                  <ComponentCard asset={asset} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </ContentContainer>

      {/* ── Preview panel overlay ─────────────────────────────────────────── */}
      {isPreviewOpen && <PreviewPanel />}

    </div>
  );
});