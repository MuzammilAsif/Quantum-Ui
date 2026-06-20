import { memo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { PreviewToolbar } from './PreviewToolbar';
import { PreviewRenderer } from './PreviewRenderer';
import { PreviewCodeViewer } from './PreviewCodeViewer';
import { PreviewMetadata } from './PreviewMetadata';
import { PreviewErrorBoundary } from './PreviewErrorBoundary';
import { usePreviewStore } from '../../store/previewStore';
import { useAssetStore } from '../../store/assetStore';
import { useRecentStore } from '../../store/recentStore';
import { cn } from '../../utils';

/**
 * PreviewEngine — the complete preview system orchestrator.
 *
 * Replaces the old PreviewPanel entirely.
 *
 * Layout modes:
 *
 * PREVIEW mode:
 * ┌─────────────────────┐
 * │ Toolbar             │
 * ├─────────────────────┤
 * │ PreviewRenderer     │ ← flex-1
 * ├─────────────────────┤
 * │ PreviewMetadata     │ ← collapsible
 * └─────────────────────┘
 *
 * CODE mode:
 * ┌─────────────────────┐
 * │ Toolbar             │
 * ├─────────────────────┤
 * │ PreviewCodeViewer   │ ← flex-1
 * └─────────────────────┘
 *
 * SPLIT mode:
 * ┌──────────┬──────────┐
 * │ Toolbar  (spans both)│
 * ├──────────┬──────────┤
 * │ Preview  │ Code     │ ← flex-1
 * ├──────────┴──────────┤
 * │ PreviewMetadata     │ ← collapsible
 * └─────────────────────┘
 *
 * FULLSCREEN mode:
 * Expands to fill the entire sidebar panel.
 */
export const PreviewEngine = memo(function PreviewEngine() {
    const {
        asset,
        isOpen,
        isFullscreen,
        viewMode,
        setRenderStatus,
        closePreview,
        openPreview,
        reset,
    } = usePreviewStore();

    const { selectedAsset, isPreviewOpen: assetPreviewOpen } = useAssetStore();
    const { addRecentItem } = useRecentStore();

    // ── Sync assetStore selection → previewStore ──────────────────────────────
    // When ComponentCard calls assetStore.selectAsset(),
    // we mirror that into the previewStore here.
    useEffect(() => {
        if (assetPreviewOpen && selectedAsset) {
            openPreview(selectedAsset);
            addRecentItem(selectedAsset.id);
        }
    }, [assetPreviewOpen, selectedAsset, openPreview, addRecentItem]);

    // ── Close both stores when user dismisses ─────────────────────────────────
    const handleClose = useCallback(() => {
        closePreview();
        useAssetStore.getState().closePreview();
    }, [closePreview]);

    // ── Keyboard: Escape closes the panel ────────────────────────────────────
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, handleClose]);

    // ── Refresh handler — resets render status to trigger re-render ───────────
    const handleRefresh = useCallback(() => {
        setRenderStatus('loading');
        setTimeout(() => setRenderStatus('loading'), 50);
    }, [setRenderStatus]);

    return (
        <AnimatePresence>
            {isOpen && asset && (
                <>
                    {/* ── Backdrop ─────────────────────────────────────────────────── */}
                    <motion.div
                        key="preview-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={handleClose}
                        className="absolute inset-0 z-20 bg-q-void/50 backdrop-blur-sm"
                        aria-hidden="true"
                    />

                    {/* ── Main panel ───────────────────────────────────────────────── */}
                    <motion.div
                        key="preview-panel"
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: '100%', opacity: 0 }}
                        transition={{
                            type: 'spring',
                            stiffness: 380,
                            damping: 38,
                            mass: 0.9,
                        }}
                        className={cn(
                            'absolute left-0 right-0 bottom-0 z-30',
                            'flex flex-col bg-q-base border-t border-q-border',
                            'rounded-t-xl overflow-hidden',
                            isFullscreen ? 'top-0 rounded-none' : 'top-[15%]'
                        )}
                        role="dialog"
                        aria-label={`Preview: ${asset.title}`}
                        aria-modal="true"
                    >

                        {/* ── Drag handle ────────────────────────────────────────────── */}
                        {!isFullscreen && (
                            <div className="flex justify-center pt-2 pb-1 flex-shrink-0">
                                <div
                                    className="w-8 h-1 rounded-full bg-q-border"
                                    aria-hidden="true"
                                />
                            </div>
                        )}

                        {/* ── Panel header ───────────────────────────────────────────── */}
                        <div className="flex items-center justify-between gap-2
              px-3 py-2 border-b border-q-border-subtle flex-shrink-0">

                            {/* Title */}
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-q-text truncate">
                                    {asset.title}
                                </p>
                                <p className="text-2xs text-q-text-faint truncate">
                                    {asset.category.replace('-', ' ')} · {asset.framework}
                                </p>
                            </div>

                            {/* Close button */}
                            <motion.button
                                onClick={handleClose}
                                aria-label="Close preview"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                                className="flex-shrink-0 w-7 h-7 flex items-center
                  justify-center rounded-md cursor-pointer
                  text-q-text-faint hover:text-q-text hover:bg-q-elevated
                  transition-colors duration-150"
                            >
                                <X size={14} aria-hidden="true" />
                            </motion.button>
                        </div>

                        {/* ── Toolbar ────────────────────────────────────────────────── */}
                        <PreviewToolbar onRefresh={handleRefresh} />

                        {/* ── Content area — wrapped in error boundary ─────────────────── */}
                        <PreviewErrorBoundary onReset={handleClose}>
                            <div className="flex-1 flex overflow-hidden min-h-0">

                                {/* Preview mode — renderer only */}
                                {viewMode === 'preview' && (
                                    <PreviewRenderer />
                                )}

                                {/* Code mode — code viewer only */}
                                {viewMode === 'code' && (
                                    <PreviewCodeViewer className="flex-1" />
                                )}

                                {/* Split mode — renderer + code side by side */}
                                {viewMode === 'split' && (
                                    <>
                                        <div className="flex-1 min-w-0 overflow-hidden">
                                            <PreviewRenderer />
                                        </div>
                                        <PreviewCodeViewer className="w-[45%] flex-shrink-0" />
                                    </>
                                )}

                            </div>
                        </PreviewErrorBoundary>

                        {/* ── Metadata panel ─────────────────────────────────────────── */}
                        {(viewMode === 'preview' || viewMode === 'split') && (
                            <PreviewMetadata />
                        )}

                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
});