import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MousePointerClick,
    LayoutDashboard,
    TextCursorInput,
    KeyRound,
    CircleDot,
    CheckSquare,
    ClipboardList,
    AppWindow,
    Navigation,
    Table,
    BellRing,
    Layers,
    ChevronDown,
    ChevronRight,
    type LucideIcon,
} from 'lucide-react';
import { useAssetStore } from '../../store/assetStore';
import { CATEGORIES } from './data/categories';
import { cn } from '../../utils';
import type { CategoryId } from './types';

// ─── Icon map ─────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
    MousePointerClick,
    LayoutDashboard,
    TextCursorInput,
    KeyRound,
    CircleDot,
    CheckSquare,
    ClipboardList,
    AppWindow,
    Navigation,
    Table,
    BellRing,
    Layers,
};

// ─── Icon background colors per category ─────────────────────────────────────

const ICON_COLORS: Record<CategoryId, string> = {
    'buttons': 'bg-violet-500/15 text-violet-400',
    'cards': 'bg-blue-500/15 text-blue-400',
    'inputs': 'bg-emerald-500/15 text-emerald-400',
    'password-fields': 'bg-amber-500/15 text-amber-400',
    'radio-buttons': 'bg-pink-500/15 text-pink-400',
    'checkboxes': 'bg-cyan-500/15 text-cyan-400',
    'forms': 'bg-orange-500/15 text-orange-400',
    'modals': 'bg-red-500/15 text-red-400',
    'navigation': 'bg-indigo-500/15 text-indigo-400',
    'tables': 'bg-teal-500/15 text-teal-400',
    'alerts': 'bg-yellow-500/15 text-yellow-400',
    'backgrounds': 'bg-purple-500/15 text-purple-400',
};

// ─── Single category row ──────────────────────────────────────────────────────

interface CategoryRowProps {
    categoryId: CategoryId;
    name: string;
    iconName: string;
    count: number;
    isActive: boolean;
    onClick: () => void;
}

const CategoryRow = memo(function CategoryRow({
    categoryId,
    name,
    iconName,
    count,
    isActive,
    onClick,
}: CategoryRowProps) {
    const Icon = ICON_MAP[iconName] ?? Layers;
    const iconColor = ICON_COLORS[categoryId];

    return (
        <motion.button
            onClick={onClick}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 500, damping: 40 }}
            aria-pressed={isActive}
            className={cn(
                'group flex items-center gap-2.5 w-full px-2 py-2 rounded-md',
                'cursor-pointer transition-colors duration-150 select-none',
                isActive
                    ? 'bg-[var(--q-accent-subtle)] border border-[var(--q-accent-border)]'
                    : 'border border-transparent hover:bg-q-elevated hover:border-q-border'
            )}
        >
            {/* Icon */}
            <div className={cn(
                'flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center',
                iconColor
            )}>
                <Icon size={12} aria-hidden="true" />
            </div>

            {/* Name */}
            <span className={cn(
                'flex-1 text-left text-xs font-medium truncate transition-colors duration-150',
                isActive
                    ? 'text-q-text'
                    : 'text-q-text-muted group-hover:text-q-text'
            )}>
                {name}
            </span>

            {/* Count badge */}
            {count > 0 && (
                <span className={cn(
                    'flex-shrink-0 text-2xs font-semibold px-1.5 py-0.5 rounded-full',
                    'transition-colors duration-150',
                    isActive
                        ? 'bg-[var(--q-accent)] text-white'
                        : 'bg-q-overlay text-q-text-faint group-hover:bg-q-elevated'
                )}>
                    {count}
                </span>
            )}

            {/* Arrow */}
            <ChevronRight
                size={11}
                className={cn(
                    'flex-shrink-0 transition-all duration-150',
                    isActive
                        ? 'text-[var(--q-accent)]'
                        : 'text-q-text-ghost group-hover:text-q-text-faint'
                )}
                aria-hidden="true"
            />
        </motion.button>
    );
});

// ─── Main CategoryList ────────────────────────────────────────────────────────

interface CategoryListProps {
    className?: string;
}

