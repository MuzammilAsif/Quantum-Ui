import type { Asset, AssetCode } from '../Components/types';

// ─── Device Modes ─────────────────────────────────────────────────────────────

export type DeviceMode = 'desktop' | 'tablet' | 'mobile' | 'custom';

export interface DeviceConfig {
    id: DeviceMode;
    label: string;
    width: number | null; // null = 100% (full width)
    icon: string;
}

export const DEVICE_CONFIGS: DeviceConfig[] = [
    { id: 'desktop', label: 'Desktop', width: null, icon: 'Monitor' },
    { id: 'tablet', label: 'Tablet', width: 480, icon: 'Tablet' },
    { id: 'mobile', label: 'Mobile', width: 320, icon: 'Smartphone' },
    { id: 'custom', label: 'Custom', width: 375, icon: 'Maximize2' },
];

// ─── Theme Modes ──────────────────────────────────────────────────────────────

export type PreviewTheme = 'dark' | 'light';

// ─── View Modes ───────────────────────────────────────────────────────────────

export type ViewMode = 'preview' | 'code' | 'split';

// ─── Code Language Tabs ───────────────────────────────────────────────────────

export type CodeTab = keyof AssetCode;

// ─── Preview Render Status ────────────────────────────────────────────────────

export type RenderStatus = 'idle' | 'loading' | 'ready' | 'error';

// ─── Preview Error ────────────────────────────────────────────────────────────

export interface PreviewError {
    message: string;
    stack?: string;
    timestamp: number;
}

// ─── Preview Store State Shape ────────────────────────────────────────────────

export interface PreviewState {
    // Current asset being previewed (mirrors assetStore.selectedAsset)
    asset: Asset | null;

    // Display settings
    device: DeviceMode;
    customWidth: number;
    theme: PreviewTheme;
    viewMode: ViewMode;
    activeCodeTab: CodeTab;

    // UI state
    isFullscreen: boolean;
    isOpen: boolean;

    // Render lifecycle
    renderStatus: RenderStatus;
    renderError: PreviewError | null;

    // Cache — tracks which asset IDs have already been "rendered" once
    // Used for render caching in later steps
    renderCache: Set<string>;
}

// ─── Sandbox Message Protocol ─────────────────────────────────────────────────
// Used for future iframe-based sandboxing (Step 2)

export type SandboxMessageType =
    | 'SANDBOX_READY'
    | 'SANDBOX_RENDER'
    | 'SANDBOX_ERROR'
    | 'SANDBOX_RESIZE';

export interface SandboxMessage {
    type: SandboxMessageType;
    payload?: unknown;
}

// ─── Future AI Editing Hook ───────────────────────────────────────────────────
// Exposes everything AI editing (Phase 5) will need access to.

export interface PreviewEditableContext {
    assetId: string;
    code: AssetCode;
    framework: Asset['framework'];
    metadata: {
        title: string;
        description: string;
        tags: string[];
        category: string;
    };
}