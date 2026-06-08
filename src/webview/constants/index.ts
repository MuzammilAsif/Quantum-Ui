// ─── Shared constants (explicitly re-exported for Rollup compatibility) ───────

export const EXTENSION_ID = 'quantum-ui';
export const EXTENSION_DISPLAY_NAME = 'Quantum UI';
export const EXTENSION_VERSION = '0.1.0';

export const WEBVIEW_ID = 'quantumUI.sidebar';

export const COMMANDS = {
  OPEN_PANEL: 'quantumUI.openPanel',
  REFRESH: 'quantumUI.refresh',
  TOGGLE_THEME: 'quantumUI.toggleTheme',
  OPEN_SETTINGS: 'quantumUI.openSettings',
} as const;

export const CONFIG_KEYS = {
  THEME: 'quantumUI.theme',
  ACCENT_COLOR: 'quantumUI.accentColor',
  ANIMATIONS_ENABLED: 'quantumUI.animationsEnabled',
  COMPACT_MODE: 'quantumUI.compactMode',
} as const;

export const STORAGE_KEYS = {
  THEME: 'quantum-ui:theme',
  ACCENT_COLOR: 'quantum-ui:accent-color',
  COMPACT_MODE: 'quantum-ui:compact-mode',
  SELECTED_PAGE: 'quantum-ui:selected-page',
  FAVORITES: 'quantum-ui:favorites',
  HISTORY: 'quantum-ui:history',
  SEARCH_HISTORY: 'quantum-ui:search-history',
  USER_PREFERENCES: 'quantum-ui:user-preferences',
} as const;

export const API_ENDPOINTS = {
  BASE: 'https://api.quantumui.dev/v1',
  COMPONENTS: '/components',
  TEMPLATES: '/templates',
  AI_GENERATE: '/ai/generate',
  AI_STREAM: '/ai/stream',
  AUTH_LOGIN: '/auth/login',
  AUTH_LOGOUT: '/auth/logout',
  USER_PROFILE: '/user/profile',
  USER_FAVORITES: '/user/favorites',
} as const;

export const MAX_HISTORY_ENTRIES = 100;
export const MAX_SEARCH_HISTORY = 20;
export const SEARCH_DEBOUNCE_MS = 300;
export const AI_STREAM_TIMEOUT_MS = 30_000;

// ─── Webview-only constants ───────────────────────────────────────────────────

import type { NavItem, AnimationConfig } from '../types';

export const NAV_ITEMS_CONFIG: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: 'Home',
    description: 'Dashboard overview',
  },
  {
    id: 'components',
    label: 'Components',
    icon: 'Layers',
    description: 'Browse UI components',
    badge: 0,
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: 'Layout',
    description: 'Full page templates',
    badge: 0,
  },
  {
    id: 'ai-studio',
    label: 'AI Studio',
    icon: 'Sparkles',
    description: 'Generate with AI',
    isNew: true,
  },
  {
    id: 'favorites',
    label: 'Favorites',
    icon: 'Star',
    description: 'Saved items',
  },
  {
    id: 'history',
    label: 'History',
    icon: 'Clock',
    description: 'Recent activity',
  },
];

export const ANIMATION_CONFIG: AnimationConfig = {
  enabled: true,
  duration: {
    fast: 0.1,
    normal: 0.2,
    slow: 0.35,
  },
  spring: {
    stiff: { type: 'spring', stiffness: 500, damping: 40, mass: 0.8 },
    smooth: { type: 'spring', stiffness: 300, damping: 30, mass: 1 },
    bounce: { type: 'spring', stiffness: 400, damping: 20, mass: 0.8 },
  },
};

export const FADE_IN_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

export const SLIDE_UP_VARIANTS = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
};

export const SLIDE_IN_LEFT_VARIANTS = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, x: -8, transition: { duration: 0.15 } },
};

export const SCALE_IN_VARIANTS = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.1 } },
};

export const STAGGER_CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

export const STAGGER_ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } },
};

export const ACCENT_COLORS = {
  purple: {
    primary: '#8b5cf6',
    hover: '#7c3aed',
    glow: 'rgba(139, 92, 246, 0.3)',
    subtle: 'rgba(139, 92, 246, 0.08)',
    border: 'rgba(139, 92, 246, 0.2)',
  },
  blue: {
    primary: '#22bcff',
    hover: '#00aaff',
    glow: 'rgba(34, 188, 255, 0.25)',
    subtle: 'rgba(34, 188, 255, 0.08)',
    border: 'rgba(34, 188, 255, 0.2)',
  },
  cyan: {
    primary: '#06d6d6',
    hover: '#00bfbf',
    glow: 'rgba(6, 214, 214, 0.2)',
    subtle: 'rgba(6, 214, 214, 0.08)',
    border: 'rgba(6, 214, 214, 0.2)',
  },
  green: {
    primary: '#10b981',
    hover: '#059669',
    glow: 'rgba(16, 185, 129, 0.2)',
    subtle: 'rgba(16, 185, 129, 0.08)',
    border: 'rgba(16, 185, 129, 0.2)',
  },
} as const;

export const Z_INDICES = {
  base: 0,
  elevated: 10,
  overlay: 20,
  modal: 30,
  popover: 40,
  tooltip: 50,
} as const;