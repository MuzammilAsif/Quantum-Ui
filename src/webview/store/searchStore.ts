import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { SearchResult, SearchFilters } from '../types';
import { STORAGE_KEYS, MAX_SEARCH_HISTORY } from '../constants';

interface SearchStore {
  // State
  query: string;
  debouncedQuery: string;
  isOpen: boolean;
  isFocused: boolean;
  isSearching: boolean;
  results: SearchResult[];
  filters: SearchFilters;
  recentSearches: string[];
  error: string | null;

  // Actions
  setQuery: (query: string) => void;
  setDebouncedQuery: (query: string) => void;
  openSearch: () => void;
  closeSearch: () => void;
  setFocused: (focused: boolean) => void;
  setSearching: (searching: boolean) => void;
  setResults: (results: SearchResult[]) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  clearFilters: () => void;
  addRecentSearch: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialFilters: SearchFilters = {};

export const useSearchStore = create<SearchStore>()(
  devtools(
    persist(
      immer((set) => ({
        query: '',
        debouncedQuery: '',
        isOpen: false,
        isFocused: false,
        isSearching: false,
        results: [],
        filters: initialFilters,
        recentSearches: [],
        error: null,

        setQuery: (query) =>
          set((state) => {
            state.query = query;
            if (!query.trim()) {
              state.results = [];
              state.isSearching = false;
            }
          }),

        setDebouncedQuery: (query) =>
          set((state) => {
            state.debouncedQuery = query;
          }),

        openSearch: () =>
          set((state) => {
            state.isOpen = true;
          }),

        closeSearch: () =>
          set((state) => {
            state.isOpen = false;
            state.isFocused = false;
            state.query = '';
            state.debouncedQuery = '';
            state.results = [];
            state.error = null;
          }),

        setFocused: (focused) =>
          set((state) => {
            state.isFocused = focused;
          }),

        setSearching: (searching) =>
          set((state) => {
            state.isSearching = searching;
          }),

        setResults: (results) =>
          set((state) => {
            state.results = results;
            state.isSearching = false;
            state.error = null;
          }),

        setFilters: (filters) =>
          set((state) => {
            Object.assign(state.filters, filters);
          }),

        clearFilters: () =>
          set((state) => {
            state.filters = initialFilters;
          }),

        addRecentSearch: (query) =>
          set((state) => {
            const trimmed = query.trim();
            if (!trimmed) return;
            // Deduplicate and keep latest at front
            state.recentSearches = [
              trimmed,
              ...state.recentSearches.filter((s) => s !== trimmed),
            ].slice(0, MAX_SEARCH_HISTORY);
          }),

        removeRecentSearch: (query) =>
          set((state) => {
            state.recentSearches = state.recentSearches.filter((s) => s !== query);
          }),

        clearRecentSearches: () =>
          set((state) => {
            state.recentSearches = [];
          }),

        setError: (error) =>
          set((state) => {
            state.error = error;
            state.isSearching = false;
          }),

        reset: () =>
          set((state) => {
            state.query = '';
            state.debouncedQuery = '';
            state.isOpen = false;
            state.isFocused = false;
            state.isSearching = false;
            state.results = [];
            state.filters = initialFilters;
            state.error = null;
          }),
      })),
      {
        name: STORAGE_KEYS.SEARCH_HISTORY,
        partialize: (state) => ({
          recentSearches: state.recentSearches,
        }),
      }
    ),
    { name: 'QuantumUI/Search' }
  )
);