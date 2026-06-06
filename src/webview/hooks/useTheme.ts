import { useCallback } from 'react';
import { useThemeStore } from '../store';
import type { Theme, AccentColor } from '../types';
import { useVSCode } from './useVSCode';


/**
 * useTheme — provides theme state and actions with VS Code sync.
 */
export function useTheme() {
  const {
    theme,
    resolvedTheme,
    accentColor,
    animationsEnabled,
    accent,
    setTheme,
    toggleTheme: toggleThemeStore,
    setAccentColor: setAccentColorStore,
    setAnimationsEnabled,
  } = useThemeStore();

  const { postMessage } = useVSCode();

  const isDark = resolvedTheme === 'dark';
  const isLight = resolvedTheme === 'light';

  const toggleTheme = useCallback(() => {
    toggleThemeStore();
    // Config sync handled via VS Code config watcher
  }, [toggleThemeStore, resolvedTheme, postMessage]);

  const changeTheme = useCallback(
    (newTheme: Theme) => {
      setTheme(newTheme);
      // Config sync handled via VS Code config watcher
    },
    [setTheme, postMessage]
  );

  const changeAccentColor = useCallback(
    (color: AccentColor) => {
      setAccentColorStore(color);
      // Config sync handled via VS Code config watcher
    },
    [setAccentColorStore, postMessage]
  );

  return {
    theme,
    resolvedTheme,
    accentColor,
    animationsEnabled,
    accent,
    isDark,
    isLight,
    toggleTheme,
    changeTheme,
    changeAccentColor,
    setAnimationsEnabled,
  };
}