/**
 * CategoryList — expandable list of all asset categories.
 *
 * Features:
 * - Shows all 12 categories with icons and live asset counts
 * - Clicking a category filters the asset grid instantly
 * - Collapsible — can be hidden to give more space to the asset grid
 * - Active category highlighted with accent color
 * - Counts update automatically as assets are added to the registry
 */
export const CategoryList = memo(function CategoryList({
    className,
}: CategoryListProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const { activeCategory, setActiveCategory, getCategoryCount } = useAssetStore();

    const handleCategoryClick = (categoryId: CategoryId) => {
        if (activeCategory === categoryId) {
            // Clicking the same category again resets to all
            setActiveCategory('all');
        } else {
            setActiveCategory(categoryId);
        }
    };

    return (
        <div className={cn('flex flex-col', className)}>

            {/* ── Section header ─────────────────────────────────────────────────── */}
            <button
                onClick={() => setIsExpanded((prev) => !prev)}
                aria-expanded={isExpanded}
                aria-label={isExpanded ? 'Collapse categories' : 'Expand categories'}
                className="flex items-center justify-between px-1 py-1.5
          cursor-pointer group select-none"
            >
                <span className="text-2xs font-bold uppercase tracking-widest
          text-q-text-faint group-hover:text-q-text-muted transition-colors duration-150">
                    Categories
                </span>

                <motion.div
                    animate={{ rotate: isExpanded ? 0 : -90 }}
                    transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                >
                    <ChevronDown
                        size={11}
                        className="text-q-text-faint group-hover:text-q-text-muted
              transition-colors duration-150"
                        aria-hidden="true"
                    />
                </motion.div>
            </button>

            {/* ── Category rows ───────────────────────────────────────────────────── */}
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        key="categories"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="flex flex-col gap-0.5 pt-1">

                            {/* All assets row */}
                            <motion.button
                                onClick={() => setActiveCategory('all')}
                                whileHover={{ x: 2 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                                aria-pressed={activeCategory === 'all'}
                                className={cn(
                                    'group flex items-center gap-2.5 w-full px-2 py-2 rounded-md',
                                    'cursor-pointer transition-colors duration-150 select-none',
                                    activeCategory === 'all'
                                        ? 'bg-[var(--q-accent-subtle)] border border-[var(--q-accent-border)]'
                                        : 'border border-transparent hover:bg-q-elevated hover:border-q-border'
                                )}
                            >
                                {/* Icon */}
                                <div className="flex-shrink-0 w-6 h-6 rounded-md flex items-center
                  justify-center bg-[var(--q-accent-subtle)] text-[var(--q-accent)]">
                                    <Layers size={12} aria-hidden="true" />
                                </div>

                                <span className={cn(
                                    'flex-1 text-left text-xs font-medium',
                                    activeCategory === 'all' ? 'text-q-text' : 'text-q-text-muted group-hover:text-q-text'
                                )}>
                                    All Assets
                                </span>

                                <span className={cn(
                                    'flex-shrink-0 text-2xs font-semibold px-1.5 py-0.5 rounded-full',
                                    activeCategory === 'all'
                                        ? 'bg-[var(--q-accent)] text-white'
                                        : 'bg-q-overlay text-q-text-faint group-hover:bg-q-elevated'
                                )}>
                                    {CATEGORIES.reduce((sum, cat) => sum + getCategoryCount(cat.id), 0)}
                                </span>

                                <ChevronRight
                                    size={11}
                                    className={cn(
                                        'flex-shrink-0 transition-colors duration-150',
                                        activeCategory === 'all'
                                            ? 'text-[var(--q-accent)]'
                                            : 'text-q-text-ghost group-hover:text-q-text-faint'
                                    )}
                                    aria-hidden="true"
                                />
                            </motion.button>

                            {/* Individual category rows */}
                            {CATEGORIES.map((category) => {
                                const count = getCategoryCount(category.id);
                                return (
                                    <CategoryRow
                                        key={category.id}
                                        categoryId={category.id}
                                        name={category.name}
                                        iconName={category.icon}
                                        count={count}
                                        isActive={activeCategory === category.id}
                                        onClick={() => handleCategoryClick(category.id)}
                                    />
                                );
                            })}

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
});