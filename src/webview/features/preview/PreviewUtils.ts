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

// ─── JSX → HTML Conversion ─────────────────────────────────────────────────────
//
// Converts simple JSX snippets into renderable static HTML.
//
// v2: now resolves simple useState() hooks to their initial value, so
// interactive components (toggles, radio groups, checkboxes) render their
// default visual state instead of bailing out entirely. Components with
// genuinely unsupported patterns (useEffect/useRef/useMemo/useCallback, or
// state resolved via method calls / loops over inline object arrays) still
// gracefully fall back to "Preview unavailable" — the source code remains
// fully viewable and copyable regardless.

const UNSUPPORTED_HOOK_PATTERN = /\b(useEffect|useRef|useMemo|useCallback)\b/;

/**
 * Detect hooks that are fundamentally unsafe to statically resolve.
 * useState is intentionally excluded — it's now partially supported.
 */
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
  return undefined; // arrays, objects, function calls — unsupported
}

function stripQuotes(value: string): string {
  return value.trim().replace(/^['"`]|['"`]$/g, '');
}

interface ExtractedState {
  name: string;
  value: string | number | boolean | undefined;
}

/**
 * Extract all `const [x, setX] = useState(initial);` declarations from
 * a code string, resolving each initial value to a JS primitive where
 * possible (arrays/objects/complex expressions resolve to undefined and
 * are simply skipped during substitution, not fatal to the whole component).
 */
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
 * Substitute known state variable references within a JSX string with
 * their resolved initial values. Handles the common authored patterns:
 * template-literal ternaries in class attributes, JSX-level ternaries,
 * AND-guards, and direct interpolation.
 */
function resolveStateReferences(jsx: string, states: ExtractedState[]): string {
  let working = jsx;

  for (const { name, value } of states) {
    if (value === undefined) continue; // unsupported initial value — skip, handled by safety nets later
    const n = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // ${name ? 'a' : 'b'}  → resolved literal (inside template-literal class strings)
    working = working.replace(
      new RegExp('\\$\\{\\s*' + n + '\\s*\\?\\s*([^:]*?)\\s*:\\s*([^}]*?)\\s*\\}', 'g'),
      (_f: string, a: string, b: string) => stripQuotes(value ? a : b)
    );
    // ${name}
    working = working.replace(new RegExp('\\$\\{\\s*' + n + '\\s*\\}', 'g'), String(value));

    // {name ? <A/> : <B/>}
    working = working.replace(
      new RegExp('\\{\\s*' + n + '\\s*\\?\\s*([\\s\\S]*?)\\s*:\\s*([\\s\\S]*?)\\}', 'g'),
      (_f: string, a: string, b: string) => (value ? a : b).trim()
    );
    // {name && <A/>}
    working = working.replace(
      new RegExp('\\{\\s*' + n + '\\s*&&\\s*([\\s\\S]*?)\\}', 'g'),
      (_f: string, a: string) => (value ? a.trim() : '')
    );
    // {!name && <A/>}
    working = working.replace(
      new RegExp('\\{\\s*!' + n + '\\s*&&\\s*([\\s\\S]*?)\\}', 'g'),
      (_f: string, a: string) => (!value ? a.trim() : '')
    );
    // Bare {name}
    working = working.replace(new RegExp('\\{\\s*' + n + '\\s*\\}', 'g'), String(value));
  }

  return working;
}

/**
 * Convert a JSX snippet to an HTML string for live preview rendering.
 * Returns null if the code is too complex to convert safely.
 */
export function jsxToHtml(code: string): string | null {
  if (hasComplexLogic(code)) {
    return null;
  }

  // Slice off everything before the first JSX tag — this strips hook
  // declarations, derived consts, and handler functions in one pass.
  const firstTagIndex = code.search(/<[A-Za-z]/);
  if (firstTagIndex === -1) {
    return null;
  }

  let html = code.slice(firstTagIndex).trim();

  // Resolve any useState() values found in the ORIGINAL code against
  // the sliced JSX portion.
  if (/useState/.test(code)) {
    const states = extractStateDeclarations(code);
    html = resolveStateReferences(html, states);
  }

  // Remove JSX comments: {/* ... */}
  html = html.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');

  // Safety net: strip any remaining unresolved template-literal expressions
  // (comparisons, method calls, or state we intentionally skipped)
  html = html.replace(/\$\{[^}]*\}/g, '');

  // Convert now-static template-literal attributes into plain strings:
  // attr={`...`}  →  attr="..."
  html = html.replace(/=\{`([^`]*)`\}/g, '="$1"');

  // Convert className= to class=
  html = html.replace(/className=/g, 'class=');

  // Remove event handler attributes — inert in a static preview anyway
  html = html.replace(/\s(on[A-Z]\w*)=\{[^{}]*\}/g, '');

  // Remove simple icon component tags like <Plus className="..." />
  html = html.replace(
    /<([A-Z][A-Za-z0-9]*)\s+([^>]*?)\/>/g,
    '<span $2 style="display:inline-block;width:1em;height:1em;"></span>'
  );

  // Remove any remaining capitalized component tags
  html = html.replace(/<([A-Z][A-Za-z0-9]*)([^>]*)>/g, '<span $2>');
  html = html.replace(/<\/([A-Z][A-Za-z0-9]*)>/g, '</span>');

  // Remove simple map/array expressions (flat arrays / named identifiers —
  // inline arrays of object literals directly before .map() are not
  // supported and will fall through to the generic cleanup below)
  html = html.replace(/\{[^{}]*\.map\([\s\S]*?\)\}/g, '');

  // Remove remaining simple {expression} blocks
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