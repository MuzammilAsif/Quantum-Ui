import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { getAssetById } from '../features/Components/data';
import type { Asset } from '../features/Components/types';
import { STORAGE_KEYS } from '../constants';

interface FavoritesStore {
    // ── State ──────────────────────────────────────────────────────────────────
    favoriteIds: string[];

    // ── Actions ────────────────────────────────────────────────────────────────
    addFavorite: (id: string) => void;
    removeFavorite: (id: string) => void;
    toggleFavorite: (id: string) => void;
    isFavorite: (id: string) => boolean;
    clearFavorites: () => void;

    // ── Derived ────────────────────────────────────────────────────────────────
    getFavoriteAssets: () => Asset[];
    getFavoriteCount: () => number;
}

export const useFavoritesStore = create<FavoritesStore>()(
    devtools(
        persist(
            immer((set, get) => ({
                // ── Initial State ─────────────────────────────────────────────────────
                favoriteIds: [],

                // ── Add a favorite ────────────────────────────────────────────────────
                addFavorite: (id) => {
                    set((state) => {
                        if (!state.favoriteIds.includes(id)) {
                            state.favoriteIds.push(id);
                        }
                    });
                },

                // ── Remove a favorite ─────────────────────────────────────────────────
                removeFavorite: (id) => {
                    set((state) => {
                        state.favoriteIds = state.favoriteIds.filter((f) => f !== id);
                    });
                },

                // ── Toggle favorite on or off ─────────────────────────────────────────
                toggleFavorite: (id) => {
                    const { isFavorite, addFavorite, removeFavorite } = get();
                    if (isFavorite(id)) {
                        removeFavorite(id);
                    } else {
                        addFavorite(id);
                    }
                },

                // ── Check if an asset is favorited ────────────────────────────────────
                isFavorite: (id) => {
                    return get().favoriteIds.includes(id);
                },

                // ── Clear all favorites ───────────────────────────────────────────────
                clearFavorites: () => {
                    set((state) => {
                        state.favoriteIds = [];
                    });
                },

                // ── Get full Asset objects for all favorites ──────────────────────────
                getFavoriteAssets: () => {
                    return get()
                        .favoriteIds
                        .map((id) => getAssetById(id))
                        .filter((a): a is Asset => a !== undefined);
                },

                // ── Get total favorite count ──────────────────────────────────────────
                getFavoriteCount: () => {
                    return get().favoriteIds.length;
                },
            })),
            {
                name: STORAGE_KEYS.FAVORITES,
                partialize: (state) => ({
                    favoriteIds: state.favoriteIds,
                }),
            }
        ),
        { name: 'QuantumUI/Favorites' }
    )
);