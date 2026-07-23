import type { Asset, AssetCode } from '../components/types';
import type { DeviceMode, CodeTab } from './types';
import { DEVICE_CONFIGS } from './types';

// ─── Device Width Resolution ──────────────────────────────────────────────────

export function getDeviceWidth(device: DeviceMode, customWidth: number): number | null {
  if (device === 'custom') {
    return clampWidth(customWidth);
  }
  const config = DEVICE_CONFIGS.find((d) => d.id === device);
  return config?.width ?? null;
}

export function clampWidth(width: number): number {
  return Math.max(240, Math.min(1200, width));
}

// ─── Code Tab Resolution ──────────────────────────────────────────────────────

export function getAvailableCodeTabs(code: AssetCode): CodeTab[] {
  return (Object.keys(code) as CodeTab[]).filter(
    (key) => code[key] !== undefined && code[key] !== ''
  );
}

export function getDefaultCodeTab(code: AssetCode): CodeTab {
  const available = getAvailableCodeTabs(code);
  if (available.includes('react')) return 'react';
  return available[0] ?? 'react';
}

export function getCodeForTab(code: AssetCode, tab: CodeTab): string {
  return code[tab] ?? code.react ?? code.html ?? code.tailwind ?? '';
}

// ─── JSX → HTML Conversion (v3) ────────────────────────────────────────────────
//
// v3: resolves useState() initial values into a static preview using
// self-contained, order-independent passes — each transformation either
// fully resolves a pattern or leaves it untouched, never a partial or
// broken substitution. A final validation pass catches anything that
// still looks malformed (leftover template syntax, unbalanced quotes,
// near-empty output) and safely falls back to "Preview unavailable"
// rather than ever rendering a blank/broken preview.

const UNSUPPORTED_HOOK_PATTERN = /\b(useEffect|useRef|useMemo|useCallback)\b/;

export function hasComplexLogic(code: string): boolean {
  return UNSUPPORTED_HOOK_PATTERN.test(code);
}

function parseSimpleLiteral(raw: string): string | number | boolean | undefined {
  const trimmed = raw.trim();
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (trimmed === "''" || trimmed === '""') return '';
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  const singleQuoted = /^'([^']*)'$/.exec(trimmed);
  if (singleQuoted) return singleQuoted[1];
  const doubleQuoted = /^"([^"]*)"$/.exec(trimmed);
  if (doubleQuoted) return doubleQuoted[1];
  return undefined; // arrays, objects, function calls — unsupported, skipped safely
}

