import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { NavPage } from '../types';
import { STORAGE_KEYS } from '../constants';

interface SidebarStore {
  // State
  activePage: NavPage;
  isCompact: boolean;
  isSearchOpen: boolean;
  scrollPosition: number;

  // Actions
  setActivePage: (page: NavPage) => void;
  toggleCompact: () => void;
  setCompact: (compact: boolean) => void;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  setScrollPosition: (pos: number) => void;
  reset: () => void;
}

const initialState = {
  activePage: 'home' as NavPage,
  isCompact: false,
  isSearchOpen: false,
  scrollPosition: 0,
};

export const useSidebarStore = create<SidebarStore>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,

        setActivePage: (page) =>
          set((state) => {
            state.activePage = page;
            state.isSearchOpen = false;
            state.scrollPosition = 0;
          }),

        toggleCompact: () =>
          set((state) => {
            state.isCompact = !state.isCompact;
          }),

        setCompact: (compact) =>
          set((state) => {
            state.isCompact = compact;
          }),

        openSearch: () =>
          set((state) => {
            state.isSearchOpen = true;
          }),

        closeSearch: () =>
          set((state) => {
            state.isSearchOpen = false;
          }),

        toggleSearch: () =>
          set((state) => {
            state.isSearchOpen = !state.isSearchOpen;
          }),

        setScrollPosition: (pos) =>
          set((state) => {
            state.scrollPosition = pos;
          }),

        reset: () => set(initialState),
      })),
      {
        name: STORAGE_KEYS.SELECTED_PAGE,
        partialize: (state) => ({
          activePage: state.activePage,
          isCompact: state.isCompact,
        }),
      }
    ),
    { name: 'QuantumUI/Sidebar' }
  )
);