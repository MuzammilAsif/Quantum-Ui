import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
    onReset: () => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * PreviewErrorBoundary — protects the rest of Quantum UI from crashes
 * that occur inside our own preview rendering React code.
 *
 * This is distinct from PreviewError.tsx, which handles errors reported
 * by the sandboxed iframe (bad asset code). This boundary catches bugs
 * in PreviewEngine, PreviewRenderer, PreviewToolbar, etc. themselves.
 *
 * Critical requirement from Phase 2 Step 12:
 * "Bad components should never break previews. Never crash Quantum UI."
 *
 * This is the last line of defense — if everything else fails,
 * this still prevents a white-screen crash of the entire extension.
 */
export class PreviewErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('[QuantumUI PreviewErrorBoundary]', error, errorInfo);
    }

    private handleReset = (): void => {
        this.setState({ hasError: false, error: null });
        this.props.onReset();
    };

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center
          w-full h-full gap-4 p-6 text-center bg-q-base">

                    <div className="w-12 h-12 rounded-xl bg-red-500/10
            border border-red-500/20 flex items-center justify-center">
                        <ShieldAlert
                            size={20}
                            className="text-red-400"
                            aria-hidden="true"
                        />
                    </div>

                    <div className="space-y-1.5 max-w-[220px]">
                        <p className="text-xs font-semibold text-q-text-muted">
                            Preview engine crashed
                        </p>
                        <p className="text-2xs text-q-text-faint leading-relaxed">
                            Something went wrong loading the preview system. This has been
                            isolated and your data is safe.
                        </p>
                    </div>

                    <button
                        onClick={this.handleReset}
                        className="flex items-center justify-center gap-1.5
              px-3 py-2 rounded-md text-2xs font-semibold cursor-pointer
              bg-q-elevated border border-q-border text-q-text-muted
              hover:text-q-text hover:border-[var(--q-accent-border)]
              transition-all duration-150"
                    >
                        <RefreshCw size={11} aria-hidden="true" />
                        Close and retry
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}