import { memo } from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  Layout,
  Sparkles,
  ArrowRight,
  Zap,
  Star,
  Clock,
} from 'lucide-react';
import { ContentContainer } from '../components/ContentContainer';
import { SectionTitle } from '../components/SectionTitle';
import { useNavigation } from '../hooks/useNavigation';
import { useFavoritesStore } from '../store/favoritesStore';
import { useRecentStore } from '../store/recentStore';
import { useLibraryStore } from '../store/libraryStore';
import { CATEGORIES, TOTAL_ASSET_COUNT } from '../features/Components/data';
import { LIBRARIES } from '../features/libraries/data';
import { LibraryGrid } from '../features/libraries/LibraryGrid';
import { LibraryDetailView } from '../features/libraries/LibraryDetailView';
import { STAGGER_CONTAINER_VARIANTS, STAGGER_ITEM_VARIANTS } from '../constants';
import type { NavPage } from '../types';
import { cn } from '../utils';

// ─── Quick access card ────────────────────────────────────────────────────────

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
        'bg-q-elevated border border-q-border cursor-pointer',
        'hover:border-[var(--q-accent-border)] transition-colors duration-150'
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
          transition-colors leading-tight">
          {label}
        </p>
        <p className="text-2xs text-q-text-faint mt-0.5 leading-snug">{sub}</p>
      </div>
    </motion.button>
  );
}

// ─── Stat chip ────────────────────────────────────────────────────────────────

function StatChip({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg
      bg-q-elevated border border-q-border flex-1">
      <span className="text-sm font-bold text-gradient">{value}</span>
      <span className="text-2xs text-q-text-faint">{label}</span>
    </div>
  );
}

// ─── Category preview row ─────────────────────────────────────────────────────

interface CategoryPreviewRowProps {
  icon: React.ReactNode;
  name: string;
  count: number;
  onClick: () => void;
}

function CategoryPreviewRow({
  icon,
  name,
  count,
  onClick,
}: CategoryPreviewRowProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 500, damping: 40 }}
      className={cn(
        'group flex items-center gap-2.5 w-full px-3 py-2 rounded-md',
        'bg-q-elevated border border-q-border cursor-pointer',
        'hover:border-[var(--q-accent-border)] transition-all duration-150'
      )}
    >
      <div className="flex-shrink-0 w-6 h-6 rounded-md flex items-center
        justify-center bg-[var(--q-accent-subtle)] text-[var(--q-accent)]">
        {icon}
      </div>
      <span className="flex-1 text-left text-xs font-medium text-q-text-muted
        group-hover:text-q-text transition-colors truncate">
        {name}
      </span>
      <span className="flex-shrink-0 text-2xs font-semibold text-q-text-faint
        bg-q-overlay px-1.5 py-0.5 rounded-full">
        {count}
      </span>
      <ArrowRight
        size={10}
        className="flex-shrink-0 text-q-text-ghost
          group-hover:text-q-text-faint transition-colors"
        aria-hidden="true"
      />
    </motion.button>
  );
}

// ─── Main HomePage ────────────────────────────────────────────────────────────

/**
 * HomePage — landing dashboard for Quantum UI.
 *
 * Shows:
 * - Welcome banner
 * - Live stats (real asset count from registry)
 * - Quick access cards to main pages
 * - Top 3 categories with live counts
 * - Favorites and recent count summary
 * - Getting started steps
 */
