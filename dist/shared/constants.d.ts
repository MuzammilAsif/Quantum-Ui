export declare const EXTENSION_ID = "quantum-ui";
export declare const EXTENSION_DISPLAY_NAME = "Quantum UI";
export declare const EXTENSION_VERSION = "0.1.0";
export declare const WEBVIEW_ID = "quantumUI.sidebar";
export declare const COMMANDS: {
    readonly OPEN_PANEL: "quantumUI.openPanel";
    readonly REFRESH: "quantumUI.refresh";
    readonly TOGGLE_THEME: "quantumUI.toggleTheme";
    readonly OPEN_SETTINGS: "quantumUI.openSettings";
};
export declare const CONFIG_KEYS: {
    readonly THEME: "quantumUI.theme";
    readonly ACCENT_COLOR: "quantumUI.accentColor";
    readonly ANIMATIONS_ENABLED: "quantumUI.animationsEnabled";
    readonly COMPACT_MODE: "quantumUI.compactMode";
};
export declare const STORAGE_KEYS: {
    readonly THEME: "quantum-ui:theme";
    readonly ACCENT_COLOR: "quantum-ui:accent-color";
    readonly COMPACT_MODE: "quantum-ui:compact-mode";
    readonly SELECTED_PAGE: "quantum-ui:selected-page";
    readonly FAVORITES: "quantum-ui:favorites";
    readonly HISTORY: "quantum-ui:history";
    readonly SEARCH_HISTORY: "quantum-ui:search-history";
    readonly USER_PREFERENCES: "quantum-ui:user-preferences";
};
export declare const API_ENDPOINTS: {
    readonly BASE: "https://api.quantumui.dev/v1";
    readonly COMPONENTS: "/components";
    readonly TEMPLATES: "/templates";
    readonly AI_GENERATE: "/ai/generate";
    readonly AI_STREAM: "/ai/stream";
    readonly AUTH_LOGIN: "/auth/login";
    readonly AUTH_LOGOUT: "/auth/logout";
    readonly USER_PROFILE: "/user/profile";
    readonly USER_FAVORITES: "/user/favorites";
};
export declare const MAX_HISTORY_ENTRIES = 100;
export declare const MAX_SEARCH_HISTORY = 20;
export declare const SEARCH_DEBOUNCE_MS = 300;
export declare const AI_STREAM_TIMEOUT_MS = 30000;
export declare const NAV_ITEMS: readonly [{
    readonly id: "home";
    readonly label: "Home";
    readonly icon: "Home";
}, {
    readonly id: "components";
    readonly label: "Components";
    readonly icon: "Layers";
}, {
    readonly id: "templates";
    readonly label: "Templates";
    readonly icon: "Layout";
}, {
    readonly id: "ai-studio";
    readonly label: "AI Studio";
    readonly icon: "Sparkles";
}, {
    readonly id: "favorites";
    readonly label: "Favorites";
    readonly icon: "Star";
}, {
    readonly id: "history";
    readonly label: "History";
    readonly icon: "Clock";
}];
//# sourceMappingURL=constants.d.ts.map