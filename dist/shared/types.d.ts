export declare enum MessageType {
    READY = "READY",
    GET_CONFIG = "GET_CONFIG",
    SET_CONFIG = "SET_CONFIG",
    OPEN_FILE = "OPEN_FILE",
    COPY_TO_CLIPBOARD = "COPY_TO_CLIPBOARD",
    SHOW_NOTIFICATION = "SHOW_NOTIFICATION",
    LOG = "LOG",
    CONFIG_LOADED = "CONFIG_LOADED",
    THEME_CHANGED = "THEME_CHANGED",
    ERROR = "ERROR",
    AI_GENERATE = "AI_GENERATE",
    AI_STREAM_CHUNK = "AI_STREAM_CHUNK",
    AI_STREAM_END = "AI_STREAM_END",
    AI_ERROR = "AI_ERROR",
    INSERT_COMPONENT = "INSERT_COMPONENT",
    PREVIEW_COMPONENT = "PREVIEW_COMPONENT"
}
export interface BaseMessage {
    type: MessageType;
    id: string;
    timestamp: number;
}
export interface ReadyMessage extends BaseMessage {
    type: MessageType.READY;
}
export interface GetConfigMessage extends BaseMessage {
    type: MessageType.GET_CONFIG;
}
export interface SetConfigMessage extends BaseMessage {
    type: MessageType.SET_CONFIG;
    payload: Partial<ExtensionConfig>;
}
export interface OpenFileMessage extends BaseMessage {
    type: MessageType.OPEN_FILE;
    payload: {
        path: string;
        line?: number;
        column?: number;
    };
}
export interface CopyToClipboardMessage extends BaseMessage {
    type: MessageType.COPY_TO_CLIPBOARD;
    payload: {
        text: string;
    };
}
export interface ShowNotificationMessage extends BaseMessage {
    type: MessageType.SHOW_NOTIFICATION;
    payload: {
        message: string;
        type: 'info' | 'warning' | 'error';
    };
}
export interface LogMessage extends BaseMessage {
    type: MessageType.LOG;
    payload: {
        level: 'info' | 'warn' | 'error';
        message: string;
    };
}
export interface ConfigLoadedMessage extends BaseMessage {
    type: MessageType.CONFIG_LOADED;
    payload: ExtensionConfig;
}
export interface ThemeChangedMessage extends BaseMessage {
    type: MessageType.THEME_CHANGED;
    payload: {
        theme: Theme;
        accentColor: AccentColor;
    };
}
export interface ErrorMessage extends BaseMessage {
    type: MessageType.ERROR;
    payload: {
        message: string;
        code?: string;
    };
}
export interface AIGenerateMessage extends BaseMessage {
    type: MessageType.AI_GENERATE;
    payload: {
        prompt: string;
        framework: Framework;
        options?: AIGenerationOptions;
    };
}
export interface AIStreamChunkMessage extends BaseMessage {
    type: MessageType.AI_STREAM_CHUNK;
    payload: {
        chunk: string;
        requestId: string;
    };
}
export interface AIStreamEndMessage extends BaseMessage {
    type: MessageType.AI_STREAM_END;
    payload: {
        requestId: string;
        result: string;
    };
}
export interface AIErrorMessage extends BaseMessage {
    type: MessageType.AI_ERROR;
    payload: {
        requestId: string;
        error: string;
    };
}
export interface InsertComponentMessage extends BaseMessage {
    type: MessageType.INSERT_COMPONENT;
    payload: {
        code: string;
        framework: Framework;
    };
}
export type ExtensionMessage = ReadyMessage | GetConfigMessage | SetConfigMessage | OpenFileMessage | CopyToClipboardMessage | ShowNotificationMessage | LogMessage | AIGenerateMessage | InsertComponentMessage;
export type WebviewMessage = ConfigLoadedMessage | ThemeChangedMessage | ErrorMessage | AIStreamChunkMessage | AIStreamEndMessage | AIErrorMessage;
export type Theme = 'dark' | 'light' | 'system';
export type AccentColor = 'purple' | 'blue' | 'cyan' | 'green';
export type Framework = 'react' | 'vue' | 'angular' | 'svelte' | 'html' | 'tailwind';
export type Language = 'typescript' | 'javascript';
export interface ExtensionConfig {
    theme: Theme;
    accentColor: AccentColor;
    animationsEnabled: boolean;
    compactMode: boolean;
    defaultFramework: Framework;
    defaultLanguage: Language;
    apiKey?: string;
    userId?: string;
}
export declare const DEFAULT_CONFIG: ExtensionConfig;
export type NavPage = 'home' | 'components' | 'templates' | 'ai-studio' | 'favorites' | 'history' | 'settings';
export interface AIGenerationOptions {
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
}
export interface AIGenerationRequest {
    id: string;
    prompt: string;
    framework: Framework;
    options?: AIGenerationOptions;
    status: 'pending' | 'streaming' | 'complete' | 'error';
    result?: string;
    error?: string;
    createdAt: number;
}
export interface ComponentMeta {
    id: string;
    name: string;
    description: string;
    category: ComponentCategory;
    tags: string[];
    frameworks: Framework[];
    thumbnailUrl?: string;
    isPremium: boolean;
    isFavorite: boolean;
    downloadCount: number;
    createdAt: number;
    updatedAt: number;
}
export type ComponentCategory = 'buttons' | 'forms' | 'navigation' | 'cards' | 'modals' | 'tables' | 'charts' | 'layouts' | 'typography' | 'feedback' | 'media' | 'animation';
export interface TemplateMeta {
    id: string;
    name: string;
    description: string;
    category: TemplateCategory;
    tags: string[];
    framework: Framework;
    thumbnailUrl?: string;
    isPremium: boolean;
    isFavorite: boolean;
    createdAt: number;
}
export type TemplateCategory = 'landing' | 'dashboard' | 'auth' | 'profile' | 'ecommerce' | 'blog' | 'portfolio' | 'admin';
export interface UserProfile {
    id: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
    plan: 'free' | 'pro' | 'team' | 'enterprise';
    createdAt: number;
}
export interface SearchResult {
    id: string;
    type: 'component' | 'template' | 'ai';
    name: string;
    description: string;
    category: string;
    relevanceScore: number;
}
export interface SearchFilters {
    type?: ('component' | 'template' | 'ai')[];
    category?: string[];
    framework?: Framework[];
    isPremium?: boolean;
    isFavorite?: boolean;
}
export interface HistoryEntry {
    id: string;
    type: 'component' | 'template' | 'ai-generation';
    itemId: string;
    name: string;
    action: 'viewed' | 'copied' | 'inserted' | 'generated';
    timestamp: number;
}
//# sourceMappingURL=types.d.ts.map