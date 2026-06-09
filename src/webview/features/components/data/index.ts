import { BUTTON_ASSETS } from './buttons';
import { CARD_ASSETS } from './cards';
import { INPUT_ASSETS } from './inputs';
import { CATEGORIES } from './categories';
import type { Asset, CategoryId, AssetFilters } from '../types';

// ─── Master Asset Registry ────────────────────────────────────────────────────
// This is the ONLY place that combines all assets.
// To add a new category: create the data file, import it here, spread it below.

export const ALL_ASSETS: Asset[] = [
    ...BUTTON_ASSETS,
    ...CARD_ASSETS,
    ...INPUT_ASSETS,
];

// ─── Re-export categories ─────────────────────────────────────────────────────

export { CATEGORIES } from './categories';

// ─── Total count ──────────────────────────────────────────────────────────────

export const TOTAL_ASSET_COUNT = ALL_ASSETS.length;

// ─── Get asset count per category ────────────────────────────────────────────
// Used by the category list to show live counts next to each category name.

export function getCountByCategory(categoryId: CategoryId): number {
    return ALL_ASSETS.filter((a) => a.category === categoryId).length;
}

// ─── Get assets by category ───────────────────────────────────────────────────

export function getAssetsByCategory(categoryId: CategoryId): Asset[] {
    return ALL_ASSETS.filter((a) => a.category === categoryId);
}

// ─── Get single asset by id ───────────────────────────────────────────────────

export function getAssetById(id: string): Asset | undefined {
    return ALL_ASSETS.find((a) => a.id === id);
}

// ─── Search assets ────────────────────────────────────────────────────────────
// Scans: title, description, tags, category
// Case-insensitive, instant, no external library needed.

export function searchAssets(query: string): Asset[] {
    const q = query.toLowerCase().trim();
    if (!q) return ALL_ASSETS;

    return ALL_ASSETS.filter((asset) => {
        const inTitle = asset.title.toLowerCase().includes(q);
        const inDescription = asset.description.toLowerCase().includes(q);
        const inTags = asset.tags.some((tag) => tag.toLowerCase().includes(q));
        const inCategory = asset.category.toLowerCase().includes(q);
        return inTitle || inDescription || inTags || inCategory;
    });
}

// ─── Filter assets ────────────────────────────────────────────────────────────
// All filters combine together (AND logic).
// Example: React + Cards + Modern = only assets matching ALL three.

export function filterAssets(assets: Asset[], filters: AssetFilters): Asset[] {
    return assets.filter((asset) => {
        const matchFramework = filters.framework === 'all' || asset.framework === filters.framework;
        const matchDifficulty = filters.difficulty === 'all' || asset.difficulty === filters.difficulty;
        const matchStyleTag = filters.styleTag === 'all' || asset.styleTag === filters.styleTag;
        const matchCategory = filters.category === 'all' || asset.category === filters.category;

        return matchFramework && matchDifficulty && matchStyleTag && matchCategory;
    });
}

// ─── Search + Filter combined ─────────────────────────────────────────────────
// This is what the UI calls. One function does both operations in the right order.

export function queryAssets(query: string, filters: AssetFilters): Asset[] {
    const searched = searchAssets(query);
    return filterAssets(searched, filters);
}

// ─── Get all unique tags across all assets ────────────────────────────────────
// Used for tag-based search suggestions in the future.

export function getAllTags(): string[] {
    const tagSet = new Set<string>();
    ALL_ASSETS.forEach((asset) => {
        asset.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
}