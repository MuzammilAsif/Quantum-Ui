import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal } from 'lucide-react';
import { useAssetStore } from '../../store/assetStore';
import { cn } from '../../utils';
import type { AssetFilters, Difficulty, StyleTag } from './types';
import type { Framework } from '../../types';

// ─── Filter option definitions ────────────────────────────────────────────────

const FRAMEWORK_OPTIONS: Array<{ value: AssetFilters['framework']; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'react', label: 'React' },
    { value: 'html', label: 'HTML' },
    { value: 'tailwind', label: 'Tailwind' },
];

const DIFFICULTY_OPTIONS: Array<{ value: AssetFilters['difficulty']; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
];

const STYLE_OPTIONS: Array<{ value: AssetFilters['styleTag']; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'Modern', label: 'Modern' },
    { value: 'Minimal', label: 'Minimal' },
    { value: 'Glassmorphism', label: 'Glassmorphism' },
    { value: 'Gradient', label: 'Gradient' },
    { value: 'Dark', label: 'Dark' },
];

// ─── Pill button used for each filter option ──────────────────────────────────

interface FilterPillProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const FilterPill = memo(function FilterPill({
    label,
    isActive,
    onClick,
}: FilterPillProps) {
    return (
        <motion.button
            onClick={onClick}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 40 }}
            aria-pressed={isActive}
            className={cn(
                'flex-shrink-0 px-2.5 py-1 rounded-full text-2xs font-medium',
                'cursor-pointer transition-all duration-150 select-none border',
                isActive
                    ? 'bg-[var(--q-accent)] text-white border-[var(--q-accent)]'
                    : 'bg-q-elevated border-q-border text-q-text-muted hover:text-q-text hover:border-[var(--q-accent-border)]'
            )}
        >
            {label}
        </motion.button>
    );
});

// ─── A single filter group row ────────────────────────────────────────────────

interface FilterGroupProps {
    label: string;
    children: React.ReactNode;
}

function FilterGroup({ label, children }: FilterGroupProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <p className="text-2xs font-semibold uppercase tracking-widest text-q-text-faint px-0.5">
                {label}
            </p>
            <div className="flex flex-wrap gap-1.5">
                {children}
            </div>
        </div>
    );
}

// ─── Check if any filter is active ───────────────────────────────────────────

function hasActiveFilters(filters: AssetFilters): boolean {
    return (
        filters.framework !== 'all' ||
        filters.difficulty !== 'all' ||
        filters.styleTag !== 'all'
    );
}

// ─── Main FilterPanel ─────────────────────────────────────────────────────────

interface FilterPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * FilterPanel — collapsible panel with filter groups.
 *
 * Filter groups:
 * - Framework  (All / React / HTML / Tailwind)
 * - Difficulty (All / Beginner / Intermediate / Advanced)
 * - Style      (All / Modern / Minimal / Glassmorphism / Gradient / Dark)
 *
 * All filters combine with AND logic via the assetStore.
 */
export const FilterPanel = memo(function FilterPanel({
    isOpen,
    onClose,
}: FilterPanelProps) {
    const { filters, setFilter, clearFilters, visibleAssets } = useAssetStore();
    const filtersActive = hasActiveFilters(filters);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="filter-panel"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                >
                    <div className="flex flex-col gap-3 p-3 rounded-lg border border-q-border
            bg-q-elevated mb-3">

                        {/* ── Panel header ───────────────────────────────────────────── */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <SlidersHorizontal
                                    size={11}
                                    className="text-q-text-faint"
                                    aria-hidden="true"
                                />
                                <span className="text-2xs font-semibold text-q-text-muted">
                                    Filters
                                </span>
                                {filtersActive && (
                                    <span className="text-2xs text-q-text-faint">
                                        — {visibleAssets.length} results
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Clear all filters */}
                                <AnimatePresence>
                                    {filtersActive && (
                                        <motion.button
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.1 }}
                                            onClick={clearFilters}
                                            className="text-2xs text-[var(--q-accent)] hover:underline
                        cursor-pointer transition-colors duration-150"
                                        >
                                            Clear all
                                        </motion.button>
                                    )}
                                </AnimatePresence>

                                {/* Close panel */}
                                <button
                                    onClick={onClose}
                                    aria-label="Close filter panel"
                                    className="text-q-text-faint hover:text-q-text
                    cursor-pointer transition-colors duration-150"
                                >
                                    <X size={12} aria-hidden="true" />
                                </button>
                            </div>
                        </div>

                        {/* ── Framework filter ───────────────────────────────────────── */}
                        <FilterGroup label="Framework">
                            {FRAMEWORK_OPTIONS.map((option) => (
                                <FilterPill
                                    key={option.value}
                                    label={option.label}
                                    isActive={filters.framework === option.value}
                                    onClick={() =>
                                        setFilter('framework', option.value as Framework | 'all')
                                    }
                                />
                            ))}
                        </FilterGroup>

                        {/* ── Difficulty filter ──────────────────────────────────────── */}
                        <FilterGroup label="Difficulty">
                            {DIFFICULTY_OPTIONS.map((option) => (
                                <FilterPill
                                    key={option.value}
                                    label={option.label}
                                    isActive={filters.difficulty === option.value}
                                    onClick={() =>
                                        setFilter('difficulty', option.value as Difficulty | 'all')
                                    }
                                />
                            ))}
                        </FilterGroup>

                        {/* ── Style filter ───────────────────────────────────────────── */}
                        <FilterGroup label="Style">
                            {STYLE_OPTIONS.map((option) => (
                                <FilterPill
                                    key={option.value}
                                    label={option.label}
                                    isActive={filters.styleTag === option.value}
                                    onClick={() =>
                                        setFilter('styleTag', option.value as StyleTag | 'all')
                                    }
                                />
                            ))}
                        </FilterGroup>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
});