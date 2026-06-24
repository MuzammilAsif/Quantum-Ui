import { PreviewSandbox } from './PreviewSandbox';
import { PreviewLoading } from './PreviewLoading';
import { PreviewError } from './PreviewError';
import { PreviewResizeHandle } from './PreviewResizeHandle';
import { PreviewDeviceFrame } from './PreviewDeviceFrame';
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
        renderError,
        setRenderStatus,
        setRenderError,
        setViewMode,
        markRendered,
        isRendered,
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
        setRenderError(null);

        // If no previewable HTML exists mark as error immediately
        if (!html) {
            setRenderStatus('error');
            setRenderError({
                message: 'No preview available for this component. View the source code instead.',
                timestamp: Date.now(),
            });
            return;
        }

        // Performance: if this asset was already rendered once this session,
        // skip the loading skeleton entirely for an instant feel.
        // The sandbox still mounts fresh underneath (isolation is preserved),
        // but the user sees no flash of the loading state.
        setRenderStatus(isRendered(asset.id) ? 'ready' : 'loading');
    }, [asset, html, setRenderStatus, setRenderError, isRendered]);

    // ── Timeout safeguard ───────────────────────────────────────────────────
    // If the sandbox never reports ready (blocked iframe, network issue),
    // surface an error instead of spinning forever.
    useEffect(() => {
        if (!html) return undefined;

        const timeoutId = setTimeout(() => {
            const currentStatus = usePreviewStore.getState().renderStatus;
            if (currentStatus === 'loading') {
                setRenderError({
                    message:
                        'Preview took too long to load. This may be caused by a blocked network resource.',
                    timestamp: Date.now(),
                });
                setRenderStatus('error');
            }
        }, 6000);

        return () => clearTimeout(timeoutId);
    }, [html, sandboxKey, setRenderStatus, setRenderError]);

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
        <div
            className="relative flex-1 flex items-stretch justify-center
        overflow-hidden"
            style={{
                background:
                    theme === 'dark'
                        ? 'radial-gradient(ellipse at center, #14141f 0%, #0a0a12 100%)'
                        : 'radial-gradient(ellipse at center, #f8fafc 0%, #f1f5f9 100%)',
                padding: device === 'desktop' ? '0' : '16px',
            }}
        >
            {/* ── Device frame wrapper ─────────────────────────────────────────── */}
            <PreviewDeviceFrame device={device} width={deviceWidth}>

                <div className="relative w-full h-full">

                    {/* ── Grid pattern background ──────────────────────────────────── */}
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 pointer-events-none opacity-[0.07]"
                        style={{
                            backgroundImage: `
                linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
              `,
                            backgroundSize: '20px 20px',
                        }}
                    />

                    {/* ── Loading state ──────────────────────────────────────────── */}
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

                    {/* ── Error state ─────────────────────────────────────────────── */}
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
                                        renderError?.message ??
                                        'No preview available. View the source code instead.'
                                    }
                                    onRetry={handleRetry}
                                    onViewCode={handleViewCode}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── Sandbox iframe ──────────────────────────────────────────── */}
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

                </div>
            </PreviewDeviceFrame>

            {/* ── Resize handle — sits outside the frame, only custom mode ─────── */}
            {device === 'custom' && (
                <div
                    className="absolute top-1/2 -translate-y-1/2"
                    style={{
                        left: `calc(50% + ${(deviceWidth ?? 375) / 2}px + 16px)`,
                    }}
                >
                    <PreviewResizeHandle />
                </div>
            )}

        </div>
    );
});