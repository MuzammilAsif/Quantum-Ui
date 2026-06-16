import { memo } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Code2 } from 'lucide-react';

interface PreviewErrorProps {
    message: string;
    onRetry: () => void;
    onViewCode: () => void;
}

/**
 * PreviewError — shown when the sandbox reports a render error.
 *
 * Provides two recovery actions:
 * 1. Retry — re-renders the sandbox from scratch
 * 2. View Code — switches to Code tab so user can still see the source
 *
 * This component intentionally never shows raw stack traces to the user.
 * The error message is shown in simplified form only.
 */
export const PreviewError = memo(function PreviewError({
    message,
    onRetry,
    onViewCode,
}: PreviewErrorProps) {
    // Simplify raw error messages for user-friendly display
    const friendlyMessage = simplifyErrorMessage(message);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center
        w-full h-full gap-4 p-6 text-center"
        >
            {/* Error icon */}
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20
        flex items-center justify-center">
                <AlertTriangle
                    size={20}
                    className="text-red-400"
                    aria-hidden="true"
                />
            </div>

            {/* Error message */}
            <div className="space-y-1.5 max-w-[220px]">
                <p className="text-xs font-semibold text-q-text-muted">
                    Preview unavailable
                </p>
                <p className="text-2xs text-q-text-faint leading-relaxed">
                    {friendlyMessage}
                </p>
            </div>

            {/* Recovery actions */}
            <div className="flex flex-col gap-2 w-full max-w-[180px]">
                <button
                    onClick={onRetry}
                    className="flex items-center justify-center gap-1.5 w-full
            px-3 py-2 rounded-md text-2xs font-semibold cursor-pointer
            bg-q-elevated border border-q-border text-q-text-muted
            hover:text-q-text hover:border-[var(--q-accent-border)]
            transition-all duration-150"
                >
                    <RefreshCw size={11} aria-hidden="true" />
                    Retry preview
                </button>

                <button
                    onClick={onViewCode}
                    className="flex items-center justify-center gap-1.5 w-full
            px-3 py-2 rounded-md text-2xs font-semibold cursor-pointer
            bg-[var(--q-accent-subtle)] border border-[var(--q-accent-border)]
            text-[var(--q-accent)] hover:bg-[var(--q-accent)] hover:text-white
            transition-all duration-150"
                >
                    <Code2 size={11} aria-hidden="true" />
                    View source code
                </button>
            </div>
        </motion.div>
    );
});

// ─── Error message simplifier ─────────────────────────────────────────────────

function simplifyErrorMessage(raw: string): string {
    if (!raw) {
        return 'An unknown error occurred during rendering.';
    }

    // Known patterns that can be simplified
    if (raw.includes('is not defined')) {
        const match = /(\w+) is not defined/.exec(raw);
        const name = match?.[1] ?? 'A variable';
        return `${name} is not defined. This component may require imports not available in preview.`;
    }

    if (raw.includes('Cannot read propert')) {
        return 'A property access error occurred. This component may require additional props or context.';
    }

    if (raw.includes('useState') || raw.includes('useEffect')) {
        return 'This component uses React hooks and cannot be statically previewed. View the source code instead.';
    }

    if (raw.includes('SyntaxError')) {
        return 'The component code contains a syntax error.';
    }

    if (raw.toLowerCase().includes('network') || raw.toLowerCase().includes('fetch')) {
        return 'A network request failed during preview rendering.';
    }

    // Return truncated raw message as fallback
    return raw.length > 120 ? `${raw.slice(0, 120)}...` : raw;
}