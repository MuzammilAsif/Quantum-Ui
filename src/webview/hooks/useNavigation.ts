import { useCallback } from 'react';
import { useSidebarStore, useUserStore } from '../store';
import type { NavPage } from '../types';

/**
 * useNavigation — typed navigation between sidebar pages.
 * Automatically records history entries on page changes.
 */
export function useNavigation() {
  const { activePage, setActivePage, isCompact, toggleCompact, setCompact } =
    useSidebarStore();
  const { addHistoryEntry } = useUserStore();

  const navigate = useCallback(
    (page: NavPage) => {
      if (page === activePage) return;
      setActivePage(page);
    },
    [activePage, setActivePage, addHistoryEntry]
  );

  const isActive = useCallback(
    (page: NavPage) => activePage === page,
    [activePage]
  );

  return {
    activePage,
    navigate,
    isActive,
    isCompact,
    toggleCompact,
    setCompact,
  };
}