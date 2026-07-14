import { memo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Palette, Zap, Key, Check, Trash2, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { ContentContainer } from '../components/ContentContainer';
import { SectionTitle } from '../components/SectionTitle';
import { ThemeToggle } from '../components/ThemeToggle';
import { useTheme } from '../hooks/useTheme';
import { useVSCode, useVSCodeMessage } from '../hooks/useVSCode';
import { useToast } from '../hooks/useToast';
import { ACCENT_COLORS } from '../constants';
import { cn, generateId } from '../utils';
import { MessageType } from '../types';
import type { AccentColor, WebviewMessage } from '../types';

function SettingRow({ label, description, children }: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 px-3 rounded-md
      bg-q-elevated border border-q-border">
      <div className="min-w-0">
        <p className="text-xs font-medium text-q-text">{label}</p>
        {description && (
          <p className="text-2xs text-q-text-faint mt-0.5 leading-snug">{description}</p>
        )}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

/**
 * SettingsPage — extension preferences and configuration.
 */
export const SettingsPage = memo(function SettingsPage() {
  const { accentColor, animationsEnabled, changeAccentColor, setAnimationsEnabled } = useTheme();
  const { postMessage } = useVSCode();
  const { success, error: toastError } = useToast();

  const [apiKeyInput, setApiKeyInput] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [maskedKey, setMaskedKey] = useState<string | undefined>(undefined);
  const [showInput, setShowInput] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Request current key status on mount
  useEffect(() => {
    postMessage({ type: MessageType.GET_API_KEY_STATUS });
  }, [postMessage]);

  // Listen for key status updates from the extension
  useVSCodeMessage<WebviewMessage>(MessageType.API_KEY_STATUS, (message) => {
    const payload = (message as WebviewMessage & {
      payload?: { hasKey: boolean; maskedKey?: string };
    }).payload;

    if (payload) {
      setHasKey(payload.hasKey);
      setMaskedKey(payload.maskedKey);
      setIsSaving(false);
      if (payload.hasKey) {
        setShowInput(false);
        setApiKeyInput('');
      }
    }
  });

  const handleSaveKey = () => {
    const trimmed = apiKeyInput.trim();
    if (!trimmed) {
      toastError('Please enter an API key');
      return;
    }
    if (!trimmed.startsWith('sk-')) {
      toastError('OpenAI keys start with "sk-"');
      return;
    }

    setIsSaving(true);
    postMessage({
      type: MessageType.SET_API_KEY,
      payload: { apiKey: trimmed },
    } as never);
    success('API key saved securely');
  };

  const handleClearKey = () => {
    postMessage({ type: MessageType.CLEAR_API_KEY });
    setHasKey(false);
    setMaskedKey(undefined);
  };

  return (
    <ContentContainer>
      <div className="flex items-center gap-2">
        <Settings size={14} className="text-q-text-muted" />
        <SectionTitle title="Settings" />
      </div>

      {/* ── Appearance ─────────────────────────────── */}
      <div>
        <SectionTitle title="Appearance" size="sm" className="mb-2 px-1" />
        <div className="flex flex-col gap-1.5">

          <SettingRow label="Theme" description="Toggle dark or light mode">
            <ThemeToggle size="md" />
          </SettingRow>

          <div className="px-3 py-2.5 rounded-md bg-q-elevated border border-q-border">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Palette size={11} className="text-q-text-faint" />
              <p className="text-xs font-medium text-q-text">Accent Color</p>
            </div>
            <div className="flex gap-2">
              {(Object.keys(ACCENT_COLORS) as AccentColor[]).map((color) => (
                <motion.button
                  key={color}
                  onClick={() => changeAccentColor(color)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Set accent to ${color}`}
                  aria-pressed={accentColor === color}
                  className={cn(
                    'w-6 h-6 rounded-full cursor-pointer transition-all duration-150',
                    accentColor === color && 'ring-2 ring-white ring-offset-2 ring-offset-q-elevated'
                  )}
                  style={{ background: ACCENT_COLORS[color].primary }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Performance ─────────────────────────────── */}
      <div>
        <SectionTitle title="Performance" size="sm" className="mb-2 px-1" />
        <div className="flex flex-col gap-1.5">
          <SettingRow
            label="Animations"
            description="Smooth transitions and motion effects"
          >
            <button
              role="switch"
              aria-checked={animationsEnabled}
              onClick={() => setAnimationsEnabled(!animationsEnabled)}
              className={cn(
                'relative w-9 h-5 rounded-full cursor-pointer transition-colors duration-200',
                animationsEnabled ? 'bg-[var(--q-accent)]' : 'bg-q-overlay border border-q-border'
              )}
            >
              <motion.span
                animate={{ x: animationsEnabled ? 18 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
              />
            </button>
          </SettingRow>
        </div>
      </div>
      {/* ── AI Provider ─────────────────────────────────────── */}
      <div>
        <SectionTitle title="AI Provider" size="sm" className="mb-2 px-1" />

        <div className="flex flex-col gap-1.5">
          <div className="px-3 py-3 rounded-md bg-q-elevated border border-q-border">

            <div className="flex items-center gap-1.5 mb-2.5">
              <Key size={11} className="text-q-text-faint" />
              <p className="text-xs font-medium text-q-text">OpenAI API Key</p>
              {hasKey && (
                <span className="flex items-center gap-1 ml-auto text-2xs
                  text-emerald-400 bg-emerald-500/10 border border-emerald-500/20
                  px-1.5 py-0.5 rounded-full">
                  <Check size={9} />
                  Connected
                </span>
              )}
            </div>

            {hasKey && !showInput ? (
              <div className="flex items-center justify-between gap-2">
                <span className="text-2xs font-mono text-q-text-muted">
                  {maskedKey}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowInput(true)}
                    className="text-2xs text-[var(--q-accent)] hover:underline
                      cursor-pointer"
                  >
                    Change
                  </button>
                  <button
                    onClick={handleClearKey}
                    aria-label="Remove API key"
                    className="text-q-text-faint hover:text-red-400
                      cursor-pointer transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="relative">
                  <input
                    type={showInput ? 'text' : 'password'}
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="sk-..."
                    className="w-full px-3 py-2 pr-8 rounded-md
                      border border-q-border bg-q-surface
                      text-xs text-q-text placeholder:text-q-text-faint
                      outline-none focus:border-[var(--q-accent-border)]
                      font-mono"
                  />
                  <button
                    onClick={() => setShowInput((prev) => !prev)}
                    aria-label={showInput ? 'Hide key' : 'Show key'}
                    className="absolute right-2 top-1/2 -translate-y-1/2
                      text-q-text-faint hover:text-q-text cursor-pointer"
                  >
                    {showInput ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                </div>

                <button
                  onClick={handleSaveKey}
                  disabled={isSaving}
                  className="w-full py-2 rounded-md text-2xs font-semibold
                    bg-[var(--q-accent)] text-white hover:bg-[var(--q-accent-hover)]
                    disabled:opacity-50 cursor-pointer transition-all"
                >
                  {isSaving ? 'Saving...' : 'Save API Key'}
                </button>
              </div>
            )}

            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 mt-2.5 text-2xs
                text-q-text-faint hover:text-[var(--q-accent)]
                transition-colors"
            >
              <ExternalLink size={9} />
              Get your API key from OpenAI
            </a>
          </div>
        </div>
      </div>

      {/* ── About ─────────────────────────────────── */}
      <div>
        
        <SectionTitle title="About" size="sm" className="mb-2 px-1" />
        <div className="px-3 py-3 rounded-md bg-q-elevated border border-q-border
          flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #22bcff)' }}
          >
            <Zap size={14} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-q-text">Quantum UI</p>
            <p className="text-2xs text-q-text-faint">v0.1.0 — Foundation Release</p>
          </div>
        </div>
      </div>
    </ContentContainer>
  );
});