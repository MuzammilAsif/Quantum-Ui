// ─── All shared types explicitly re-exported for Rollup compatibility ─────────

export enum MessageType {
  READY = 'READY',
  GET_CONFIG = 'GET_CONFIG',
  SET_CONFIG = 'SET_CONFIG',
  OPEN_FILE = 'OPEN_FILE',
  COPY_TO_CLIPBOARD = 'COPY_TO_CLIPBOARD',
  SHOW_NOTIFICATION = 'SHOW_NOTIFICATION',
  LOG = 'LOG',
  CONFIG_LOADED = 'CONFIG_LOADED',
  THEME_CHANGED = 'THEME_CHANGED',
  ERROR = 'ERROR',
  AI_GENERATE = 'AI_GENERATE',
  AI_STREAM_CHUNK = 'AI_STREAM_CHUNK',
  AI_STREAM_END = 'AI_STREAM_END',
  AI_ERROR = 'AI_ERROR',
  INSERT_COMPONENT = 'INSERT_COMPONENT',
  PREVIEW_COMPONENT = 'PREVIEW_COMPONENT',
  SET_API_KEY = 'SET_API_KEY',
  GET_API_KEY_STATUS = 'GET_API_KEY_STATUS',
  API_KEY_STATUS = 'API_KEY_STATUS',
  CLEAR_API_KEY = 'CLEAR_API_KEY',
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
  payload: { path: string; line?: number; column?: number };
}

export interface CopyToClipboardMessage extends BaseMessage {
  type: MessageType.COPY_TO_CLIPBOARD;
  payload: { text: string };
}

export interface ShowNotificationMessage extends BaseMessage {
  type: MessageType.SHOW_NOTIFICATION;
  payload: { message: string; type: 'info' | 'warning' | 'error' };
}

export interface LogMessage extends BaseMessage {
  type: MessageType.LOG;
  payload: { level: 'info' | 'warn' | 'error'; message: string };
}

export interface ConfigLoadedMessage extends BaseMessage {
  type: MessageType.CONFIG_LOADED;
  payload: ExtensionConfig;
}

export interface ThemeChangedMessage extends BaseMessage {
  type: MessageType.THEME_CHANGED;
  payload: { theme: Theme; accentColor: AccentColor };
}

export interface ErrorMessage extends BaseMessage {
  type: MessageType.ERROR;
  payload: { message: string; code?: string };
}

export interface AIGenerateMessage extends BaseMessage {
  type: MessageType.AI_GENERATE;
  payload: {
    requestId: string;
    prompt: string;
    framework: Framework;
    options?: AIGenerationOptions;
  };
}

export interface AIStreamChunkMessage extends BaseMessage {
  type: MessageType.AI_STREAM_CHUNK;
  payload: { chunk: string; requestId: string };
}

export interface AIStreamEndMessage extends BaseMessage {
  type: MessageType.AI_STREAM_END;
  payload: { requestId: string; result: string };
}

export interface AIErrorMessage extends BaseMessage {
  type: MessageType.AI_ERROR;
  payload: { requestId: string; error: string };
}

export interface InsertComponentMessage extends BaseMessage {
  type: MessageType.INSERT_COMPONENT;
  payload: { code: string; framework: Framework };
}

export interface SetApiKeyMessage extends BaseMessage {
  type: MessageType.SET_API_KEY;
  payload: { apiKey: string };
}

export interface GetApiKeyStatusMessage extends BaseMessage {
  type: MessageType.GET_API_KEY_STATUS;
}

export interface ApiKeyStatusMessage extends BaseMessage {
  type: MessageType.API_KEY_STATUS;
  payload: { hasKey: boolean; maskedKey?: string };
}

export interface ClearApiKeyMessage extends BaseMessage {
  type: MessageType.CLEAR_API_KEY;
}

export type ExtensionMessage =
  | ReadyMessage
  | GetConfigMessage
  | SetConfigMessage
  | OpenFileMessage
  | CopyToClipboardMessage
  | ShowNotificationMessage
  | LogMessage
  | AIGenerateMessage
  | InsertComponentMessage
  | SetApiKeyMessage
  | GetApiKeyStatusMessage
  | ClearApiKeyMessage;

export type WebviewMessage =
  | ConfigLoadedMessage
  | ThemeChangedMessage
  | ErrorMessage
  | AIStreamChunkMessage
  | AIStreamEndMessage
  | AIErrorMessage
  | ApiKeyStatusMessage;

// ─── Configuration ────────────────────────────────────────────────────────────

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

export const DEFAULT_CONFIG: ExtensionConfig = {
  theme: 'dark',
  accentColor: 'purple',
  animationsEnabled: true,
  compactMode: false,
  defaultFramework: 'react',
  defaultLanguage: 'typescript',
};

// ─── Navigation ───────────────────────────────────────────────────────────────

export type NavPage =
  | 'home'
  | 'components'
  | 'templates'
  | 'ai-studio'
  | 'favorites'
  | 'history'
  | 'settings';

// ─── AI ───────────────────────────────────────────────────────────────────────

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

// ─── Components ───────────────────────────────────────────────────────────────

export type ComponentCategory =
  | 'buttons'
  | 'forms'
  | 'navigation'
  | 'cards'
  | 'modals'
  | 'tables'
  | 'charts'
  | 'layouts'
  | 'typography'
  | 'feedback'
  | 'media'
  | 'animation';

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

export type TemplateCategory =
  | 'landing'
  | 'dashboard'
  | 'auth'
  | 'profile'
  | 'ecommerce'
  | 'blog'
  | 'portfolio'
  | 'admin';

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

// ─── User ─────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  plan: 'free' | 'pro' | 'team' | 'enterprise';
  createdAt: number;
}

// ─── Search ───────────────────────────────────────────────────────────────────

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

// ─── History ──────────────────────────────────────────────────────────────────

export interface HistoryEntry {
  id: string;
  type: 'component' | 'template' | 'ai-generation';
  itemId: string;
  name: string;
  action: 'viewed' | 'copied' | 'inserted' | 'generated';
  timestamp: number;
}

// ─── VS Code API ──────────────────────────────────────────────────────────────

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

// ─── Search State ─────────────────────────────────────────────────────────────

export interface SearchState {
  query: string;
  isOpen: boolean;
  isFocused: boolean;
  results: SearchResult[];
  recentSearches: string[];
  isSearching: boolean;
}

// ─── Sidebar State ────────────────────────────────────────────────────────────

export interface SidebarState {
  activePage: NavPage;
  isCompact: boolean;
  isSearchOpen: boolean;
  scrollPosition: number;
}

// ─── Notifications ────────────────────────────────────────────────────────────

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

// ─── Animation ────────────────────────────────────────────────────────────────

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