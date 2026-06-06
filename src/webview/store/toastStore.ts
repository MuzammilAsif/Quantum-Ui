import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { ToastNotification } from '../types';

interface ToastStore {
  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastStore>()(
  immer((set) => ({
    toasts: [],

    addToast: (toast) => {
      const id = crypto.randomUUID();
      set((state) => {
        state.toasts.push({ ...toast, id });
      });
      // Auto-dismiss after duration
      const duration = toast.duration ?? 4000;
      setTimeout(() => {
        set((state) => {
          state.toasts = state.toasts.filter((t) => t.id !== id);
        });
      }, duration);
      return id;
    },

    removeToast: (id) =>
      set((state) => {
        state.toasts = state.toasts.filter((t) => t.id !== id);
      }),

    clearToasts: () =>
      set((state) => {
        state.toasts = [];
      }),
  }))
);