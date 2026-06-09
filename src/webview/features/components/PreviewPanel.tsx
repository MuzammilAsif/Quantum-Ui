import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Copy,
    Check,
    Star,
    Tag,
    Code2,
    Info,
    ChevronRight,
} from 'lucide-react';
import { useAssetStore } from '../../store/assetStore';
import { useFavoritesStore } from '../../store/favoritesStore';
import { useToast } from '../../hooks/useToast';
import { cn } from '../../utils';
import type { Asset, AssetCode } from './types';

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

// ─── Code tab selector ────────────────────────────────────────────────────────

type CodeTab = keyof AssetCode;

function getAvailableTabs(code: AssetCode): CodeTab[] {
    return (Object.keys(code) as CodeTab[]).filter(
        (key) => code[key] !== undefined && code[key] !== ''
    );
}

// ─── Code block with copy button ──────────────────────────────────────────────

interface CodeBlockProps {
    code: string;
    assetTitle: string;
}

const CodeBlock = memo(function CodeBlock({ code, assetTitle }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);
    const { success } = useToast();

    const handleCopy = () => {
        void navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            success(`${assetTitle} copied!`);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="relative flex flex-col rounded-lg border border-q-border
      bg-q-void overflow-hidden">

            {/* Top bar */}
            <div className="flex items-center justify-between px-3 py-2
        border-b border-q-border bg-q-surface">
                <div className="flex items-center gap-1.5">
                    <Code2 size={11} className="text-q-text-faint" aria-hidden="true" />
                    <span className="text-2xs font-medium text-q-text-faint">Code</span>
                </div>

                {/* Copy button */}
                <motion.button
                    onClick={handleCopy}
                    aria-label="Copy code to clipboard"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    className={cn(
                        'flex items-center gap-1.5 px-2.5 py-1 rounded cursor-pointer',
                        'text-2xs font-semibold border transition-all duration-150',
                        copied
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-q-elevated border-q-border text-q-text-muted hover:text-q-text hover:border-[var(--q-accent-border)]'
                    )}
                >
                    {copied ? (
                        <>
                            <Check size={10} aria-hidden="true" />
                            Copied!
                        </>
                    ) : (
                        <>
                            <Copy size={10} aria-hidden="true" />
                            Copy Code
                        </>
                    )}
                </motion.button>
            </div>

            {/* Code content */}
            <div className="overflow-x-auto overflow-y-auto max-h-[280px]">
                <pre className="p-3 text-2xs font-mono text-gray-300 leading-relaxed
          whitespace-pre min-w-0">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
});

// ─── Info row ─────────────────────────────────────────────────────────────────

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-start gap-2 py-2 border-b border-q-border-subtle
      last:border-b-0">
            <span className="text-2xs font-semibold text-q-text-faint w-20 flex-shrink-0 mt-0.5">
                {label}
            </span>
            <div className="flex-1 min-w-0">{children}</div>
        </div>
    );
}

// ─── Main PreviewPanel ────────────────────────────────────────────────────────

/**
 * PreviewPanel — slides up from the bottom when an asset is selected.
 *
 * Shows:
 * - Asset title, description, metadata
 * - Framework and difficulty badges
 * - Tags list
 * - Code tabs (React / HTML / Tailwind)
 * - Copy code button
 * - Favorite toggle
 * - Version and author info
 */
