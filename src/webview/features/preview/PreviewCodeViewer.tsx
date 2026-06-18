import { memo, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Code2 } from 'lucide-react';
import { usePreviewStore } from '../../store/previewStore';
import { useToast } from '../../hooks/useToast';
import {
    getAvailableCodeTabs,
    getCodeForTab,
    countLines,
} from './PreviewUtils';
import { cn } from '../../utils';
import type { CodeTab } from './types';

// ─── Syntax token colorizer ───────────────────────────────────────────────────
//
// Lightweight regex-based colorizer. Not a full parser — covers the
// most common patterns in our component library code strings.

interface Token {
    type:
    | 'keyword'
    | 'string'
    | 'comment'
    | 'tag'
    | 'attribute'
    | 'value'
    | 'punctuation'
    | 'plain';
    value: string;
}

function tokenizeLine(line: string): Token[] {
    const tokens: Token[] = [];
    let remaining = line;

    while (remaining.length > 0) {
        // JSX/HTML comments
        const commentMatch = /^(\/\/.*|\/\*[\s\S]*?\*\/)/.exec(remaining);
        if (commentMatch) {
            tokens.push({ type: 'comment', value: commentMatch[0] });
            remaining = remaining.slice(commentMatch[0].length);
            continue;
        }

        // String literals
        const stringMatch = /^(['"`])(?:(?!\1)[^\\]|\\.)*\1/.exec(remaining);
        if (stringMatch) {
            tokens.push({ type: 'string', value: stringMatch[0] });
            remaining = remaining.slice(stringMatch[0].length);
            continue;
        }

        // JSX tags
        const tagMatch = /^<\/?[A-Za-z][A-Za-z0-9.]*/.exec(remaining);
        if (tagMatch) {
            tokens.push({ type: 'tag', value: tagMatch[0] });
            remaining = remaining.slice(tagMatch[0].length);
            continue;
        }

        // Keywords
        const keywordMatch =
            /^(const|let|var|function|return|import|export|from|default|type|interface|if|else|=>|async|await|class)\b/.exec(
                remaining
            );
        if (keywordMatch) {
            tokens.push({ type: 'keyword', value: keywordMatch[0] });
            remaining = remaining.slice(keywordMatch[0].length);
            continue;
        }

        // HTML attributes (word=)
        const attrMatch = /^[a-zA-Z-]+(?==)/.exec(remaining);
        if (attrMatch) {
            tokens.push({ type: 'attribute', value: attrMatch[0] });
            remaining = remaining.slice(attrMatch[0].length);
            continue;
        }

        // Punctuation
        const punctMatch = /^[{}()[\]<>/.,;:=!&|+\-*?]/.exec(remaining);
        if (punctMatch) {
            tokens.push({ type: 'punctuation', value: punctMatch[0] });
            remaining = remaining.slice(punctMatch[0].length);
            continue;
        }

        // Fallback — grab next character as plain text
        tokens.push({ type: 'plain', value: remaining[0] });
        remaining = remaining.slice(1);
    }

    return tokens;
}

// ─── Token color map ──────────────────────────────────────────────────────────

const TOKEN_COLORS: Record<Token['type'], string> = {
    keyword: 'text-violet-400',
    string: 'text-emerald-400',
    comment: 'text-gray-500 italic',
    tag: 'text-blue-400',
    attribute: 'text-amber-300',
    value: 'text-emerald-300',
    punctuation: 'text-gray-400',
    plain: 'text-gray-300',
};

// ─── Single highlighted line ──────────────────────────────────────────────────

function HighlightedLine({ line }: { line: string }) {
    if (!line.trim()) {
        return <span>&nbsp;</span>;
    }

    const tokens = tokenizeLine(line);
    return (
        <>
            {tokens.map((token, i) => (
                <span key={i} className={TOKEN_COLORS[token.type]}>
                    {token.value}
                </span>
            ))}
        </>
    );
}

// ─── Code tab pill ────────────────────────────────────────────────────────────

interface CodeTabPillProps {
    tab: CodeTab;
    isActive: boolean;
    onClick: () => void;
}

function CodeTabPill({ tab, isActive, onClick }: CodeTabPillProps) {
    return (
        <motion.button
            onClick={onClick}
            aria-pressed={isActive}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 500, damping: 40 }}
            className={cn(
                'px-2.5 py-1 rounded text-2xs font-semibold cursor-pointer',
                'transition-all duration-150 uppercase',
                isActive
                    ? 'bg-[var(--q-accent)] text-white'
                    : 'text-q-text-muted hover:text-q-text'
            )}
        >
            {tab}
        </motion.button>
    );
}

