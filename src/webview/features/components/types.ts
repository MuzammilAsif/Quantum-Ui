import type { Framework } from '../../types';

// ─── Category ─────────────────────────────────────────────────────────────────

export type CategoryId =
    | 'buttons'
    | 'cards'
    | 'inputs'
    | 'password-fields'
    | 'radio-buttons'
    | 'checkboxes'
    | 'forms'
    | 'modals'
    | 'navigation'
    | 'tables'
    | 'alerts'
    | 'backgrounds';

export interface Category {
    id: CategoryId;
    name: string;
    icon: string;
    description: string;
}

// ─── Asset ────────────────────────────────────────────────────────────────────

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type StyleTag =
    | 'Modern'
    | 'Minimal'
    | 'Glassmorphism'
    | 'Gradient'
    | 'Dark';

export interface AssetCode {
    react?: string;
    html?: string;
    tailwind?: string;
}

export interface Asset {
    id: string;
    title: string;
    category: CategoryId;
    framework: Framework;
    tags: string[];
    description: string;
    preview: React.ReactNode;
    code: AssetCode;
    difficulty: Difficulty;
    styleTag?: StyleTag;
    version: string;
    author: string;
    dateAdded: string;
    isPremium?: boolean;
}

// ─── Filter State ─────────────────────────────────────────────────────────────

export interface AssetFilters {
    framework: Framework | 'all';
    difficulty: Difficulty | 'all';
    styleTag: StyleTag | 'all';
    category: CategoryId | 'all';
}

export const DEFAULT_FILTERS: AssetFilters = {
    framework: 'all',
    difficulty: 'all',
    styleTag: 'all',
    category: 'all',
};

// ─── Search State ─────────────────────────────────────────────────────────────

export interface AssetSearchState {
    query: string;
    results: Asset[];
    isSearching: boolean;
}

// ─── Recent Item ──────────────────────────────────────────────────────────────

export interface RecentItem {
    assetId: string;
    viewedAt: number;
}