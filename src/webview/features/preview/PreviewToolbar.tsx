import { memo } from 'react';
import { motion } from 'framer-motion';
import {
    Monitor,
    Tablet,
    Smartphone,
    Maximize2,
    Sun,
    Moon,
    LayoutPanelLeft,
    Code2,
    Eye,
    Maximize,
    Minimize,
    RefreshCw,
    Copy,
    Check,
    type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';
import { usePreviewStore } from '../../store/previewStore';
import { useToast } from '../../hooks/useToast';
import { cn } from '../../utils';
import { DEVICE_CONFIGS } from './types';
import { getCodeForTab } from './PreviewUtils';
import type { DeviceMode, ViewMode } from './types';

// ─── Icon map for devices ─────────────────────────────────────────────────────

const DEVICE_ICONS: Record<DeviceMode, LucideIcon> = {
    desktop: Monitor,
    tablet: Tablet,
    mobile: Smartphone,
    custom: Maximize2,
};

// ─── Toolbar button ───────────────────────────────────────────────────────────

interface ToolbarButtonProps {
    icon: React.ReactNode;
    label: string;
    isActive?: boolean;
    onClick: () => void;
    className?: string;
}

const ToolbarButton = memo(function ToolbarButton({
    icon,
    label,
    isActive = false,
    onClick,
    className,
}: ToolbarButtonProps) {
    return (
        <motion.button
            onClick={onClick}
            aria-label={label}
            aria-pressed={isActive}
            title={label}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 500, damping: 40 }}
            className={cn(
                'flex items-center justify-center w-6 h-6 rounded cursor-pointer',
                'transition-colors duration-150',
                isActive
                    ? 'bg-[var(--q-accent)] text-white'
                    : 'text-q-text-faint hover:text-q-text hover:bg-q-elevated',
                className
            )}
        >
            {icon}
        </motion.button>
    );
});

// ─── Toolbar divider ──────────────────────────────────────────────────────────

function ToolbarDivider() {
    return (
        <div
            aria-hidden="true"
            className="w-px h-4 bg-q-border flex-shrink-0"
        />
    );
}

// ─── Main PreviewToolbar ──────────────────────────────────────────────────────

interface PreviewToolbarProps {
    onRefresh: () => void;
}

/**
 * PreviewToolbar — professional control bar above the preview area.
 *
 * Controls:
 * - View mode: Preview / Split / Code
 * - Device: Desktop / Tablet / Mobile / Custom
 * - Theme: Dark / Light toggle
 * - Actions: Refresh, Copy code, Fullscreen
 */
export const PreviewToolbar = memo(function PreviewToolbar({
    onRefresh,
}: PreviewToolbarProps) {
    const {
        device,
        theme,
        viewMode,
        isFullscreen,
        asset,
        activeCodeTab,
        setDevice,
        toggleTheme,
        setViewMode,
        toggleFullscreen,
    } = usePreviewStore();

    const { success } = useToast();
    const [copied, setCopied] = useState(false);

    // ── Copy current code to clipboard ─────────────────────────────────────────
    const handleCopy = () => {
        if (!asset) return;
        const code = getCodeForTab(asset.code, activeCodeTab);
        void navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            success(`${asset.title} copied!`);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className={cn(
            'flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5',
            'border-b border-q-border bg-q-surface',
            'overflow-x-auto no-scrollbar'
        )}>

            {/* ── View mode group ─────────────────────────────────────────────── */}
            <div className="flex items-center gap-0.5 bg-q-elevated
        rounded-md p-0.5 border border-q-border flex-shrink-0">
                {(
                    [
                        { mode: 'preview' as ViewMode, icon: <Eye size={11} />, label: 'Preview only' },
                        { mode: 'split' as ViewMode, icon: <LayoutPanelLeft size={11} />, label: 'Split view' },
                        { mode: 'code' as ViewMode, icon: <Code2 size={11} />, label: 'Code only' },
                    ] as const
                ).map(({ mode, icon, label }) => (
                    <motion.button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        aria-label={label}
                        aria-pressed={viewMode === mode}
                        title={label}
                        whileTap={{ scale: 0.93 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                        className={cn(
                            'flex items-center justify-center w-6 h-5 rounded cursor-pointer',
                            'transition-all duration-150',
                            viewMode === mode
                                ? 'bg-[var(--q-accent)] text-white'
                                : 'text-q-text-faint hover:text-q-text'
                        )}
                    >
                        {icon}
                    </motion.button>
                ))}
            </div>

            <ToolbarDivider />

            {/* ── Device selector group ───────────────────────────────────────── */}
            <div className="flex items-center gap-0.5 flex-shrink-0">
                {DEVICE_CONFIGS.map((config) => {
                    const Icon = DEVICE_ICONS[config.id];
                    return (
                        <ToolbarButton
                            key={config.id}
                            icon={<Icon size={11} />}
                            label={config.label}
                            isActive={device === config.id}
                            onClick={() => setDevice(config.id)}
                        />
                    );
                })}
            </div>

            <ToolbarDivider />

            {/* ── Theme toggle ────────────────────────────────────────────────── */}
            <ToolbarButton
                icon={
                    theme === 'dark'
                        ? <Sun size={11} />
                        : <Moon size={11} />
                }
                label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                onClick={toggleTheme}
            />

            <ToolbarDivider />

            {/* ── Action buttons ──────────────────────────────────────────────── */}
            <div className="flex items-center gap-0.5 flex-shrink-0">

                {/* Refresh */}
                <ToolbarButton
                    icon={<RefreshCw size={11} />}
                    label="Refresh preview"
                    onClick={onRefresh}
                />

                {/* Copy code */}
                <motion.button
                    onClick={handleCopy}
                    aria-label="Copy code"
                    title="Copy code"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    className={cn(
                        'flex items-center justify-center w-6 h-6 rounded cursor-pointer',
                        'transition-colors duration-150',
                        copied
                            ? 'text-emerald-400'
                            : 'text-q-text-faint hover:text-q-text hover:bg-q-elevated'
                    )}
                >
                    {copied ? <Check size={11} /> : <Copy size={11} />}
                </motion.button>

                {/* Fullscreen */}
                <ToolbarButton
                    icon={
                        isFullscreen
                            ? <Minimize size={11} />
                            : <Maximize size={11} />
                    }
                    label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                    isActive={isFullscreen}
                    onClick={toggleFullscreen}
                />
            </div>

        </div>
    );
});