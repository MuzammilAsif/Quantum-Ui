import { memo, useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePreviewStore } from '../../store/previewStore';
import { clampWidth } from './PreviewUtils';
import { cn } from '../../utils';

interface PreviewResizeHandleProps {
    className?: string;
}

/**
 * PreviewResizeHandle — drag handle for live viewport resizing.
 *
 * Only rendered when device mode is 'custom'.
 * Sends SANDBOX_RESIZE to the iframe on every move tick so the
 * content reflows smoothly without any snap-back.
 */
export const PreviewResizeHandle = memo(function PreviewResizeHandle({
    className,
}: PreviewResizeHandleProps) {
    const { customWidth, setCustomWidth } = usePreviewStore();
    const [isDragging, setIsDragging] = useState(false);
    const [liveWidth, setLiveWidth] = useState(customWidth);

    const startXRef = useRef(0);
    const startWidthRef = useRef(0);

    // ── Send resize signal to the sandbox iframe ──────────────────────────────
    const notifySandbox = useCallback(() => {
        const iframe = document.querySelector<HTMLIFrameElement>(
            'iframe[title="Component preview"]'
        );
        iframe?.contentWindow?.postMessage({ type: 'SANDBOX_RESIZE' }, '*');
    }, []);

    // ── Pointer drag ──────────────────────────────────────────────────────────
    const handlePointerDown = useCallback(
        (e: React.PointerEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragging(true);
            startXRef.current = e.clientX;
            startWidthRef.current = customWidth;

            const handlePointerMove = (moveEvent: PointerEvent) => {
                const delta = (moveEvent.clientX - startXRef.current) * 2;
                const newWidth = clampWidth(startWidthRef.current + delta);

                // Update both local display and store
                setLiveWidth(newWidth);
                setCustomWidth(newWidth);

                // Notify sandbox so content reflows immediately
                notifySandbox();
            };

            const handlePointerUp = () => {
                setIsDragging(false);
                window.removeEventListener('pointermove', handlePointerMove);
                window.removeEventListener('pointerup', handlePointerUp);
            };

            window.addEventListener('pointermove', handlePointerMove);
            window.addEventListener('pointerup', handlePointerUp);
        },
        [customWidth, setCustomWidth, notifySandbox]
    );

    // ── Keyboard resize ───────────────────────────────────────────────────────
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const next = clampWidth(customWidth - 10);
                setLiveWidth(next);
                setCustomWidth(next);
                notifySandbox();
            }
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                const next = clampWidth(customWidth + 10);
                setLiveWidth(next);
                setCustomWidth(next);
                notifySandbox();
            }
        },
        [customWidth, setCustomWidth, notifySandbox]
    );

    return (
        <>
            {/* ── Drag handle ──────────────────────────────────────────────────── */}
            <motion.div
                onPointerDown={handlePointerDown}
                onKeyDown={handleKeyDown}
                role="slider"
                aria-label="Resize preview viewport width"
                aria-valuemin={240}
                aria-valuemax={1200}
                aria-valuenow={liveWidth}
                aria-valuetext={`${liveWidth} pixels`}
                tabIndex={0}
                className={cn(
                    'absolute top-0 bottom-0 right-0 translate-x-1/2 z-20',
                    'w-3 flex items-center justify-center cursor-ew-resize group',
                    'focus-visible:outline-none',
                    className
                )}
            >
                <div
                    className={cn(
                        'w-1 h-10 rounded-full transition-colors duration-150',
                        isDragging
                            ? 'bg-[var(--q-accent)]'
                            : 'bg-q-border group-hover:bg-[var(--q-accent-border)] group-focus-visible:bg-[var(--q-accent)]'
                    )}
                />
            </motion.div>

            {/* ── Width readout — shown while dragging ─────────────────────────── */}
            <AnimatePresence>
                {isDragging && (
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.1 }}
                        className="absolute -top-7 left-1/2 -translate-x-1/2 z-20
              px-2 py-0.5 rounded-md bg-q-elevated border border-q-border
              text-2xs font-mono font-semibold text-q-text
              whitespace-nowrap shadow-q-md pointer-events-none"
                    >
                        {liveWidth}px
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
});