import { PreviewSandbox } from './PreviewSandbox';
import { PreviewLoading } from './PreviewLoading';
import { PreviewError } from './PreviewError';
import { PreviewResizeHandle } from './PreviewResizeHandle';
import { usePreviewStore } from '../../store/previewStore';
import { resolvePreviewHtml, getDeviceWidth } from './PreviewUtils';
import { cn } from '../../utils';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * PreviewRenderer — manages the full render lifecycle of a single asset preview.
 *
 * Lifecycle:
 * 1. Asset selected → status set to 'loading'
 * 2. PreviewSandbox mounts with srcDoc
 * 3. Sandbox signals SANDBOX_READY → status set to 'ready'
 * 4. If sandbox signals SANDBOX_ERROR → status set to 'error'
 * 5. User can retry → re-mounts sandbox with fresh key
 * 6. User can switch to code view if preview fails
 */
export const PreviewRenderer = memo(function PreviewRenderer() {
    const {
        asset,
        device,
        customWidth,
        theme,
        renderStatus,
        setRenderStatus,
        setRenderError,
        setViewMode,
        markRendered,
    } = usePreviewStore();

    // ── Sandbox key — incrementing this forces a full iframe remount ──────────
    const [sandboxKey, setSandboxKey] = useState(0);

    // ── Resolve preview HTML from asset ──────────────────────────────────────
    const resolution = asset ? resolvePreviewHtml(asset) : null;
    const html = resolution?.html ?? null;

    // ── Compute device width ──────────────────────────────────────────────────
    const deviceWidth = getDeviceWidth(device, customWidth);

    // ── Reset render state when asset changes ─────────────────────────────────
    const prevAssetId = useRef<string | null>(null);

    useEffect(() => {
        if (!asset) return;
        if (asset.id === prevAssetId.current) return;

        prevAssetId.current = asset.id;
        setRenderStatus('loading');
        setRenderError(null);

        // If no previewable HTML exists mark as error immediately
        if (!html) {
            setRenderStatus('error');
            setRenderError({
                message: 'No preview available for this component. View the source code instead.',
                timestamp: Date.now(),
            });
        }
    }, [asset, html, setRenderStatus, setRenderError]);

    // ── Sandbox ready callback ────────────────────────────────────────────────
    const handleReady = useCallback(() => {
        setRenderStatus('ready');
        if (asset) {
            markRendered(asset.id);
        }
    }, [setRenderStatus, markRendered, asset]);

    // ── Sandbox error callback ────────────────────────────────────────────────
    const handleError = useCallback(
        (message: string) => {
            setRenderError({ message, timestamp: Date.now() });
            setRenderStatus('error');
        },
        [setRenderError, setRenderStatus]
    );

    // ── Retry — remount the sandbox with a new key ────────────────────────────
    const handleRetry = useCallback(() => {
        setRenderStatus('loading');
        setRenderError(null);
        setSandboxKey((k) => k + 1);
    }, [setRenderStatus, setRenderError]);

    // ── Switch to code view on error ──────────────────────────────────────────
    const handleViewCode = useCallback(() => {
        setViewMode('code');
    }, [setViewMode]);

    if (!asset) return null;

    return (
        <div className="relative flex-1 flex items-center justify-center
      overflow-hidden bg-q-surface">

            {/* ── Device width constraint wrapper ─────────────────────────────── */}
            <div
                className={cn(
                    'relative h-full flex flex-col overflow-hidden',
                    'transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]',
                    deviceWidth !== null
                        ? 'shadow-[0_0_0_1px_rgba(255,255,255,0.06)] rounded-sm'
                        : 'w-full'
                )}
                style={{
                    width: deviceWidth !== null ? `${deviceWidth}px` : '100%',
                    maxWidth: '100%',
                }}
            >
                {/* ── Grid pattern background ────────────────────────────────────── */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
                        backgroundSize: '20px 20px',
                    }}
                />

                {/* ── Loading state ────────────────────────────────────────────── */}
                <AnimatePresence>
                    {renderStatus === 'loading' && html && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="absolute inset-0 z-10"
                        >
                            <PreviewLoading theme={theme} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Error state ──────────────────────────────────────────────── */}
                <AnimatePresence>
                    {renderStatus === 'error' && (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="absolute inset-0 z-10"
                        >
                            <PreviewError
                                message={
                                    'No preview available. View the source code instead.'
                                }
                                onRetry={handleRetry}
                                onViewCode={handleViewCode}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Sandbox iframe ────────────────────────────────────────────── */}
                {html && renderStatus !== 'error' && (
                    <div className={cn(
                        'w-full h-full transition-opacity duration-200',
                        renderStatus === 'loading' ? 'opacity-0' : 'opacity-100'
                    )}>
                        <PreviewSandbox
                            key={sandboxKey}
                            html={html}
                            theme={theme}
                            width={null}
                            onReady={handleReady}
                            onError={handleError}
                        />
                    </div>
                )}

                {/* ── Resize handle — only for custom device mode ───────────────── */}
                {device === 'custom' && (
                    <PreviewResizeHandle />
                )}

            </div>
        </div>
    );
});