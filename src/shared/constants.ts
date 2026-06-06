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

export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: 'Home' },
  { id: 'components', label: 'Components', icon: 'Layers' },
  { id: 'templates', label: 'Templates', icon: 'Layout' },
  { id: 'ai-studio', label: 'AI Studio', icon: 'Sparkles' },
  { id: 'favorites', label: 'Favorites', icon: 'Star' },
  { id: 'history', label: 'History', icon: 'Clock' },
] as const;