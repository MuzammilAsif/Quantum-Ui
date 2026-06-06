import { memo } from 'react';
import { motion } from 'framer-motion';
import { Settings, Palette, Zap } from 'lucide-react';
import { ContentContainer } from '../components/ContentContainer';
import { SectionTitle } from '../components/SectionTitle';
import { ThemeToggle } from '../components/ThemeToggle';
import { useTheme } from '../hooks/useTheme';
import { ACCENT_COLORS } from '../constants';
import { cn } from '../utils';
import type { AccentColor } from '../types';

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