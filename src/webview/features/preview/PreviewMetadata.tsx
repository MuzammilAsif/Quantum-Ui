import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Info,
    Tag,
    ChevronDown,
    Star,
    Calendar,
    User,
    Hash,
} from 'lucide-react';
import { usePreviewStore } from '../../store/previewStore';
import { useFavoritesStore } from '../../store/favoritesStore';
import { useToast } from '../../hooks/useToast';
import { cn } from '../../utils';

// ─── Framework badge colors ───────────────────────────────────────────────────

const FRAMEWORK_COLORS: Record<string, string> = {
    react: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    vue: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    html: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    tailwind: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    angular: 'bg-red-500/10 text-red-400 border-red-500/20',
    svelte: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
};

// ─── Difficulty colors ────────────────────────────────────────────────────────

const DIFFICULTY_COLORS: Record<string, string> = {
    Beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Intermediate: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Advanced: 'bg-red-500/10 text-red-400 border-red-500/20',
};

// ─── Single detail row ────────────────────────────────────────────────────────

function DetailRow({
    icon,
    label,
    children,
}: {
    icon: React.ReactNode;
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-start gap-2 py-1.5
      border-b border-q-border-subtle last:border-b-0">
            <div className="flex items-center gap-1.5 w-20 flex-shrink-0 mt-0.5">
                <span className="text-q-text-faint">{icon}</span>
                <span className="text-2xs font-semibold text-q-text-faint">
                    {label}
                </span>
            </div>
            <div className="flex-1 min-w-0">{children}</div>
        </div>
    );
}

// ─── Main PreviewMetadata ─────────────────────────────────────────────────────

/**
 * PreviewMetadata — collapsible details panel below the preview area.
 *
 * Shows:
 * - Component title and description
 * - Framework and difficulty badges
 * - Tags
 * - Version, author, date added
 * - Favorite toggle
 */
export const PreviewMetadata = memo(function PreviewMetadata() {
    const { asset } = usePreviewStore();
    const { toggleFavorite, isFavorite } = useFavoritesStore();
    const { success } = useToast();

    const [isExpanded, setIsExpanded] = useState(true);

    if (!asset) return null;

    const favorited = isFavorite(asset.id);
    const frameworkColor =
        FRAMEWORK_COLORS[asset.framework] ?? FRAMEWORK_COLORS['react'];
    const difficultyColor =
        DIFFICULTY_COLORS[asset.difficulty] ?? '';

    const handleFavorite = () => {
        toggleFavorite(asset.id);
        if (!favorited) {
            success(`${asset.title} added to favorites`);
        }
    };

    return (
        <div className="flex-shrink-0 border-t border-q-border bg-q-base">

            {/* ── Collapse toggle header ──────────────────────────────────────── */}
            <button
                onClick={() => setIsExpanded((prev) => !prev)}
                aria-expanded={isExpanded}
                aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                className="flex items-center justify-between w-full
          px-3 py-2 cursor-pointer group"
            >
                <div className="flex items-center gap-1.5">
                    <Info
                        size={11}
                        className="text-q-text-faint"
                        aria-hidden="true"
                    />
                    <span className="text-2xs font-semibold text-q-text-faint
            group-hover:text-q-text-muted transition-colors duration-150">
                        Details
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Favorite button — always visible */}
                    <motion.button
                        onClick={(e) => { e.stopPropagation(); handleFavorite(); }}
                        aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
                        aria-pressed={favorited}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                        className="cursor-pointer"
                    >
                        <Star
                            size={12}
                            className={cn(
                                'transition-colors duration-150',
                                favorited
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-q-text-faint hover:text-amber-400'
                            )}
                            aria-hidden="true"
                        />
                    </motion.button>

                    {/* Expand chevron */}
                    <motion.div
                        animate={{ rotate: isExpanded ? 0 : -90 }}
                        transition={{ duration: 0.15 }}
                    >
                        <ChevronDown
                            size={11}
                            className="text-q-text-faint"
                            aria-hidden="true"
                        />
                    </motion.div>
                </div>
            </button>

            {/* ── Collapsible content ─────────────────────────────────────────── */}
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        key="metadata-content"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="px-3 pb-3 flex flex-col gap-3">

                            {/* ── Title and description ─────────────────────────────── */}
                            <div>
                                <h3 className="text-xs font-bold text-q-text leading-tight">
                                    {asset.title}
                                </h3>
                                <p className="text-2xs text-q-text-muted mt-0.5 leading-relaxed">
                                    {asset.description}
                                </p>
                            </div>

                            {/* ── Badges row ───────────────────────────────────────── */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <span className={cn(
                                    'inline-flex items-center px-1.5 py-0.5 rounded',
                                    'text-2xs font-semibold border uppercase tracking-wide',
                                    frameworkColor
                                )}>
                                    {asset.framework}
                                </span>

                                <span className={cn(
                                    'inline-flex items-center px-1.5 py-0.5 rounded',
                                    'text-2xs font-semibold border',
                                    difficultyColor
                                )}>
                                    {asset.difficulty}
                                </span>

                                {asset.styleTag && (
                                    <span className="inline-flex items-center px-1.5 py-0.5
                    rounded text-2xs font-semibold border
                    bg-[var(--q-accent-subtle)] border-[var(--q-accent-border)]
                    text-[var(--q-accent)]">
                                        {asset.styleTag}
                                    </span>
                                )}
                            </div>

                            {/* ── Detail rows ──────────────────────────────────────── */}
                            <div className="rounded-lg border border-q-border
                bg-q-elevated overflow-hidden px-3 py-1">

                                <DetailRow
                                    icon={<Hash size={10} />}
                                    label="ID"
                                >
                                    <span className="text-2xs font-mono text-q-text-muted">
                                        {asset.id}
                                    </span>
                                </DetailRow>

                                <DetailRow
                                    icon={<User size={10} />}
                                    label="Author"
                                >
                                    <span className="text-2xs text-q-text-muted">
                                        {asset.author}
                                    </span>
                                </DetailRow>

                                <DetailRow
                                    icon={<Hash size={10} />}
                                    label="Version"
                                >
                                    <span className="text-2xs font-mono text-q-text-muted">
                                        v{asset.version}
                                    </span>
                                </DetailRow>

                                <DetailRow
                                    icon={<Calendar size={10} />}
                                    label="Added"
                                >
                                    <span className="text-2xs text-q-text-muted">
                                        {asset.dateAdded}
                                    </span>
                                </DetailRow>
                            </div>

                            {/* ── Tags ─────────────────────────────────────────────── */}
                            {asset.tags.length > 0 && (
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-1">
                                        <Tag
                                            size={10}
                                            className="text-q-text-faint"
                                            aria-hidden="true"
                                        />
                                        <span className="text-2xs font-semibold text-q-text-faint">
                                            Tags
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {asset.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-1.5 py-0.5 rounded-full text-2xs
                          font-medium bg-q-elevated border border-q-border
                          text-q-text-muted"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});