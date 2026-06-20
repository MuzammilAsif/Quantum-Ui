import { useMemo } from 'react';
import { usePreviewStore } from '../../store/previewStore';
import type { PreviewEditableContext } from './types';

/**
 * usePreviewEditableContext — assembles the full editable context
 * for the currently previewed asset.
 *
 * This hook does not render anything and is not yet consumed by any
 * UI in Phase 2. It exists purely as a stable data contract so that
 * Phase 5 (AI Editing) can plug in without restructuring the preview
 * system.
 *
 * Future AI editing flow (Phase 5):
 * 1. User opens preview → usePreviewEditableContext() returns full context
 * 2. AI receives: code, framework, theme, metadata
 * 3. AI returns modified code
 * 4. previewStore is updated with new code → PreviewRenderer re-renders
 *    inside the same sandbox, without any architectural changes needed
 *    to PreviewEngine, PreviewSandbox, or PreviewRenderer.
 *
 * Returns null when no asset is currently open.
 */
export function usePreviewEditableContext(): PreviewEditableContext | null {
    const { asset, theme, device, activeCodeTab } = usePreviewStore();

    return useMemo(() => {
        if (!asset) return null;

        const context: PreviewEditableContext = {
            assetId: asset.id,
            code: asset.code,
            framework: asset.framework,
            metadata: {
                title: asset.title,
                description: asset.description,
                tags: asset.tags,
                category: asset.category,
            },
        };

        return context;
    }, [asset, theme, device, activeCodeTab]);
}

/**
 * getPreviewEditableContextSnapshot — non-hook version for use outside
 * React components (e.g. inside a future AI service call that needs
 * a one-time snapshot rather than a reactive subscription).
 */
export function getPreviewEditableContextSnapshot(): PreviewEditableContext | null {
    const { asset } = usePreviewStore.getState();
    if (!asset) return null;

    return {
        assetId: asset.id,
        code: asset.code,
        framework: asset.framework,
        metadata: {
            title: asset.title,
            description: asset.description,
            tags: asset.tags,
            category: asset.category,
        },
    };
}