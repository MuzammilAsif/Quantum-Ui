import { memo, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { usePreviewStore } from '../../store/previewStore';
import { formatDeviceWidth } from './PreviewUtils';
import { cn } from '../../utils';
import type { DeviceMode } from './types';

interface PreviewDeviceFrameProps {
    device: DeviceMode;
    width: number | null;
    children: ReactNode;
}

/**
 * PreviewDeviceFrame — visual chrome around the preview area.
 *
 * Desktop: thin browser-bar chrome, full height, no border radius
 * Tablet/Mobile/Custom: rounded device bezel, centered, constrained
 */
export const PreviewDeviceFrame = memo(function PreviewDeviceFrame({
    device,
    width,
    children,
}: PreviewDeviceFrameProps) {
    const { theme } = usePreviewStore();
    const isFramed = device !== 'desktop';

    return (
        <motion.div
            layout
            transition={{ type: 'spring', stiffness: 350, damping: 32, mass: 0.8 }}
            className={cn(
                'relative flex flex-col overflow-hidden',
                // Desktop fills all available space
                // Framed devices are contained and centered
                isFramed
                    ? 'rounded-xl border border-q-border shadow-[0_8px_24px_rgba(0,0,0,0.35)] self-center'
                    : 'flex-1 w-full rounded-none border-x border-q-border-subtle'
            )}
            style={
                isFramed
                    ? {
                        width: width !== null ? `${width}px` : '100%',
                        maxWidth: '100%',
                        // Framed devices: fixed height so they feel like real devices
                        height: device === 'tablet' ? '640px' : '600px',
                        maxHeight: '100%',
                    }
                    : {
                        // Desktop: stretch to fill entire preview area
                        height: '100%',
                    }
            }
        >
            {/* ── Chrome bar ───────────────────────────────────────────────────── */}
            <div
                className={cn(
                    'flex-shrink-0 flex items-center gap-2 px-3',
                    'bg-q-elevated border-b border-q-border-subtle select-none',
                    isFramed ? 'h-7' : 'h-6'
                )}
            >
                {/* Traffic-light dots — desktop chrome */}
                {!isFramed && (
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                        {['bg-red-500/40', 'bg-amber-500/40', 'bg-emerald-500/40'].map(
                            (color, i) => (
                                <div
                                    key={i}
                                    className={cn('w-2 h-2 rounded-full', color)}
                                    aria-hidden="true"
                                />
                            )
                        )}
                    </div>
                )}

                {/* Device pill — framed devices */}
                {isFramed && (
                    <div
                        className="w-8 h-1 rounded-full bg-q-border mx-auto"
                        aria-hidden="true"
                    />
                )}

                {/* Width readout — desktop only */}
                {!isFramed && (
                    <span className="ml-auto text-2xs font-mono text-q-text-ghost">
                        {formatDeviceWidth(width)}
                    </span>
                )}
            </div>

            {/* ── Frame content ─────────────────────────────────────────────────── */}
            <div
                className={cn(
                    'flex-1 overflow-hidden',
                    theme === 'dark' ? 'bg-[#0a0a12]' : 'bg-white'
                )}
                style={{ height: 'calc(100% - 24px)' }}
            >
                {children}
            </div>
        </motion.div>
    );
});