function stripQuotes(value: string): string {
  return value.trim().replace(/^['"`]|['"`]$/g, '');
}

interface ExtractedState {
  name: string;
  value: string | number | boolean | undefined;
}

function extractStateDeclarations(code: string): ExtractedState[] {
  const states: ExtractedState[] = [];
  const stateDeclRegex = /const\s*\[\s*(\w+)\s*,\s*set\w+\s*\]\s*=\s*useState(?:<[^>]*>)?\(([^;]*)\)\s*;?/g;
  let match: RegExpExecArray | null;
  while ((match = stateDeclRegex.exec(code)) !== null) {
    states.push({ name: match[1], value: parseSimpleLiteral(match[2]) });
  }
  return states;
}

/**
 * Resolve `attr={`...${state}...`}` template-literal attributes into
 * plain static `attr="..."` strings in ONE self-contained pass per match.
 * This guarantees every match always yields a validly-quoted attribute —
 * never a stray backtick or unclosed brace left dangling in the output,
 * which was the root cause of the blank-preview bug.
 */
function resolveTemplateLiteralAttributes(jsx: string, states: ExtractedState[]): string {
  return jsx.replace(/(\w[\w-]*)=\{`([^`]*)`\}/g, (_full, attrName: string, inner: string) => {
    let resolved = inner;

    for (const { name, value } of states) {
      if (value === undefined) continue;
      const n = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      resolved = resolved.replace(
        new RegExp('\\$\\{\\s*' + n + '\\s*\\?\\s*([^:]*?)\\s*:\\s*([^}]*?)\\s*\\}', 'g'),
        (_f: string, a: string, b: string) => stripQuotes(value ? a : b)
      );
      resolved = resolved.replace(
        new RegExp('\\$\\{\\s*' + n + '\\s*\\}', 'g'),
        String(value)
      );
    }

    // Drop any interpolation we couldn't resolve (derived values, indexed
    // lookups like colors[strength], etc.) rather than leaving broken
    // ${...} syntax behind — the attribute stays valid either way.
    resolved = resolved.replace(/\$\{[^}]*\}/g, '').replace(/\s{2,}/g, ' ').trim();

    return `${attrName}="${resolved}"`;
  });
}

/**
 * Resolve JSX-level conditionals referencing known state variables:
 * `{name ? <A/> : <B/>}`, `{name && <A/>}`, `{!name && <A/>}`, bare `{name}`.
 */
function resolveJsxConditionals(jsx: string, states: ExtractedState[]): string {
  let working = jsx;

  for (const { name, value } of states) {
    if (value === undefined) continue;
    const n = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    working = working.replace(
      new RegExp('\\{\\s*' + n + '\\s*\\?\\s*([\\s\\S]*?)\\s*:\\s*([\\s\\S]*?)\\}', 'g'),
      (_f: string, a: string, b: string) => (value ? a : b).trim()
    );
    working = working.replace(
      new RegExp('\\{\\s*' + n + '\\s*&&\\s*([\\s\\S]*?)\\}', 'g'),
      (_f: string, a: string) => (value ? a.trim() : '')
    );
    working = working.replace(
      new RegExp('\\{\\s*!' + n + '\\s*&&\\s*([\\s\\S]*?)\\}', 'g'),
      (_f: string, a: string) => (!value ? a.trim() : '')
    );
    working = working.replace(new RegExp('\\{\\s*' + n + '\\s*\\}', 'g'), String(value));
  }

  return working;
}

/**
 * Final safety net — reject anything that still looks malformed rather
 * than risk rendering a blank or broken preview.
 */
function isWellFormed(html: string): boolean {
  if (!html || html.trim().length < 8) return false;
  if (html.includes('${') || html.includes('`')) return false;
  const quoteCount = (html.match(/"/g) || []).length;
  if (quoteCount % 2 !== 0) return false;
  return true;
}

export function jsxToHtml(code: string): string | null {
  if (hasComplexLogic(code)) {
    return null;
  }

  const firstTagIndex = code.search(/<[A-Za-z]/);
  if (firstTagIndex === -1) {
    return null;
  }

  let html = code.slice(firstTagIndex).trim();
  const states = /useState/.test(code) ? extractStateDeclarations(code) : [];

  if (states.length > 0) {
    html = resolveTemplateLiteralAttributes(html, states);
    html = resolveJsxConditionals(html, states);
  }

  // Remove JSX comments
  html = html.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');

  // className → class
  html = html.replace(/className=/g, 'class=');

  // Remove event handler attributes — inert in a static preview
  html = html.replace(/\s(on[A-Z]\w*)=\{[^{}]*\}/g, '');

  // Self-closing capitalized (icon/component) tags → inline placeholder span
  html = html.replace(
    /<([A-Z][A-Za-z0-9]*)\s+([^>]*?)\/>/g,
    '<span $2 style="display:inline-block;width:1em;height:1em;"></span>'
  );
  html = html.replace(/<([A-Z][A-Za-z0-9]*)([^>]*)>/g, '<span $2>');
  html = html.replace(/<\/([A-Z][A-Za-z0-9]*)>/g, '</span>');

  // Remove .map() expressions we don't attempt to statically unroll
  html = html.replace(/\{[^{}]*\.map\([\s\S]*?\)\}/g, '');

  // Remove simple string-literal expression wrappers: {'text'} → text
  html = html.replace(/\{['"`]([^'"`]*)['"`]\}/g, '$1');

  // Anything else left in {…} at this point is unresolved — drop it
  html = html.replace(/\{[^{}]*\}/g, '');

  html = html.replace(/\s{2,}/g, ' ').trim();

  if (!isWellFormed(html)) {
    return null;
  }

  return html;
}

// ─── Preview HTML Resolution ──────────────────────────────────────────────────

export interface PreviewResolution {
  html: string | null;
  source: 'html' | 'react-converted' | 'unavailable';
}

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

export function formatDeviceWidth(width: number | null): string {
  return width === null ? '100%' : `${width}px`;
}

export function countLines(code: string): number {
  return code.split('\n').length;
}