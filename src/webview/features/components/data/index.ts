import { BUTTON_ASSETS } from './buttons';
import { CARD_ASSETS } from './cards';
import { INPUT_ASSETS } from './inputs';
import { PASSWORD_FIELD_ASSETS } from './password-fields';
import { RADIO_BUTTON_ASSETS } from './radio-buttons';
import { CHECKBOX_ASSETS } from './checkboxes';
import { FORM_ASSETS } from './forms';
import { MODAL_ASSETS } from './modals';
import { SHADCN_ASSETS } from './shadcn';
import { MAGICUI_ASSETS } from './magicui';
import { ACETERNITY_ASSETS } from './aceternity';
import { MANTINE_ASSETS } from './mantine';
import { CATEGORIES } from './categories';
import type { Asset, CategoryId, AssetFilters } from '../types';

// ─── Master Asset Registry ────────────────────────────────────────────────────

export const ALL_ASSETS: Asset[] = [
  ...BUTTON_ASSETS,
  ...CARD_ASSETS,
  ...INPUT_ASSETS,
  ...PASSWORD_FIELD_ASSETS,
  ...RADIO_BUTTON_ASSETS,
  ...CHECKBOX_ASSETS,
  ...FORM_ASSETS,
  ...MODAL_ASSETS,
  ...SHADCN_ASSETS,
  ...MAGICUI_ASSETS,
  ...ACETERNITY_ASSETS,
  ...MANTINE_ASSETS,
];

// ─── Re-export categories ─────────────────────────────────────────────────────

export { CATEGORIES } from './categories';

// ─── Total count ──────────────────────────────────────────────────────────────

export const TOTAL_ASSET_COUNT = ALL_ASSETS.length;

// ─── Get asset count per category ────────────────────────────────────────────

export function getCountByCategory(categoryId: CategoryId): number {
  return ALL_ASSETS.filter((a) => a.category === categoryId).length;
}

// ─── Get assets by category ───────────────────────────────────────────────────

export function getAssetsByCategory(categoryId: CategoryId): Asset[] {
  return ALL_ASSETS.filter((a) => a.category === categoryId);
}

// ─── Get assets filtered by library ────────────────────────────────────────────
// Quantum UI assets predate the `library` field, so they're treated as
// 'quantum' when the field is undefined.

export function getAssetsByLibrary(libraryId: string): Asset[] {
  if (libraryId === 'quantum') {
    return ALL_ASSETS.filter((a) => !a.library || a.library === 'quantum');
  }
  return ALL_ASSETS.filter((a) => a.library === libraryId);
}

// ─── Get single asset by id ───────────────────────────────────────────────────

export function getAssetById(id: string): Asset | undefined {
  return ALL_ASSETS.find((a) => a.id === id);
}

// ─── Search assets ────────────────────────────────────────────────────────────

export function searchAssets(query: string): Asset[] {
  const q = query.toLowerCase().trim();
  if (!q) return ALL_ASSETS;

  return ALL_ASSETS.filter((asset) => {
    const inTitle       = asset.title.toLowerCase().includes(q);
    const inDescription = asset.description.toLowerCase().includes(q);
    const inTags        = asset.tags.some((tag) => tag.toLowerCase().includes(q));
    const inCategory    = asset.category.toLowerCase().includes(q);
    return inTitle || inDescription || inTags || inCategory;
  });
}

// ─── Filter assets ────────────────────────────────────────────────────────────

export function filterAssets(assets: Asset[], filters: AssetFilters): Asset[] {
  return assets.filter((asset) => {
    const matchFramework  = filters.framework  === 'all' || asset.framework  === filters.framework;
    const matchDifficulty = filters.difficulty === 'all' || asset.difficulty === filters.difficulty;
    const matchStyleTag   = filters.styleTag   === 'all' || asset.styleTag   === filters.styleTag;
    const matchCategory   = filters.category   === 'all' || asset.category   === filters.category;

    return matchFramework && matchDifficulty && matchStyleTag && matchCategory;
  });
}

// ─── Search + Filter combined ─────────────────────────────────────────────────

export function queryAssets(query: string, filters: AssetFilters): Asset[] {
  const searched = searchAssets(query);
  return filterAssets(searched, filters);
}

// ─── Get all unique tags across all assets ────────────────────────────────────

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  ALL_ASSETS.forEach((asset) => {
    asset.tags.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}