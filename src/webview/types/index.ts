// Re-export all shared types for convenience inside the webview
export * from '../../shared/types';

// ─── VS Code API (webview context) ───────────────────────────────────────────

export interface VSCodeAPI {
  postMessage(message: unknown): void;
  getState(): unknown;
  setState(state: unknown): void;
}

declare global {
  interface Window {
    __VSCODE_API__: VSCodeAPI;
    __QUANTUM_UI_VERSION__: string;
    acquireVsCodeApi?: () => VSCodeAPI;
  }
}

// ─── Component props helpers ──────────────────────────────────────────────────

export interface WithClassName {
  className?: string;
}

export interface WithChildren {
  children: React.ReactNode;
}

export interface WithOptionalChildren {
  children?: React.ReactNode;
}

export interface WithTestId {
  'data-testid'?: string;
}

/** Base props shared by most UI components */
export type BaseProps = WithClassName & WithOptionalChildren & WithTestId;

// ─── UI State ─────────────────────────────────────────────────────────────────

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  status: LoadingState;
  error: string | null;
}

export function createAsyncState<T>(data: T | null = null): AsyncState<T> {
  return { data, status: 'idle', error: null };
}

// ─── Navigation ───────────────────────────────────────────────────────────────

import type { NavPage } from '../../shared/types';

export interface NavItem {
  id: NavPage;
  label: string;
  icon: string;
  badge?: number;
  isNew?: boolean;
  isComingSoon?: boolean;
  description?: string;
}

// ─── Theme ────────────────────────────────────────────────────────────────────

export interface ThemeTokens {
  bg: {
    void: string;
    deep: string;
    base: string;
    surface: string;
    elevated: string;
    overlay: string;
  };
  border: {
    default: string;
    subtle: string;
  };
  text: {
    primary: string;
    muted: string;
    faint: string;
    ghost: string;
  };
  accent: {
    primary: string;
    primaryGlow: string;
    secondary: string;
    secondaryGlow: string;
  };
}

// ─── Search ───────────────────────────────────────────────────────────────────

export interface SearchState {
  query: string;
  isOpen: boolean;
  isFocused: boolean;
  results: import('../../shared/types').SearchResult[];
  recentSearches: string[];
  isSearching: boolean;
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export interface SidebarState {
  activePage: NavPage;
  isCompact: boolean;
  isSearchOpen: boolean;
  scrollPosition: number;
}

// ─── Notification ─────────────────────────────────────────────────────────────

export interface ToastNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ─── Animation Variants ───────────────────────────────────────────────────────

export interface AnimationConfig {
  enabled: boolean;
  duration: {
    fast: number;
    normal: number;
    slow: number;
  };
  spring: {
    stiff: object;
    smooth: object;
    bounce: object;
  };
}