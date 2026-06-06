import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send, Code2 } from 'lucide-react';
import { ContentContainer } from '../components/ContentContainer';
import { SectionTitle } from '../components/SectionTitle';
import { cn } from '../utils';

const PROMPT_SUGGESTIONS = [
  'A pricing card with 3 tiers',
  'A dark mode toggle button',
  'A responsive navigation bar',
  'A stats dashboard widget',
];

/**
 * AIStudioPage — AI-powered UI generation interface.
 * Phase 1: UI shell with prompt input infrastructure.
 * Phase 2: wire to aiService streaming API.
 */
export const AIStudioPage = memo(function AIStudioPage() {
  const [prompt, setPrompt] = useState('');
  const [framework, setFramework] = useState<'react' | 'vue' | 'html'>('react');

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    // TODO Phase 2: call aiService.streamGenerate(prompt, framework, callbacks)
  };

  return (
    <ContentContainer>
      {/* Header */}
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

      {/* Framework selector */}
      <div>
        <p className="text-2xs font-semibold uppercase tracking-widest text-q-text-faint mb-2">
          Framework
        </p>
        <div className="flex gap-1.5">
          {(['react', 'vue', 'html'] as const).map((fw) => (
            <button
              key={fw}
              onClick={() => setFramework(fw)}
              className={cn(
                'px-3 py-1 rounded-md text-xs font-medium cursor-pointer',
                'transition-all duration-150 select-none capitalize',
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

      {/* Prompt input */}
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
            placeholder="A responsive card component with an image, title, description, and CTA button…"
            rows={4}
            className={cn(
              'w-full bg-transparent resize-none outline-none',
              'text-xs text-q-text placeholder:text-q-text-faint',
              'px-3 pt-3 pb-8 leading-relaxed',
              'caret-[var(--q-accent)]'
            )}
          />
          {/* Submit button */}
          <div className="absolute bottom-2 right-2 flex items-center gap-2">
            <span className="text-2xs text-q-text-ghost">⌘↵</span>
            <motion.button
              onClick={handleSubmit}
              disabled={!prompt.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded-md',
                'text-2xs font-semibold transition-all duration-150 cursor-pointer',
                prompt.trim()
                  ? 'bg-[var(--q-accent)] text-white hover:bg-[var(--q-accent-hover)]'
                  : 'bg-q-overlay text-q-text-ghost cursor-not-allowed'
              )}
            >
              <Send size={10} />
              Generate
            </motion.button>
          </div>
        </div>
      </div>

      {/* Suggestion pills */}
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
    </ContentContainer>
  );
});