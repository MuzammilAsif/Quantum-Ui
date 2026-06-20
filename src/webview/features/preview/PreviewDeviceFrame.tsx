import { memo, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Circle } from 'lucide-react';
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
 * PreviewDeviceFrame — adds a subtle visual chrome around the preview
 * based on the active device mode.
 *
 * Desktop: thin browser-bar chrome (traffic-light dots + width readout)
 * Tablet/Mobile/Custom: rounded device bezel
 *
 * Visual inspiration: Vercel deploy previews, Figma device frames,
 * Framer canvas, VS Code panels. Deliberately subtle — no flashy motion,
 * just clean spacing and soft shadows.
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
                'relative flex flex-col h-full overflow-hidden',
                isFramed
                    ? 'rounded-xl border border-q-border shadow-[0_8px_24px_rgba(0,0,0,0.35)]'
                    : 'rounded-sm border border-q-border-subtle shadow-[0_2px_8px_rgba(0,0,0,0.2)]'
            )}
            style={{
                width: width !== null ? `${width}px` : '100%',
                maxWidth: '100%',
            }}
        >
            {/* ── Chrome bar ───────────────────────────────────────────────────── */}
            <div
                className={cn(
                    'flex-shrink-0 flex items-center gap-2 px-3',
                    'bg-q-elevated border-b border-q-border-subtle select-none',
                    isFramed ? 'h-7' : 'h-6'
                )}
            >
                {/* Traffic-light dots — only on desktop chrome */}
                {!isFramed && (
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                        <Circle size={6} className="fill-q-border text-q-border" />
                        <Circle size={6} className="fill-q-border text-q-border" />
                        <Circle size={6} className="fill-q-border text-q-border" />
                    </div>
                )}

                {/* Device pill — only on framed (tablet/mobile/custom) */}
                {isFramed && (
                    <div className="w-8 h-1 rounded-full bg-q-border mx-auto" />
                )}

                {/* Width readout — desktop only, right aligned */}
                {!isFramed && (
                    <span className="ml-auto text-2xs font-mono text-q-text-ghost">
                        {formatDeviceWidth(width)}
                    </span>
                )}
            </div>

            {/* ── Frame content — the actual sandbox sits inside ─────────────────── */}
            <div
                className={cn(
                    'flex-1 overflow-hidden',
                    theme === 'dark' ? 'bg-[#0a0a12]' : 'bg-white'
                )}
            >
                {children}
            </div>
        </motion.div>
    );
});