// ─── Main PreviewCodeViewer ───────────────────────────────────────────────────

interface PreviewCodeViewerProps {
    className?: string;
}

/**
 * PreviewCodeViewer — syntax-highlighted code panel.
 *
 * Features:
 * - Tab selector for React / HTML / Tailwind variants
 * - Line numbers
 * - Lightweight regex-based syntax highlighting
 * - Copy button with success feedback
 * - Scrollable — handles long code blocks cleanly
 */
export const PreviewCodeViewer = memo(function PreviewCodeViewer({
    className,
}: PreviewCodeViewerProps) {
    const {
        asset,
        activeCodeTab,
        setActiveCodeTab,
    } = usePreviewStore();

    const { success } = useToast();
    const [copied, setCopied] = useState(false);

    const availableTabs = useMemo(
        () => (asset ? getAvailableCodeTabs(asset.code) : []),
        [asset]
    );

    const code = useMemo(
        () => (asset ? getCodeForTab(asset.code, activeCodeTab) : ''),
        [asset, activeCodeTab]
    );

    const lines = useMemo(() => code.split('\n'), [code]);
    const lineCount = countLines(code);

    const handleCopy = () => {
        if (!code || !asset) return;
        void navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            success(`${asset.title} copied!`);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    if (!asset) return null;

    return (
        <div className={cn(
            'flex flex-col h-full overflow-hidden',
            'bg-q-void border-l border-q-border',
            className
        )}>

            {/* ── Header bar ──────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between gap-2 px-3 py-2
        border-b border-q-border bg-q-surface flex-shrink-0">

                {/* Tab selector */}
                <div className="flex items-center gap-0.5 bg-q-elevated
          rounded-md p-0.5 border border-q-border">
                    {availableTabs.map((tab) => (
                        <CodeTabPill
                            key={tab}
                            tab={tab}
                            isActive={activeCodeTab === tab}
                            onClick={() => setActiveCodeTab(tab)}
                        />
                    ))}
                </div>

                {/* Line count + copy */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-2xs text-q-text-ghost">
                        {lineCount} line{lineCount !== 1 ? 's' : ''}
                    </span>

                    <motion.button
                        onClick={handleCopy}
                        aria-label="Copy code"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.93 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                        className={cn(
                            'flex items-center gap-1 px-2 py-0.5 rounded cursor-pointer',
                            'text-2xs font-semibold border transition-all duration-150',
                            copied
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                : 'bg-q-elevated border-q-border text-q-text-muted hover:text-q-text hover:border-[var(--q-accent-border)]'
                        )}
                    >
                        {copied ? (
                            <><Check size={10} />Copied</>
                        ) : (
                            <><Copy size={10} />Copy</>
                        )}
                    </motion.button>
                </div>
            </div>

            {/* ── Code block with line numbers ─────────────────────────────────── */}
            <div className="flex-1 overflow-auto">
                <table className="w-full border-collapse">
                    <tbody>
                        {lines.map((line, index) => (
                            <tr
                                key={index}
                                className="hover:bg-white/[0.02] transition-colors duration-75"
                            >
                                {/* Line number */}
                                <td className={cn(
                                    'select-none text-right pr-4 pl-3 py-px',
                                    'text-2xs font-mono text-q-text-ghost',
                                    'border-r border-q-border w-8 min-w-[2rem]',
                                    'sticky left-0 bg-q-void'
                                )}>
                                    {index + 1}
                                </td>

                                {/* Code line */}
                                <td className="pl-4 pr-4 py-px font-mono text-2xs
                  leading-relaxed whitespace-pre">
                                    <HighlightedLine line={line} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
});