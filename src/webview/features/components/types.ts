import type { Framework } from '../../types';
import type { LibraryId } from '../libraries/types';

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
  | 'backgrounds'
  | 'text'
  | 'effects';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  description: string;
}

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
  /**
   * Which UI library this asset belongs to. Undefined is treated as
   * 'quantum' for backward compatibility — none of the original 65
   * Quantum UI assets need this field added retroactively.
   */
  library?: LibraryId;
}

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

export interface AssetSearchState {
  query: string;
  results: Asset[];
  isSearching: boolean;
}

export interface RecentItem {
  assetId: string;
  viewedAt: number;
}