export const HomePage = memo(function HomePage() {
  const { navigate } = useNavigation();
  const { getFavoriteCount } = useFavoritesStore();
  const { getRecentCount } = useRecentStore();
  const { activeLibrary } = useLibraryStore();

  const favoriteCount = getFavoriteCount();
  const recentCount = getRecentCount();

  // If a library is selected, show its detail view instead of the dashboard
  if (activeLibrary) {
    return (
      <ContentContainer>
        <LibraryDetailView />
      </ContentContainer>
    );
  }

  return (
    <ContentContainer>

      {/* ── Welcome banner ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="relative overflow-hidden rounded-lg p-3 border border-q-border"
        style={{
          background:
            'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(34,188,255,0.06) 100%)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {/* Background glow */}
        <div
          aria-hidden="true"
          className="absolute -top-6 -right-6 w-20 h-20 rounded-full
            opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }}
        />

        <div className="flex items-center gap-2 mb-1.5">
          <Zap
            size={12}
            className="text-[var(--q-accent)]"
            aria-hidden="true"
            style={{ filter: 'drop-shadow(0 0 4px var(--q-accent-glow))' }}
          />
          <span className="text-2xs font-bold uppercase tracking-widest
            text-[var(--q-accent)]">
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

      {/* ── Live stats row ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="flex gap-2"
      >
        <StatChip value={String(TOTAL_ASSET_COUNT)} label="Assets" />
        <StatChip value={String(CATEGORIES.length)} label="Categories" />
        <StatChip
          value={favoriteCount > 0 ? String(favoriteCount) : '—'}
          label="Favorites"
        />
      </motion.div>

{/* ── Library grid ────────────────────────────────────────────────────── */}
      <div>
        <SectionTitle
          title="UI Libraries"
          subtitle={`${LIBRARIES.length} libraries available`}
          className="mb-2"
        />
        <LibraryGrid />
      </div>

      {/* ── Quick access ────────────────────────────────────────────────────── */}
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
            sub={`${TOTAL_ASSET_COUNT} assets`}
            gradient="linear-gradient(135deg, #8b5cf6, #6366f1)"
            onClick={() => navigate('components' as NavPage)}
          />
          <QuickCard
            icon={<Layout size={14} className="text-white" />}
            label="Templates"
            sub="Full page layouts"
            gradient="linear-gradient(135deg, #22bcff, #0ea5e9)"
            onClick={() => navigate('templates' as NavPage)}
          />
          <QuickCard
            icon={<Sparkles size={14} className="text-white" />}
            label="AI Studio"
            sub="Generate with AI"
            gradient="linear-gradient(135deg, #06d6d6, #8b5cf6)"
            onClick={() => navigate('ai-studio' as NavPage)}
          />
          <QuickCard
            icon={<Star size={14} className="text-white" />}
            label="Favorites"
            sub={
              favoriteCount > 0
                ? `${favoriteCount} saved`
                : 'None saved yet'
            }
            gradient="linear-gradient(135deg, #f59e0b, #ef4444)"
            onClick={() => navigate('favorites' as NavPage)}
          />
        </motion.div>
      </div>

      {/* ── Activity row ────────────────────────────────────────────────────── */}
      {(favoriteCount > 0 || recentCount > 0) && (
        <div>
          <SectionTitle title="Your Activity" className="mb-2" />
          <div className="grid grid-cols-2 gap-2">
            {favoriteCount > 0 && (
              <motion.button
                onClick={() => navigate('favorites' as NavPage)}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                className="flex flex-col items-center gap-1 p-3 rounded-lg
                  bg-q-elevated border border-q-border cursor-pointer
                  hover:border-amber-500/30 transition-all duration-150"
              >
                <Star
                  size={16}
                  className="text-amber-400 fill-amber-400"
                  aria-hidden="true"
                />
                <span className="text-sm font-bold text-q-text">
                  {favoriteCount}
                </span>
                <span className="text-2xs text-q-text-faint">Favorites</span>
              </motion.button>
            )}
            {recentCount > 0 && (
              <motion.button
                onClick={() => navigate('history' as NavPage)}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                className="flex flex-col items-center gap-1 p-3 rounded-lg
                  bg-q-elevated border border-q-border cursor-pointer
                  hover:border-[var(--q-accent-border)] transition-all duration-150"
              >
                <Clock
                  size={16}
                  className="text-[var(--q-accent)]"
                  aria-hidden="true"
                />
                <span className="text-sm font-bold text-q-text">
                  {recentCount}
                </span>
                <span className="text-2xs text-q-text-faint">Recent</span>
              </motion.button>
            )}
          </div>
        </div>
      )}

      {/* ── Getting started ─────────────────────────────────────────────────── */}
      <div>
        <SectionTitle title="Getting Started" className="mb-2" />
        <div className="flex flex-col gap-1.5">
          {[
            { step: '01', text: 'Browse categories in Components' },
            { step: '02', text: 'Click any asset to preview it' },
            { step: '03', text: 'Copy the code into your project' },
          ].map(({ step, text }) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: Number(step) * 0.06 }}
              className="flex items-center gap-2.5 px-3 py-2 rounded-md
                bg-q-elevated border border-q-border"
            >
              <span className="text-2xs font-bold text-[var(--q-accent)]
                font-mono flex-shrink-0 opacity-70">
                {step}
              </span>
              <span className="text-xs text-q-text-muted">{text}</span>
              <ArrowRight
                size={10}
                className="ml-auto text-q-text-ghost flex-shrink-0"
                aria-hidden="true"
              />
            </motion.div>
          ))}
        </div>
      </div>

    </ContentContainer>
  );
});