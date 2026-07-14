import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { LibraryId } from '../features/libraries/types';

interface LibraryStore {
  activeLibrary: LibraryId | null;
  activeCategory: string | null;
  setActiveLibrary: (id: LibraryId | null) => void;
  setActiveCategory: (id: string | null) => void;
  goBackToLibraries: () => void;
}

export const useLibraryStore = create<LibraryStore>()(
  persist(
    immer((set) => ({
      activeLibrary: null,
      activeCategory: null,

      setActiveLibrary: (id) =>
        set((state) => {
          state.activeLibrary = id;
          state.activeCategory = null;
        }),

      setActiveCategory: (id) =>
        set((state) => {
          state.activeCategory = id;
        }),

      goBackToLibraries: () =>
        set((state) => {
          state.activeLibrary = null;
          state.activeCategory = null;
        }),
    })),
    { name: 'quantum-ui:library-selection' }
  )
);