export const PreviewPanel = memo(function PreviewPanel() {
    const { selectedAsset, isPreviewOpen, closePreview } = useAssetStore();
    const { toggleFavorite, isFavorite } = useFavoritesStore();
    const { success } = useToast();

    const [activeTab, setActiveTab] = useState<CodeTab>('react');

    const favorited = selectedAsset ? isFavorite(selectedAsset.id) : false;

    const handleFavorite = () => {
        if (!selectedAsset) return;
        toggleFavorite(selectedAsset.id);
        if (!favorited) {
            success(`${selectedAsset.title} added to favorites`);
        }
    };

    const availableTabs = selectedAsset
        ? getAvailableTabs(selectedAsset.code)
        : [];

    const currentCode = selectedAsset
        ? (selectedAsset.code[activeTab] ?? selectedAsset.code.react ?? '')
        : '';

    return (
        <AnimatePresence>
            {isPreviewOpen && selectedAsset && (
                <>
                    {/* ── Backdrop ─────────────────────────────────────────────────── */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={closePreview}
                        className="absolute inset-0 z-20 bg-q-void/60 backdrop-blur-sm"
                        aria-hidden="true"
                    />

                    {/* ── Panel ────────────────────────────────────────────────────── */}
                    <motion.div
                        key="panel"
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: '100%', opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 38, mass: 0.9 }}
                        className="absolute bottom-0 left-0 right-0 z-30 flex flex-col
              bg-q-base border-t border-q-border rounded-t-xl overflow-hidden"
                        style={{ maxHeight: '85%' }}
                        role="dialog"
                        aria-label={`Preview: ${selectedAsset.title}`}
                        aria-modal="true"
                    >

                        {/* ── Drag handle ────────────────────────────────────────────── */}
                        <div className="flex justify-center pt-2.5 pb-1 flex-shrink-0">
                            <div className="w-8 h-1 rounded-full bg-q-border" aria-hidden="true" />
                        </div>

                        {/* ── Header ─────────────────────────────────────────────────── */}
                        <div className="flex items-start gap-3 px-3 pb-2.5 flex-shrink-0
              border-b border-q-border-subtle">

                            <div className="flex-1 min-w-0">
                                {/* Title */}
                                <h2 className="text-sm font-bold text-q-text leading-tight">
                                    {selectedAsset.title}
                                </h2>

                                {/* Description */}
                                <p className="text-2xs text-q-text-muted mt-0.5 leading-relaxed">
                                    {selectedAsset.description}
                                </p>

                                {/* Badges row */}
                                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                                    <span className={cn(
                                        'inline-flex items-center px-1.5 py-0.5 rounded text-2xs',
                                        'font-semibold border uppercase tracking-wide',
                                        FRAMEWORK_COLORS[selectedAsset.framework] ?? FRAMEWORK_COLORS['react']
                                    )}>
                                        {selectedAsset.framework}
                                    </span>

                                    <span className={cn(
                                        'inline-flex items-center px-1.5 py-0.5 rounded text-2xs',
                                        'font-semibold border',
                                        DIFFICULTY_COLORS[selectedAsset.difficulty] ?? ''
                                    )}>
                                        {selectedAsset.difficulty}
                                    </span>

                                    {selectedAsset.styleTag && (
                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded
                      text-2xs font-semibold border
                      bg-[var(--q-accent-subtle)] border-[var(--q-accent-border)]
                      text-[var(--q-accent)]">
                                            {selectedAsset.styleTag}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center gap-1 flex-shrink-0">

                                {/* Favorite */}
                                <motion.button
                                    onClick={handleFavorite}
                                    aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
                                    aria-pressed={favorited}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                                    className="w-7 h-7 flex items-center justify-center rounded-md
                    hover:bg-q-elevated cursor-pointer transition-colors duration-150"
                                >
                                    <Star
                                        size={14}
                                        className={cn(
                                            'transition-colors duration-150',
                                            favorited
                                                ? 'fill-amber-400 text-amber-400'
                                                : 'text-q-text-faint hover:text-amber-400'
                                        )}
                                        aria-hidden="true"
                                    />
                                </motion.button>

                                {/* Close */}
                                <motion.button
                                    onClick={closePreview}
                                    aria-label="Close preview"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                                    className="w-7 h-7 flex items-center justify-center rounded-md
                    text-q-text-faint hover:text-q-text hover:bg-q-elevated
                    cursor-pointer transition-colors duration-150"
                                >
                                    <X size={14} aria-hidden="true" />
                                </motion.button>
                            </div>
                        </div>

                        {/* ── Scrollable body ─────────────────────────────────────────── */}
                        <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-4">

                            {/* ── Code section ─────────────────────────────────────────── */}
                            <div className="flex flex-col gap-2">

                                {/* Tab selector — only shown if multiple code variants exist */}
                                {availableTabs.length > 1 && (
                                    <div className="flex items-center gap-1 bg-q-elevated
                    rounded-md p-0.5 border border-q-border w-fit">
                                        {availableTabs.map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab)}
                                                aria-pressed={activeTab === tab}
                                                className={cn(
                                                    'px-2.5 py-1 rounded text-2xs font-semibold',
                                                    'cursor-pointer transition-all duration-150 uppercase',
                                                    activeTab === tab
                                                        ? 'bg-[var(--q-accent)] text-white'
                                                        : 'text-q-text-muted hover:text-q-text'
                                                )}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Code block */}
                                <CodeBlock
                                    code={currentCode}
                                    assetTitle={selectedAsset.title}
                                />
                            </div>

                            {/* ── Asset info ───────────────────────────────────────────── */}
                            <div className="flex flex-col rounded-lg border border-q-border
                bg-q-elevated overflow-hidden">

                                <div className="flex items-center gap-1.5 px-3 py-2
                  border-b border-q-border bg-q-surface">
                                    <Info size={11} className="text-q-text-faint" aria-hidden="true" />
                                    <span className="text-2xs font-semibold text-q-text-faint">
                                        Details
                                    </span>
                                </div>

                                <div className="px-3 py-1">
                                    <InfoRow label="ID">
                                        <span className="text-2xs font-mono text-q-text-muted">
                                            {selectedAsset.id}
                                        </span>
                                    </InfoRow>

                                    <InfoRow label="Category">
                                        <span className="text-2xs text-q-text-muted capitalize">
                                            {selectedAsset.category.replace('-', ' ')}
                                        </span>
                                    </InfoRow>

                                    <InfoRow label="Author">
                                        <span className="text-2xs text-q-text-muted">
                                            {selectedAsset.author}
                                        </span>
                                    </InfoRow>

                                    <InfoRow label="Version">
                                        <span className="text-2xs font-mono text-q-text-muted">
                                            v{selectedAsset.version}
                                        </span>
                                    </InfoRow>

                                    <InfoRow label="Added">
                                        <span className="text-2xs text-q-text-muted">
                                            {selectedAsset.dateAdded}
                                        </span>
                                    </InfoRow>
                                </div>
                            </div>

                            {/* ── Tags ─────────────────────────────────────────────────── */}
                            {selectedAsset.tags.length > 0 && (
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-1.5">
                                        <Tag size={11} className="text-q-text-faint" aria-hidden="true" />
                                        <span className="text-2xs font-semibold text-q-text-faint">
                                            Tags
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {selectedAsset.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-2 py-0.5 rounded-full text-2xs font-medium
                          bg-q-elevated border border-q-border text-q-text-muted"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
});