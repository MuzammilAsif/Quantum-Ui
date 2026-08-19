import { memo, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Zap, Layers, Sparkles, Star, LayoutDashboard,
  MousePointerClick, TextCursorInput, Type,
  ExternalLink, type LucideIcon,
} from 'lucide-react';
import { useLibraryStore } from '../../store/libraryStore';
import { getLibraryById, getCategoriesForLibrary } from './data';
import { getAssetsByLibrary } from '../components/data';
import { ComponentCard } from '../components/ComponentCard';
import { EmptyState } from '../../components/EmptyState';
import { cn } from '../../utils';

const ICON_MAP: Record<string, LucideIcon> = {
  Zap, Layers, Sparkles, Star, LayoutDashboard,
  MousePointerClick, TextCursorInput, Type,
};

/**
 * LibraryDetailView — shown when a library tile is clicked.
 *
 * Layout:
 * ┌─────────────────────────────┐
 * │ ← Back    Library Name  ↗   │
 * ├─────────────────────────────┤
 * │ All | Buttons | Cards | ... │  ← category tabs
 * ├─────────────────────────────┤
 * │ Component grid               │
 * └─────────────────────────────┘
 */
export const LibraryDetailView = memo(function LibraryDetailView() {
  const { activeLibrary, goBackToLibraries } = useLibraryStore();

  const [localCategory, setLocalCategory] = useState<string | 'all'>('all');

  const library = activeLibrary ? getLibraryById(activeLibrary) : undefined;
  const categories = activeLibrary ? getCategoriesForLibrary(activeLibrary) : [];

  const libraryAssets = useMemo(() => {
    if (!activeLibrary) return [];

    const assets = getAssetsByLibrary(activeLibrary);

    return localCategory === 'all'
      ? assets
      : assets.filter((a) => a.category === localCategory);
  }, [activeLibrary, localCategory]);

  if (!library) return null;

  const Icon = ICON_MAP[library.icon] ?? Layers;

  return (
    <div className="flex flex-col gap-3">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <button
          onClick={goBackToLibraries}
          aria-label="Back to libraries"
          className="flex items-center justify-center w-7 h-7 rounded-md
            text-q-text-faint hover:text-q-text hover:bg-q-elevated
            cursor-pointer transition-colors duration-150 flex-shrink-0"
        >
          <ArrowLeft size={14} aria-hidden="true" />
        </button>

        <div
          className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden"
          style={{ background: `${library.color}20`, border: `1px solid ${library.color}40` }}
        >
          {library.logoUrl ? (
            <img src={library.logoUrl} alt={`${library.name} logo`} className="w-4 h-4 object-contain" />
          ) : (
            <Icon size={13} style={{ color: library.color }} aria-hidden="true" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-q-text truncate">{library.name}</p>
          <p className="text-2xs text-q-text-faint truncate">{library.description}</p>
        </div>

        
          <a href={library.website}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit ${library.name} website`}
          className="flex items-center justify-center w-7 h-7 rounded-md
            text-q-text-faint hover:text-q-text hover:bg-q-elevated
            cursor-pointer transition-colors duration-150 flex-shrink-0"
        >
          <ExternalLink size={12} aria-hidden="true" />
        </a>
      </div>

      {/* ── Category tabs ──────────────────────────────────────────────── */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
        <button
          onClick={() => setLocalCategory('all')}
          className={cn(
            'flex-shrink-0 px-2.5 py-1 rounded-full text-2xs font-medium cursor-pointer transition-all',
            localCategory === 'all'
              ? 'bg-[var(--q-accent)] text-white'
              : 'bg-q-elevated border border-q-border text-q-text-muted hover:text-q-text'
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setLocalCategory(cat.slug)}
            className={cn(
              'flex-shrink-0 px-2.5 py-1 rounded-full text-2xs font-medium cursor-pointer transition-all',
              localCategory === cat.slug
                ? 'bg-[var(--q-accent)] text-white'
                : 'bg-q-elevated border border-q-border text-q-text-muted hover:text-q-text'
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* ── Component grid ─────────────────────────────────────────────── */}
      {libraryAssets.length === 0 ? (
        <EmptyState
          icon={<Icon size={20} />}
          title={`No ${library.name} components in this category`}
          description="Try a different category tab, or select All to see everything available."
        />
      ) : (
        <motion.div layout className="grid grid-cols-1 gap-2">
          {libraryAssets.map((asset) => (
            <ComponentCard key={asset.id} asset={asset} />
          ))}
        </motion.div>
      )}
    </div>
  );
});