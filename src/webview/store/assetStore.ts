import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import {
    ALL_ASSETS,
    queryAssets,
    getAssetsByCategory,
    getCountByCategory,
} from '../features/Components/data';
import { DEFAULT_FILTERS } from '../features/Components/types';
import type {
    Asset,
    AssetFilters,
    CategoryId,
} from '../features/Components/types';

interface AssetStore {
    // ── State ──────────────────────────────────────────────────────────────────
    allAssets: Asset[];
    visibleAssets: Asset[];
    selectedAsset: Asset | null;
    isPreviewOpen: boolean;

    // ── Search ─────────────────────────────────────────────────────────────────
    searchQuery: string;
    isSearching: boolean;

    // ── Filters ────────────────────────────────────────────────────────────────
    filters: AssetFilters;
    activeCategory: CategoryId | 'all';

    // ── Actions ────────────────────────────────────────────────────────────────
    setSearchQuery: (query: string) => void;
    setFilter: <K extends keyof AssetFilters>(key: K, value: AssetFilters[K]) => void;
    clearFilters: () => void;
    setActiveCategory: (category: CategoryId | 'all') => void;
    selectAsset: (asset: Asset) => void;
    closePreview: () => void;
    getCategoryCount: (categoryId: CategoryId) => number;
    getCategoryAssets: (categoryId: CategoryId) => Asset[];
    runQuery: () => void;
}

export const useAssetStore = create<AssetStore>()(
    devtools(
        immer((set, get) => ({
            // ── Initial State ───────────────────────────────────────────────────────
            allAssets: ALL_ASSETS,
            visibleAssets: ALL_ASSETS,
            selectedAsset: null,
            isPreviewOpen: false,
            searchQuery: '',
            isSearching: false,
            filters: { ...DEFAULT_FILTERS },
            activeCategory: 'all',

            // ── Set search query and trigger query ──────────────────────────────────
            setSearchQuery: (query) => {
                set((state) => {
                    state.searchQuery = query;
                    state.isSearching = query.trim().length > 0;
                });
                get().runQuery();
            },

            // ── Set a single filter value and re-run query ──────────────────────────
            setFilter: (key, value) => {
                set((state) => {
                    (state.filters[key] as typeof value) = value;
                });
                get().runQuery();
            },

            // ── Reset all filters to default ────────────────────────────────────────
            clearFilters: () => {
                set((state) => {
                    state.filters = { ...DEFAULT_FILTERS };
                    state.activeCategory = 'all';
                    state.searchQuery = '';
                    state.isSearching = false;
                    state.visibleAssets = ALL_ASSETS;
                });
            },

            // ── Set active category filter ──────────────────────────────────────────
            setActiveCategory: (category) => {
                set((state) => {
                    state.activeCategory = category;
                    state.filters.category = category;
                });
                get().runQuery();
            },

            // ── Open preview panel with selected asset ──────────────────────────────
            selectAsset: (asset) => {
                set((state) => {
                    state.selectedAsset = asset;
                    state.isPreviewOpen = true;
                });
            },

            // ── Close preview panel ─────────────────────────────────────────────────
            closePreview: () => {
                set((state) => {
                    state.isPreviewOpen = false;
                    state.selectedAsset = null;
                });
            },

            // ── Get live asset count for a category ─────────────────────────────────
            getCategoryCount: (categoryId) => {
                return getCountByCategory(categoryId);
            },

            // ── Get all assets for a category ───────────────────────────────────────
            getCategoryAssets: (categoryId) => {
                return getAssetsByCategory(categoryId);
            },

            // ── Run search + filter and update visibleAssets ────────────────────────
            // This is the core query engine. Called after every state change.
            runQuery: () => {
                const { searchQuery, filters } = get();
                const results = queryAssets(searchQuery, filters);
                set((state) => {
                    state.visibleAssets = results;
                });
            },
        })),
        { name: 'QuantumUI/Assets' }
    )
);