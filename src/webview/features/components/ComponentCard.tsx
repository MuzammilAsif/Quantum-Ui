import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Star, Eye } from 'lucide-react';
import { useAssetStore } from '../../store/assetStore';
import { useFavoritesStore } from '../../store/favoritesStore';
import { useToast } from '../../hooks/useToast';
import { cn } from '../../utils';
import type { Asset } from './types';

interface ComponentCardProps {
    asset: Asset;
}

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
    Beginner: 'text-emerald-400',
    Intermediate: 'text-amber-400',
    Advanced: 'text-red-400',
};

/**
 * ComponentCard — displays a single asset in the component browser grid.
 *
 * On click: calls assetStore.selectAsset() which the PreviewEngine
 * watches and uses to open the preview panel automatically.
 *
 * No direct reference to PreviewEngine or PreviewPanel here —
 * the connection is purely through the assetStore.
 */
export const ComponentCard = memo(function ComponentCard({
    asset,
}: ComponentCardProps) {
    const [copied, setCopied] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const { selectAsset } = useAssetStore();
    const { toggleFavorite, isFavorite } = useFavoritesStore();
    const { success, error } = useToast();

    const favorited = isFavorite(asset.id);
    const frameworkColor =
        FRAMEWORK_COLORS[asset.framework] ?? FRAMEWORK_COLORS['react'];
    const difficultyColor =
        DIFFICULTY_COLORS[asset.difficulty] ?? 'text-q-text-faint';

    // ── Open preview via assetStore ───────────────────────────────────────────
    // PreviewEngine watches assetStore.selectedAsset and opens automatically
    const handleOpen = () => {
        selectAsset(asset);
    };

    // ── Copy code to clipboard ────────────────────────────────────────────────
    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        const code =
            asset.code.react ??
            asset.code.html ??
            asset.code.tailwind ??
            '';

        if (!code) {
            error('No code available');
            return;
        }

        void navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            success(`${asset.title} copied!`);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    // ── Toggle favorite ───────────────────────────────────────────────────────
    const handleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleFavorite(asset.id);
        if (!favorited) {
            success(`${asset.title} added to favorites`);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={handleOpen}
            className={cn(
                'group relative flex flex-col rounded-lg border cursor-pointer',
                'bg-q-elevated transition-all duration-150 overflow-hidden',
                isHovered
                    ? 'border-[var(--q-accent-border)]'
                    : 'border-q-border'
            )}
        >

            {/* ── Preview area ───────────────────────────────────────────────── */}
            <div className={cn(
                'relative flex items-center justify-center h-[72px]',
                'bg-q-surface border-b border-q-border-subtle overflow-hidden',
                'transition-colors duration-150',
                isHovered && 'bg-q-elevated'
            )}>

                {/* Grid pattern background */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
                        backgroundSize: '16px 16px',
                    }}
                />

                {/* Asset ID badge */}
                <div className="relative flex flex-col items-center gap-1 px-3">
                    <span className={cn(
                        'text-2xs font-mono font-semibold px-2 py-0.5 rounded',
                        'bg-[var(--q-accent-subtle)] border border-[var(--q-accent-border)]',
                        'text-[var(--q-accent)] truncate max-w-[140px]'
                    )}>
                        {asset.id}
                    </span>
                </div>

                {/* Hover overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.1 }}
                    className="absolute inset-0 flex items-center justify-center
            bg-q-base/60 backdrop-blur-sm"
                >
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full
            bg-q-elevated border border-q-border
            text-xs font-medium text-q-text">
                        <Eye size={11} aria-hidden="true" />
                        Preview
                    </div>
                </motion.div>
            </div>

            {/* ── Card body ──────────────────────────────────────────────────── */}
            <div className="flex flex-col gap-2 p-2.5">

                {/* Title row */}
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-q-text truncate
              leading-tight">
                            {asset.title}
                        </p>
                        <p className={cn('text-2xs mt-0.5', difficultyColor)}>
                            {asset.difficulty}
                        </p>
                    </div>

                    {/* Favorite button */}
                    <motion.button
                        onClick={handleFavorite}
                        aria-label={
                            favorited
                                ? 'Remove from favorites'
                                : 'Add to favorites'
                        }
                        aria-pressed={favorited}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                        className="flex-shrink-0 cursor-pointer transition-colors
              duration-150"
                    >
                        <Star
                            size={13}
                            className={cn(
                                'transition-colors duration-150',
                                favorited
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-q-text-faint hover:text-amber-400'
                            )}
                            aria-hidden="true"
                        />
                    </motion.button>
                </div>

                {/* Bottom row */}
                <div className="flex items-center justify-between gap-2">

                    {/* Framework badge */}
                    <span className={cn(
                        'inline-flex items-center px-1.5 py-0.5 rounded text-2xs',
                        'font-semibold border uppercase tracking-wide',
                        frameworkColor
                    )}>
                        {asset.framework}
                    </span>

                    {/* Copy button */}
                    <motion.button
                        onClick={handleCopy}
                        aria-label={`Copy ${asset.title} code`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.93 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                        className={cn(
                            'flex items-center gap-1 px-2 py-0.5 rounded cursor-pointer',
                            'text-2xs font-medium transition-all duration-150 border',
                            copied
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                : 'bg-q-overlay border-q-border text-q-text-muted hover:text-q-text hover:border-[var(--q-accent-border)]'
                        )}
                    >
                        {copied ? (
                            <><Check size={10} aria-hidden="true" />Copied</>
                        ) : (
                            <><Copy size={10} aria-hidden="true" />Copy</>
                        )}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
});