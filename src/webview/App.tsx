import { useEffect } from 'react';
import { SidebarLayout } from './layouts/SidebarLayout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useExtensionConfig } from './hooks/useVSCode';
import { useThemeStore } from './store';

/**
 * ConfigSync — isolated component that triggers VS Code config sync.
 * Kept separate so it doesn't cause the root tree to re-render.
 */
function ConfigSync() {
  useExtensionConfig();
  return null;
}

/**
 * ThemeInit — applies the persisted theme to the DOM on first paint
 * before any user interaction, preventing a flash of wrong theme.
 */
function ThemeInit() {
  const { resolvedTheme, accentColor, accent } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;

    // Apply theme class
    root.classList.toggle('dark', resolvedTheme === 'dark');
    root.classList.toggle('light', resolvedTheme === 'light');
    root.setAttribute('data-theme', resolvedTheme);

    // Apply accent CSS variables
    root.style.setProperty('--q-accent', accent.primary);
    root.style.setProperty('--q-accent-hover', accent.hover);
    root.style.setProperty('--q-accent-glow', accent.glow);
    root.style.setProperty('--q-accent-subtle', accent.subtle);
    root.style.setProperty('--q-accent-border', accent.border);
  }, [resolvedTheme, accentColor, accent]);

  return null;
}

/**
 * App — root of the Quantum UI webview React application.
 *
 * Responsibilities:
 * - Global error boundary
 * - Theme initialization
 * - VS Code config sync
 * - Render the SidebarLayout shell
 */
export default function App() {
  return (
    <ErrorBoundary>
      <ThemeInit />
      <ConfigSync />
      <SidebarLayout />
    </ErrorBoundary>
  );
}