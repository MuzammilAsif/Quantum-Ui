import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { getAssetById } from '../features/Components/data';
import type { Asset, RecentItem } from '../features/Components/types';
import { STORAGE_KEYS } from '../constants';

const MAX_RECENT_ITEMS = 20;

interface RecentStore {
    // ── State ──────────────────────────────────────────────────────────────────
    recentItems: RecentItem[];

    // ── Actions ────────────────────────────────────────────────────────────────
    addRecentItem: (assetId: string) => void;
    removeRecentItem: (assetId: string) => void;
    clearRecent: () => void;

    // ── Derived ────────────────────────────────────────────────────────────────
    getRecentAssets: () => Asset[];
    getRecentCount: () => number;
}

export const useRecentStore = create<RecentStore>()(
    devtools(
        persist(
            immer((set, get) => ({
                // ── Initial State ─────────────────────────────────────────────────────
                recentItems: [],

                // ── Add to recent — deduplicates and keeps newest at top ──────────────
                addRecentItem: (assetId) => {
                    set((state) => {
                        // Remove existing entry if present
                        state.recentItems = state.recentItems.filter(
                            (item) => item.assetId !== assetId
                        );

                        // Add to front with current timestamp
                        state.recentItems.unshift({
                            assetId,
                            viewedAt: Date.now(),
                        });

                        // Enforce max limit
                        if (state.recentItems.length > MAX_RECENT_ITEMS) {
                            state.recentItems = state.recentItems.slice(0, MAX_RECENT_ITEMS);
                        }
                    });
                },

                // ── Remove a single item from recent ──────────────────────────────────
                removeRecentItem: (assetId) => {
                    set((state) => {
                        state.recentItems = state.recentItems.filter(
                            (item) => item.assetId !== assetId
                        );
                    });
                },

                // ── Clear all recent items ────────────────────────────────────────────
                clearRecent: () => {
                    set((state) => {
                        state.recentItems = [];
                    });
                },

                // ── Get full Asset objects for recent items ───────────────────────────
                getRecentAssets: () => {
                    return get()
                        .recentItems
                        .map((item) => getAssetById(item.assetId))
                        .filter((a): a is Asset => a !== undefined);
                },

                // ── Get total recent count ────────────────────────────────────────────
                getRecentCount: () => {
                    return get().recentItems.length;
                },
            })),
            {
                name: STORAGE_KEYS.HISTORY,
                partialize: (state) => ({
                    recentItems: state.recentItems,
                }),
            }
        ),
        { name: 'QuantumUI/Recent' }
    )
);