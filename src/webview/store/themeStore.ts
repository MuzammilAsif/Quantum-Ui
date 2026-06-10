import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Theme, AccentColor } from '../types';
import { STORAGE_KEYS, ACCENT_COLORS } from '../constants/index';

interface ThemeStore {
  // State
  theme: Theme;
  resolvedTheme: 'dark' | 'light';
  accentColor: AccentColor;
  animationsEnabled: boolean;

  // Derived
  accent: (typeof ACCENT_COLORS)[AccentColor];

  // Actions
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setAccentColor: (color: AccentColor) => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  syncFromConfig: (config: { theme?: Theme; accentColor?: AccentColor; animationsEnabled?: boolean }) => void;
}

function resolveTheme(theme: Theme): 'dark' | 'light' {
  if (theme === 'system') {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
}

function applyThemeToDOM(resolved: 'dark' | 'light'): void {
  const root = document.documentElement;
  root.classList.toggle('dark', resolved === 'dark');
  root.classList.toggle('light', resolved === 'light');
  root.setAttribute('data-theme', resolved);
}

const initialTheme: Theme = 'dark';
const initialAccent: AccentColor = 'purple';

export const useThemeStore = create<ThemeStore>()(
  devtools(
    persist(
      immer((set) => ({
        theme: initialTheme,
        resolvedTheme: resolveTheme(initialTheme),
        accentColor: initialAccent,
        animationsEnabled: true,
        accent: ACCENT_COLORS[initialAccent],

        setTheme: (theme) =>
          set((state) => {
            const resolved = resolveTheme(theme);
            state.theme = theme;
            state.resolvedTheme = resolved;
            applyThemeToDOM(resolved);
          }),

        toggleTheme: () =>
          set((state) => {
            const next = state.resolvedTheme === 'dark' ? 'light' : 'dark';
            state.theme = next;
            state.resolvedTheme = next;
            applyThemeToDOM(next);
          }),

        setAccentColor: (color) =>
          set((state) => {
            state.accentColor = color;
            state.accent = ACCENT_COLORS[color];

            // Apply CSS custom properties for the accent color
            const root = document.documentElement;
            const tokens = ACCENT_COLORS[color];
            root.style.setProperty('--q-accent', tokens.primary);
            root.style.setProperty('--q-accent-hover', tokens.hover);
            root.style.setProperty('--q-accent-glow', tokens.glow);
            root.style.setProperty('--q-accent-subtle', tokens.subtle);
            root.style.setProperty('--q-accent-border', tokens.border);
          }),

        setAnimationsEnabled: (enabled) =>
          set((state) => {
            state.animationsEnabled = enabled;
            document.documentElement.style.setProperty(
              '--q-animation-scale',
              enabled ? '1' : '0'
            );
          }),

        syncFromConfig: (config) =>
          set((state) => {
            if (config.theme !== undefined) {
              const resolved = resolveTheme(config.theme);
              state.theme = config.theme;
              state.resolvedTheme = resolved;
              applyThemeToDOM(resolved);
            }
            if (config.accentColor !== undefined) {
              state.accentColor = config.accentColor;
              state.accent = ACCENT_COLORS[config.accentColor];
            }
            if (config.animationsEnabled !== undefined) {
              state.animationsEnabled = config.animationsEnabled;
            }
          }),
      })),
      {
        name: STORAGE_KEYS.THEME,
        partialize: (state) => ({
          theme: state.theme,
          accentColor: state.accentColor,
          animationsEnabled: state.animationsEnabled,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            const resolved = resolveTheme(state.theme);
            applyThemeToDOM(resolved);
          }
        },
      }
    ),
    { name: 'QuantumUI/Theme' }
  )
);