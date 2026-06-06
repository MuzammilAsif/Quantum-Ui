import { memo } from 'react';
import { motion } from 'framer-motion';
import { Layers, Layout, Sparkles, ArrowRight, Zap, Star } from 'lucide-react';
import { ContentContainer } from '../components/ContentContainer';
import { SectionTitle } from '../components/SectionTitle';
import { useNavigation } from '../hooks/useNavigation';
import { STAGGER_CONTAINER_VARIANTS, STAGGER_ITEM_VARIANTS } from '../constants';
import { cn } from '../utils';

// ── Quick access card ──────────────────────────────────────────────────────
interface QuickCardProps {
  icon: React.ReactNode;
  label: string;
  sub: string;
  gradient: string;
  onClick: () => void;
}

function QuickCard({ icon, label, sub, gradient, onClick }: QuickCardProps) {
  return (
    <motion.button
      variants={STAGGER_ITEM_VARIANTS}
      onClick={onClick}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
      className={cn(
        'group flex flex-col items-start gap-2 p-3 rounded-lg w-full text-left',
        'bg-q-elevated border border-q-border',
        'hover:border-[var(--q-accent-border)] transition-colors duration-150',
        'cursor-pointer'
      )}
      style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)' }}
    >
      <div
        className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
        style={{ background: gradient, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-q-text group-hover:text-white
          transition-colors leading-tight">{label}</p>
        <p className="text-2xs text-q-text-faint mt-0.5 leading-snug">{sub}</p>
      </div>
    </motion.button>
  );
}

// ── Stat chip ──────────────────────────────────────────────────────────────
function StatChip({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg
      bg-q-elevated border border-q-border flex-1">
      <span className="text-sm font-bold text-gradient">{value}</span>
      <span className="text-2xs text-q-text-faint">{label}</span>
    </div>
  );
}

/**
 * HomePage — landing dashboard for Quantum UI.
 * Shows quick-access cards, placeholder stats, and a getting-started nudge.
 */
export const HomePage = memo(function HomePage() {
  const { navigate } = useNavigation();

  return (
    <ContentContainer>
      {/* ── Welcome banner ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="relative overflow-hidden rounded-lg p-3 border border-q-border"
        style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(34,188,255,0.06) 100%)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {/* Background glow */}
        <div
          aria-hidden="true"
          className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }}
        />

        <div className="flex items-center gap-2 mb-1.5">
          <Zap size={12} className="text-[var(--q-accent)]" aria-hidden="true"
            style={{ filter: 'drop-shadow(0 0 4px var(--q-accent-glow))' }}
          />
          <span className="text-2xs font-bold uppercase tracking-widest text-[var(--q-accent)]">
            Welcome
          </span>
        </div>
        <h1 className="text-sm font-bold text-q-text leading-snug mb-0.5">
          Quantum UI
        </h1>
        <p className="text-2xs text-q-text-muted leading-relaxed">
          Your AI-powered component system. Browse, generate, and insert UI instantly.
        </p>
      </motion.div>

      {/* ── Stats row ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="flex gap-2"
      >
        <StatChip value="500+" label="Components" />
        <StatChip value="80+"  label="Templates" />
        <StatChip value="AI"   label="Powered" />
      </motion.div>

      {/* ── Quick access ──────────────────────────── */}
      <div>
        <SectionTitle title="Quick Access" className="mb-2" />
        <motion.div
          variants={STAGGER_CONTAINER_VARIANTS}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-2"
        >
          <QuickCard
            icon={<Layers size={14} className="text-white" />}
            label="Components"
            sub="Browse UI library"
            gradient="linear-gradient(135deg, #8b5cf6, #6366f1)"
            onClick={() => navigate('components')}
          />
          <QuickCard
            icon={<Layout size={14} className="text-white" />}
            label="Templates"
            sub="Full page layouts"
            gradient="linear-gradient(135deg, #22bcff, #0ea5e9)"
            onClick={() => navigate('templates')}
          />
          <QuickCard
            icon={<Sparkles size={14} className="text-white" />}
            label="AI Studio"
            sub="Generate with AI"
            gradient="linear-gradient(135deg, #06d6d6, #8b5cf6)"
            onClick={() => navigate('ai-studio')}
          />
          <QuickCard
            icon={<Star size={14} className="text-white" />}
            label="Favorites"
            sub="Saved items"
            gradient="linear-gradient(135deg, #f59e0b, #ef4444)"
            onClick={() => navigate('favorites')}
          />
        </motion.div>
      </div>

      {/* ── Getting started ───────────────────────── */}
      <div>
        <SectionTitle title="Getting Started" className="mb-2" />
        <div className="flex flex-col gap-1.5">
          {[
            { step: '01', text: 'Browse components or templates' },
            { step: '02', text: 'Click to copy or insert into editor' },
            { step: '03', text: 'Use AI Studio to generate custom UI' },
          ].map(({ step, text }) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: Number(step) * 0.06 }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-md
                bg-q-elevated border border-q-border"
            >
              <span className="text-2xs font-bold text-[var(--q-accent)] font-mono
                flex-shrink-0 opacity-70">
                {step}
              </span>
              <span className="text-xs text-q-text-muted">{text}</span>
              <ArrowRight size={10} className="ml-auto text-q-text-ghost flex-shrink-0" />
            </motion.div>
          ))}
        </div>
      </div>
    </ContentContainer>
  );
});