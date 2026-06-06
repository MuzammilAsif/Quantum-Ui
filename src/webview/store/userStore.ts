import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { UserProfile, HistoryEntry, ExtensionConfig } from '../types';
import { STORAGE_KEYS, MAX_HISTORY_ENTRIES } from '../constants';

interface UserStore {
  // State
  profile: UserProfile | null;
  isAuthenticated: boolean;
  favorites: string[];
  history: HistoryEntry[];
  config: ExtensionConfig | null;

  // Actions
  setProfile: (profile: UserProfile | null) => void;
  setConfig: (config: ExtensionConfig) => void;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  addHistoryEntry: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        profile: null,
        isAuthenticated: false,
        favorites: [],
        history: [],
        config: null,

        setProfile: (profile) =>
          set((state) => {
            state.profile = profile;
            state.isAuthenticated = profile !== null;
          }),

        setConfig: (config) =>
          set((state) => {
            state.config = config;
          }),

        addFavorite: (id) =>
          set((state) => {
            if (!state.favorites.includes(id)) {
              state.favorites.push(id);
            }
          }),

        removeFavorite: (id) =>
          set((state) => {
            state.favorites = state.favorites.filter((f) => f !== id);
          }),

        toggleFavorite: (id) => {
          const { favorites, addFavorite, removeFavorite } = get();
          if (favorites.includes(id)) {
            removeFavorite(id);
          } else {
            addFavorite(id);
          }
        },

        isFavorite: (id) => get().favorites.includes(id),

        addHistoryEntry: (entry) =>
          set((state) => {
            const newEntry: HistoryEntry = {
              ...entry,
              id: crypto.randomUUID(),
              timestamp: Date.now(),
            };
            // Prepend and trim to max size
            state.history = [newEntry, ...state.history].slice(0, MAX_HISTORY_ENTRIES);
          }),

        clearHistory: () =>
          set((state) => {
            state.history = [];
          }),

        logout: () =>
          set((state) => {
            state.profile = null;
            state.isAuthenticated = false;
          }),
      })),
      {
        name: STORAGE_KEYS.USER_PREFERENCES,
        partialize: (state) => ({
          favorites: state.favorites,
          history: state.history,
        }),
      }
    ),
    { name: 'QuantumUI/User' }
  )
);