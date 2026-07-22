import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Send, Code2, Copy, Check, Loader2,
  AlertTriangle, Settings as SettingsIcon, RotateCcw, Eye,
} from 'lucide-react';
import { ContentContainer } from '../components/ContentContainer';
import { SectionTitle } from '../components/SectionTitle';
import { useVSCode, useVSCodeMessage } from '../hooks/useVSCode';
import { useNavigation } from '../hooks/useNavigation';
import { useToast } from '../hooks/useToast';
import { useAssetStore } from '../store/assetStore';
import { cn, generateId } from '../utils';
import { MessageType } from '../types';
import type { WebviewMessage } from '../types';
import type { Asset } from '../features/components/types';

const PROMPT_SUGGESTIONS = [
  'A pricing card with 3 tiers',
  'A dark mode toggle button',
  'A responsive navigation bar',
  'A stats dashboard widget',
];

type GenerationState = 'idle' | 'checking-key' | 'no-key' | 'streaming' | 'complete' | 'error';

export const AIStudioPage = memo(function AIStudioPage() {
  const [prompt, setPrompt] = useState('');
  const [framework, setFramework] = useState<'react' | 'vue' | 'html'>('react');
  const [state, setState] = useState<GenerationState>('idle');
  const [streamedCode, setStreamedCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  const currentRequestId = useRef<string | null>(null);
  const { postMessage } = useVSCode();
  const { navigate } = useNavigation();
  const { success } = useToast();
  const { selectAsset } = useAssetStore();

  // ── Check API key status on mount ─────────────────────────────────────────
  useEffect(() => {
    postMessage({ type: MessageType.GET_API_KEY_STATUS });
  }, [postMessage]);

  useVSCodeMessage<WebviewMessage>(MessageType.API_KEY_STATUS, (message) => {
    const payload = (message as WebviewMessage & { payload?: { hasKey: boolean } }).payload;
    if (payload) {
      setHasApiKey(payload.hasKey);
    }
  });

  // ── Listen for streaming chunks ────────────────────────────────────────────
  useVSCodeMessage<WebviewMessage>(MessageType.AI_STREAM_CHUNK, (message) => {
    const payload = (message as WebviewMessage & {
      payload?: { chunk: string; requestId: string };
    }).payload;

    if (payload && payload.requestId === currentRequestId.current) {
      setStreamedCode((prev) => prev + payload.chunk);
    }
  });

  // ── Listen for stream completion ───────────────────────────────────────────
  useVSCodeMessage<WebviewMessage>(MessageType.AI_STREAM_END, (message) => {
    const payload = (message as WebviewMessage & {
      payload?: { requestId: string; result: string };
    }).payload;

    if (payload && payload.requestId === currentRequestId.current) {
      setState('complete');
      success('Component generated!');
    }
  });

  // ── Listen for errors ──────────────────────────────────────────────────────
  useVSCodeMessage<WebviewMessage>(MessageType.AI_ERROR, (message) => {
    const payload = (message as WebviewMessage & {
      payload?: { requestId: string; error: string };
    }).payload;

    if (payload && payload.requestId === currentRequestId.current) {
      setState('error');
      setErrorMessage(payload.error);
    }
  });

  // ── Submit handler ──────────────────────────────────────────────────────────
  const handleSubmit = useCallback(() => {
    if (!prompt.trim()) return;

    if (hasApiKey === false) {
      setState('no-key');
      return;
    }

    const requestId = generateId();
    currentRequestId.current = requestId;
    setStreamedCode('');
    setErrorMessage('');
    setState('streaming');

    postMessage({
      type: MessageType.AI_GENERATE,
      payload: { requestId, prompt: prompt.trim(), framework },
    } as never);
  }, [prompt, framework, hasApiKey, postMessage]);

  const handleReset = useCallback(() => {
    setState('idle');
    setStreamedCode('');
    setErrorMessage('');
    currentRequestId.current = null;
  }, []);

  // ── Open generated code in the live PreviewEngine ─────────────────────────
  // Wraps the AI-generated code in a synthetic Asset object so it can flow
  // through the exact same preview pipeline built in Phase 2 — no special
  // casing needed in PreviewEngine, PreviewRenderer, or PreviewSandbox.
  const handlePreview = useCallback(() => {
    if (!streamedCode.trim()) return;

    const syntheticAsset: Asset = {
      id: `ai-generated-${generateId()}`,
      title: prompt.trim().length > 40 ? `${prompt.trim().slice(0, 40)}...` : prompt.trim() || 'AI Generated Component',
      category: 'cards',
      framework,
      tags: ['ai-generated'],
      description: `Generated from prompt: "${prompt.trim()}"`,
      preview: null,
      code: {
        [framework]: streamedCode,
      },
      difficulty: 'Beginner',
      version: '1.0.0',
      author: 'AI Studio',
      dateAdded: new Date().toISOString().split('T')[0],
    };

    selectAsset(syntheticAsset);
  }, [streamedCode, prompt, framework, selectAsset]);
  const handleCopy = useCallback(() => {
    if (!streamedCode) return;
    void navigator.clipboard.writeText(streamedCode).then(() => {
      setCopied(true);
      success('Code copied!');
      setTimeout(() => setCopied(false), 2000);
    });
  }, [streamedCode, success]);

  const isStreaming = state === 'streaming';
  const isComplete = state === 'complete';
  const isError = state === 'error';
  const isNoKey = state === 'no-key' || hasApiKey === false;

  return (
    <ContentContainer>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #06d6d6)',
            boxShadow: '0 0 12px rgba(139,92,246,0.3)',
          }}
        >
          <Sparkles size={14} className="text-white" />
        </div>
        <SectionTitle title="AI Studio" subtitle="Generate UI from natural language" />
      </div>

      {/* ── No API key warning ─────────────────────────────────────────── */}
      {isNoKey && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-2 p-3 rounded-lg border border-amber-500/20
            bg-amber-500/10"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-amber-400 flex-shrink-0" />
            <p className="text-xs font-semibold text-amber-400">
              No API key configured
            </p>
          </div>
          <p className="text-2xs text-q-text-muted leading-relaxed">
            Add your OpenAI API key in Settings to start generating components.
          </p>
          <button
            onClick={() => navigate('settings' as never)}
            className="flex items-center justify-center gap-1.5 py-2 rounded-md
              text-2xs font-semibold bg-amber-500/20 text-amber-300
              hover:bg-amber-500/30 cursor-pointer transition-all w-fit px-3"
          >
            <SettingsIcon size={11} />
            Open Settings
          </button>
        </motion.div>
      )}

      {/* ── Framework selector ─────────────────────────────────────────── */}
      <div>
        <p className="text-2xs font-semibold uppercase tracking-widest text-q-text-faint mb-2">
          Framework
        </p>
        <div className="flex gap-1.5">
          {(['react', 'vue', 'html'] as const).map((fw) => (
            <button
              key={fw}
              onClick={() => setFramework(fw)}
              disabled={isStreaming}
              className={cn(
                'px-3 py-1 rounded-md text-xs font-medium cursor-pointer',
                'transition-all duration-150 select-none capitalize',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                framework === fw
                  ? 'bg-[var(--q-accent)] text-white'
                  : 'bg-q-elevated border border-q-border text-q-text-muted hover:text-q-text'
              )}
            >
              {fw === 'react' ? 'React' : fw === 'vue' ? 'Vue' : 'HTML'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Prompt input ────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <p className="text-2xs font-semibold uppercase tracking-widest text-q-text-faint">
          Describe your component
        </p>
        <div className={cn(
          'relative rounded-lg border bg-q-elevated transition-all duration-150',
          prompt ? 'border-[var(--q-accent-border)]' : 'border-q-border'
        )}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && e.metaKey) handleSubmit(); }}
            disabled={isStreaming}
            placeholder="A responsive card component with an image, title, description, and CTA button…"
            rows={4}
            className={cn(
              'w-full bg-transparent resize-none outline-none',
              'text-xs text-q-text placeholder:text-q-text-faint',
              'px-3 pt-3 pb-8 leading-relaxed disabled:opacity-60',
              'caret-[var(--q-accent)]'
            )}
          />
          <div className="absolute bottom-2 right-2 flex items-center gap-2">
            <span className="text-2xs text-q-text-ghost">⌘↵</span>
            <motion.button
              onClick={handleSubmit}
              disabled={!prompt.trim() || isStreaming}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded-md',
                'text-2xs font-semibold transition-all duration-150 cursor-pointer',
                'disabled:cursor-not-allowed',
                prompt.trim() && !isStreaming
                  ? 'bg-[var(--q-accent)] text-white hover:bg-[var(--q-accent-hover)]'
                  : 'bg-q-overlay text-q-text-ghost'
              )}
            >
              {isStreaming ? (
                <>
                  <Loader2 size={10} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Send size={10} />
                  Generate
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── Suggestions — hidden once generation starts ─────────────────── */}
      {state === 'idle' && (
        <div>
          <p className="text-2xs font-semibold uppercase tracking-widest text-q-text-faint mb-2">
            Try these
          </p>
          <div className="flex flex-col gap-1.5">
            {PROMPT_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setPrompt(suggestion)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md text-left',
                  'bg-q-elevated border border-q-border text-xs text-q-text-muted',
                  'hover:text-q-text hover:border-[var(--q-accent-border)]',
                  'transition-all duration-150 cursor-pointer group'
                )}
              >
                <Code2 size={11} className="text-q-text-faint group-hover:text-[var(--q-accent)]
                  transition-colors flex-shrink-0" />
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Streaming / Result output ─────────────────────────────────── */}
      <AnimatePresence>
        {(isStreaming || isComplete) && streamedCode && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col rounded-lg border border-q-border
              bg-q-void overflow-hidden"
          >
            <div className="flex items-center justify-between px-3 py-2
              border-b border-q-border bg-q-surface">
              <div className="flex items-center gap-1.5">
                {isStreaming ? (
                  <Loader2 size={11} className="text-[var(--q-accent)] animate-spin" />
                ) : (
                  <Check size={11} className="text-emerald-400" />
                )}
                <span className="text-2xs font-medium text-q-text-faint">
                  {isStreaming ? 'Generating...' : 'Generated code'}
                </span>
              </div>

              {isComplete && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePreview}
                    className="flex items-center gap-1 px-2 py-0.5 rounded text-2xs
                      font-semibold border border-[var(--q-accent-border)]
                      bg-[var(--q-accent-subtle)] text-[var(--q-accent)]
                      hover:bg-[var(--q-accent)] hover:text-white
                      cursor-pointer transition-all"
                  >
                    <Eye size={10} />
                    Preview
                  </button>
                  <button
                    onClick={handleCopy}
                    className={cn(
                      'flex items-center gap-1 px-2 py-0.5 rounded text-2xs font-semibold',
                      'border transition-all cursor-pointer',
                      copied
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-q-elevated border-q-border text-q-text-muted hover:text-q-text'
                    )}
                  >
                    {copied ? <><Check size={10} />Copied</> : <><Copy size={10} />Copy</>}
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1 px-2 py-0.5 rounded text-2xs
                      font-semibold border border-q-border text-q-text-muted
                      hover:text-q-text cursor-pointer transition-all"
                  >
                    <RotateCcw size={10} />
                    New
                  </button>
                </div>
              )}
            </div>

            <div className="overflow-x-auto overflow-y-auto max-h-[320px]">
              <pre className="p-3 text-2xs font-mono text-gray-300 leading-relaxed
                whitespace-pre min-w-0">
                <code>{streamedCode}</code>
                {isStreaming && (
                  <span className="inline-block w-1.5 h-3 bg-[var(--q-accent)]
                    ml-0.5 animate-pulse" />
                )}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Error state ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isError && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-2 p-3 rounded-lg border border-red-500/20 bg-red-500/10"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-red-400 flex-shrink-0" />
              <p className="text-xs font-semibold text-red-400">Generation failed</p>
            </div>
            <p className="text-2xs text-q-text-muted leading-relaxed">{errorMessage}</p>
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-1.5 py-2 rounded-md
                text-2xs font-semibold bg-red-500/20 text-red-300
                hover:bg-red-500/30 cursor-pointer transition-all w-fit px-3"
            >
              <RotateCcw size={11} />
              Try again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </ContentContainer>
  );
});