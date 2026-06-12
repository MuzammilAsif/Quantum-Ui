import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type {
    Asset,
} from '../features/Components/types';
import {
    DeviceMode,
    PreviewTheme,
    ViewMode,
    CodeTab,
    RenderStatus,
    PreviewError,
    DEVICE_CONFIGS,
} from '../features/preview/types';

interface PreviewStore {
    // ── Current asset ────────────────────────────────────────────────────────────
    asset: Asset | null;
    isOpen: boolean;

    // ── Display settings ────────────────────────────────────────────────────────
    device: DeviceMode;
    customWidth: number;
    theme: PreviewTheme;
    viewMode: ViewMode;
    activeCodeTab: CodeTab;

    // ── UI state ─────────────────────────────────────────────────────────────────
    isFullscreen: boolean;

    // ── Render lifecycle ────────────────────────────────────────────────────────
    renderStatus: RenderStatus;
    renderError: PreviewError | null;

    // ── Render cache — tracks which asset IDs have been rendered once ──────────
    renderCache: Set<string>;

    // ── Actions ──────────────────────────────────────────────────────────────────
    openPreview: (asset: Asset) => void;
    closePreview: () => void;

    setDevice: (device: DeviceMode) => void;
    setCustomWidth: (width: number) => void;
    setTheme: (theme: PreviewTheme) => void;
    toggleTheme: () => void;
    setViewMode: (mode: ViewMode) => void;
    setActiveCodeTab: (tab: CodeTab) => void;

    toggleFullscreen: () => void;
    setFullscreen: (value: boolean) => void;

    setRenderStatus: (status: RenderStatus) => void;
    setRenderError: (error: PreviewError | null) => void;

    markRendered: (assetId: string) => void;
    isRendered: (assetId: string) => boolean;

    getCurrentDeviceWidth: () => number | null;
    reset: () => void;
}

const initialState = {
    asset: null,
    isOpen: false,
    device: 'desktop' as DeviceMode,
    customWidth: 375,
    theme: 'dark' as PreviewTheme,
    viewMode: 'preview' as ViewMode,
    activeCodeTab: 'react' as CodeTab,
    isFullscreen: false,
    renderStatus: 'idle' as RenderStatus,
    renderError: null,
    renderCache: new Set<string>(),
};

export const usePreviewStore = create<PreviewStore>()(
    devtools(
        immer((set, get) => ({
            ...initialState,

            // ── Open / Close ─────────────────────────────────────────────────────────

            openPreview: (asset) => {
                set((state) => {
                    state.asset = asset;
                    state.isOpen = true;
                    state.viewMode = 'preview';
                    state.renderStatus = 'loading';
                    state.renderError = null;
                });
            },

            closePreview: () => {
                set((state) => {
                    state.isOpen = false;
                    state.asset = null;
                    state.isFullscreen = false;
                    state.renderStatus = 'idle';
                    state.renderError = null;
                });
            },

            // ── Device ───────────────────────────────────────────────────────────────

            setDevice: (device) => {
                set((state) => {
                    state.device = device;
                });
            },

            setCustomWidth: (width) => {
                set((state) => {
                    state.customWidth = Math.max(240, Math.min(1200, width));
                });
            },

            // ── Theme ────────────────────────────────────────────────────────────────

            setTheme: (theme) => {
                set((state) => {
                    state.theme = theme;
                });
            },

            toggleTheme: () => {
                set((state) => {
                    state.theme = state.theme === 'dark' ? 'light' : 'dark';
                });
            },

            // ── View Mode ────────────────────────────────────────────────────────────

            setViewMode: (mode) => {
                set((state) => {
                    state.viewMode = mode;
                });
            },

            setActiveCodeTab: (tab) => {
                set((state) => {
                    state.activeCodeTab = tab;
                });
            },

            // ── Fullscreen ───────────────────────────────────────────────────────────

            toggleFullscreen: () => {
                set((state) => {
                    state.isFullscreen = !state.isFullscreen;
                });
            },

            setFullscreen: (value) => {
                set((state) => {
                    state.isFullscreen = value;
                });
            },

            // ── Render Lifecycle ─────────────────────────────────────────────────────

            setRenderStatus: (status) => {
                set((state) => {
                    state.renderStatus = status;
                });
            },

            setRenderError: (error) => {
                set((state) => {
                    state.renderError = error;
                    if (error) {
                        state.renderStatus = 'error';
                    }
                });
            },

            // ── Render Cache ─────────────────────────────────────────────────────────

            markRendered: (assetId) => {
                set((state) => {
                    state.renderCache.add(assetId);
                });
            },

            isRendered: (assetId) => {
                return get().renderCache.has(assetId);
            },

            // ── Derived ──────────────────────────────────────────────────────────────

            getCurrentDeviceWidth: () => {
                const { device, customWidth } = get();

                if (device === 'custom') {
                    return customWidth;
                }

                const config = DEVICE_CONFIGS.find((d) => d.id === device);
                return config?.width ?? null;
            },

            // ── Reset ────────────────────────────────────────────────────────────────

            reset: () => {
                set((state) => {
                    state.asset = null;
                    state.isOpen = false;
                    state.device = 'desktop';
                    state.customWidth = 375;
                    state.theme = 'dark';
                    state.viewMode = 'preview';
                    state.activeCodeTab = 'react';
                    state.isFullscreen = false;
                    state.renderStatus = 'idle';
                    state.renderError = null;
                });
            },
        })),
        { name: 'QuantumUI/Preview' }
    )
);