import type { Asset, AssetCode } from '../Components/types';
import type { DeviceMode, CodeTab } from './types';
import { DEVICE_CONFIGS } from './types';

// ─── Device Width Resolution ──────────────────────────────────────────────────

/**
 * Resolve the pixel width for a given device mode.
 * Returns null for 'desktop' meaning "100% width".
 */
export function getDeviceWidth(device: DeviceMode, customWidth: number): number | null {
    if (device === 'custom') {
        return clampWidth(customWidth);
    }
    const config = DEVICE_CONFIGS.find((d) => d.id === device);
    return config?.width ?? null;
}

/**
 * Clamp a custom viewport width to a sane range.
 */
export function clampWidth(width: number): number {
    return Math.max(240, Math.min(1200, width));
}

// ─── Code Tab Resolution ──────────────────────────────────────────────────────

/**
 * Get the list of code tabs available for an asset (react / html / tailwind).
 */
export function getAvailableCodeTabs(code: AssetCode): CodeTab[] {
    return (Object.keys(code) as CodeTab[]).filter(
        (key) => code[key] !== undefined && code[key] !== ''
    );
}

/**
 * Get the best default code tab for an asset.
 * Prefers 'react', falls back to whatever is first available.
 */
export function getDefaultCodeTab(code: AssetCode): CodeTab {
    const available = getAvailableCodeTabs(code);
    if (available.includes('react')) return 'react';
    return available[0] ?? 'react';
}

/**
 * Get the code string for a given tab, with safe fallback chain.
 */
export function getCodeForTab(code: AssetCode, tab: CodeTab): string {
    return code[tab] ?? code.react ?? code.html ?? code.tailwind ?? '';
}

// ─── JSX → HTML Conversion ─────────────────────────────────────────────────────
//
// Best-effort conversion of simple JSX snippets into renderable HTML strings.
// This is NOT a full JSX parser — it handles the common patterns used in our
// component library: className, self-closing tags, simple {expr} removal,
// comments, and basic conditional/map removal.
//
// For complex snippets containing hooks (useState, etc.) or JS logic, the
// renderer will fall back to a "code preview unavailable" message and the
// user can still view the source code in the Code tab.

const HOOK_PATTERN = /\b(useState|useEffect|useRef|useMemo|useCallback)\b/;

/**
 * Detect whether a code snippet contains React hooks or complex JS logic
 * that cannot be safely converted to static HTML.
 */
export function hasComplexLogic(code: string): boolean {
    return HOOK_PATTERN.test(code);
}

/**
 * Convert a JSX snippet to an HTML string for live preview rendering.
 * Returns null if the code is too complex to convert safely.
 */
export function jsxToHtml(code: string): string | null {
    if (hasComplexLogic(code)) {
        return null;
    }

    let html = code.trim();

    // Remove JSX comments: {/* ... */}
    html = html.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');

    // Convert className= to class=
    html = html.replace(/className=/g, 'class=');

    // Remove simple icon component tags like <Plus className="..." />
    // Replace with a generic span placeholder so layout spacing is preserved
    html = html.replace(
        /<([A-Z][A-Za-z0-9]*)\s+([^>]*?)\/>/g,
        '<span $2 style="display:inline-block;width:1em;height:1em;"></span>'
    );

    // Remove any remaining capitalized component tags (opening)
    html = html.replace(/<([A-Z][A-Za-z0-9]*)([^>]*)>/g, '<span $2>');
    html = html.replace(/<\/([A-Z][A-Za-z0-9]*)>/g, '</span>');

    // Remove map/array expressions — replace {array.map(...)} blocks with empty
    html = html.replace(/\{[^{}]*\.map\([\s\S]*?\)\}/g, '');

    // Remove remaining simple {expression} blocks (text interpolations)
    // but keep literal text content where possible
    html = html.replace(/\{['"`]([^'"`]*)['"`]\}/g, '$1');
    html = html.replace(/\{[^{}]*\}/g, '');

    // Collapse excessive whitespace
    html = html.replace(/\s{2,}/g, ' ').trim();

    return html;
}

// ─── Preview HTML Resolution ──────────────────────────────────────────────────

export interface PreviewResolution {
    html: string | null;
    source: 'html' | 'react-converted' | 'unavailable';
}

/**
 * Resolve the best HTML representation for previewing an asset.
 * Priority: explicit code.html → converted code.react → unavailable.
 */
export function resolvePreviewHtml(asset: Asset): PreviewResolution {
    if (asset.code.html) {
        return { html: asset.code.html, source: 'html' };
    }

    if (asset.code.react) {
        const converted = jsxToHtml(asset.code.react);
        if (converted) {
            return { html: converted, source: 'react-converted' };
        }
    }

    return { html: null, source: 'unavailable' };
}

// ─── Formatting Helpers ────────────────────────────────────────────────────────

/**
 * Format a device width for display, e.g. "375px" or "100%".
 */
export function formatDeviceWidth(width: number | null): string {
    return width === null ? '100%' : `${width}px`;
}

/**
 * Count lines in a code string — used for line numbers in the code viewer.
 */
export function countLines(code: string): number {
    return code.split('\n').length;
}