"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NAV_ITEMS = exports.AI_STREAM_TIMEOUT_MS = exports.SEARCH_DEBOUNCE_MS = exports.MAX_SEARCH_HISTORY = exports.MAX_HISTORY_ENTRIES = exports.API_ENDPOINTS = exports.STORAGE_KEYS = exports.CONFIG_KEYS = exports.COMMANDS = exports.WEBVIEW_ID = exports.EXTENSION_VERSION = exports.EXTENSION_DISPLAY_NAME = exports.EXTENSION_ID = void 0;
exports.EXTENSION_ID = 'quantum-ui';
exports.EXTENSION_DISPLAY_NAME = 'Quantum UI';
exports.EXTENSION_VERSION = '0.1.0';
exports.WEBVIEW_ID = 'quantumUI.sidebar';
exports.COMMANDS = {
    OPEN_PANEL: 'quantumUI.openPanel',
    REFRESH: 'quantumUI.refresh',
    TOGGLE_THEME: 'quantumUI.toggleTheme',
    OPEN_SETTINGS: 'quantumUI.openSettings',
};
exports.CONFIG_KEYS = {
    THEME: 'quantumUI.theme',
    ACCENT_COLOR: 'quantumUI.accentColor',
    ANIMATIONS_ENABLED: 'quantumUI.animationsEnabled',
    COMPACT_MODE: 'quantumUI.compactMode',
};
exports.STORAGE_KEYS = {
    THEME: 'quantum-ui:theme',
    ACCENT_COLOR: 'quantum-ui:accent-color',
    COMPACT_MODE: 'quantum-ui:compact-mode',
    SELECTED_PAGE: 'quantum-ui:selected-page',
    FAVORITES: 'quantum-ui:favorites',
    HISTORY: 'quantum-ui:history',
    SEARCH_HISTORY: 'quantum-ui:search-history',
    USER_PREFERENCES: 'quantum-ui:user-preferences',
};
exports.API_ENDPOINTS = {
    BASE: 'https://api.quantumui.dev/v1',
    COMPONENTS: '/components',
    TEMPLATES: '/templates',
    AI_GENERATE: '/ai/generate',
    AI_STREAM: '/ai/stream',
    AUTH_LOGIN: '/auth/login',
    AUTH_LOGOUT: '/auth/logout',
    USER_PROFILE: '/user/profile',
    USER_FAVORITES: '/user/favorites',
};
exports.MAX_HISTORY_ENTRIES = 100;
exports.MAX_SEARCH_HISTORY = 20;
exports.SEARCH_DEBOUNCE_MS = 300;
exports.AI_STREAM_TIMEOUT_MS = 30000;
exports.NAV_ITEMS = [
    { id: 'home', label: 'Home', icon: 'Home' },
    { id: 'components', label: 'Components', icon: 'Layers' },
    { id: 'templates', label: 'Templates', icon: 'Layout' },
    { id: 'ai-studio', label: 'AI Studio', icon: 'Sparkles' },
    { id: 'favorites', label: 'Favorites', icon: 'Star' },
    { id: 'history', label: 'History', icon: 'Clock' },
];
//# sourceMappingURL=constants.js.map