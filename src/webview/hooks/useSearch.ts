import { useCallback, useEffect, useRef } from 'react';
import { useSearchStore } from '../store';
import { SEARCH_DEBOUNCE_MS } from '../constants';

/**
 * useSearch — manages search query state with debouncing.
 * Integrates with the search store and prepares for backend calls.
 */
export function useSearch() {
  const store = useSearchStore();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleQueryChange = useCallback(
    (query: string) => {
      store.setQuery(query);

      // Clear previous debounce
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      if (!query.trim()) {
        store.setDebouncedQuery('');
        return;
      }

      // Debounce the actual search trigger
      debounceRef.current = setTimeout(() => {
        store.setDebouncedQuery(query);
        store.setSearching(true);
      }, SEARCH_DEBOUNCE_MS);
    },
    [store]
  );

  const handleSubmit = useCallback(() => {
    const trimmed = store.query.trim();
    if (!trimmed) return;
    store.addRecentSearch(trimmed);
    store.setDebouncedQuery(trimmed);
    store.setSearching(true);
  }, [store]);

  const handleClear = useCallback(() => {
    store.reset();
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  }, [store]);

  const handleSelectRecent = useCallback(
    (query: string) => {
      store.setQuery(query);
      store.setDebouncedQuery(query);
      store.setSearching(true);
    },
    [store]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    query: store.query,
    debouncedQuery: store.debouncedQuery,
    isOpen: store.isOpen,
    isFocused: store.isFocused,
    isSearching: store.isSearching,
    results: store.results,
    recentSearches: store.recentSearches,
    error: store.error,
    filters: store.filters,

    handleQueryChange,
    handleSubmit,
    handleClear,
    handleSelectRecent,

    openSearch: store.openSearch,
    closeSearch: store.closeSearch,
    setFocused: store.setFocused,
    removeRecentSearch: store.removeRecentSearch,
    clearRecentSearches: store.clearRecentSearches,
    setFilters: store.setFilters,
    clearFilters: store.clearFilters,
  };
}