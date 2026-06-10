import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trash2, Heart } from 'lucide-react';
import { ContentContainer } from '../components/ContentContainer';
import { SectionTitle } from '../components/SectionTitle';
import { IconButton } from '../components/IconButton';
import { ComponentCard } from '../features/Components/ComponentCard';
import { PreviewPanel } from '../features/Components/PreviewPanel';
import { useFavoritesStore } from '../store/favoritesStore';
import { useAssetStore } from '../store/assetStore';

// ─── Empty state ──────────────────────────────────────────────────────────────

function FavoritesEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center text-center py-12 gap-4"
    >
      {/* Icon */}
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-q-elevated border border-q-border
          flex items-center justify-center">
          <Star
            size={22}
            className="text-q-text-faint"
            aria-hidden="true"
          />
        </div>
        {/* Small heart decoration */}
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full
          bg-amber-500/10 border border-amber-500/20
          flex items-center justify-center">
          <Heart
            size={9}
            className="text-amber-400 fill-amber-400"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Text */}
      <div className="space-y-1.5 max-w-[200px]">
        <p className="text-sm font-semibold text-q-text-muted">
          No favorites yet
        </p>
        <p className="text-2xs text-q-text-faint leading-relaxed">
          Click the star icon on any component to save it here for quick access
        </p>
      </div>

      {/* Hint */}
      <div className="flex items-center gap-1.5 px-3 py-2 rounded-md
        bg-q-elevated border border-q-border">
        <Star
          size={11}
          className="text-amber-400 fill-amber-400 flex-shrink-0"
          aria-hidden="true"
        />
        <span className="text-2xs text-q-text-faint">
          Star any asset to save it here
        </span>
      </div>
    </motion.div>
  );
}

// ─── Main FavoritesPage ───────────────────────────────────────────────────────

/**
 * FavoritesPage — shows all assets the user has starred.
 *
 * Features:
 * - Live count in header
 * - Full ComponentCard for each favorited asset
 * - Clear all button
 * - PreviewPanel overlay
 * - Polished empty state when no favorites exist
 */
export const FavoritesPage = memo(function FavoritesPage() {
  const { getFavoriteAssets, getFavoriteCount, clearFavorites } = useFavoritesStore();
  const { isPreviewOpen } = useAssetStore();

  const favoriteAssets = getFavoriteAssets();
  const count = getFavoriteCount();
  const isEmpty = count === 0;

  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      <ContentContainer className="flex-1 overflow-y-auto">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <SectionTitle
          title="Favorites"
          subtitle={isEmpty ? 'No saved assets yet' : `${count} saved asset${count !== 1 ? 's' : ''}`}
          action={
            !isEmpty ? (
              <IconButton
                icon={<Trash2 size={11} />}
                label="Clear all favorites"
                size="sm"
                variant="ghost"
                onClick={clearFavorites}
              />
            ) : undefined
          }
        />

        {/* ── Content ────────────────────────────────────────────────────── */}
        {isEmpty ? (
          <FavoritesEmptyState />
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 gap-2"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {favoriteAssets.map((asset, index) => (
                <motion.div
                  key={asset.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.2,
                      delay: index < 10 ? index * 0.04 : 0,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.96,
                    transition: { duration: 0.15 },
                  }}
                >
                  <ComponentCard asset={asset} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </ContentContainer>

      {/* ── Preview panel overlay ─────────────────────────────────────────── */}
      {isPreviewOpen && <PreviewPanel />}

    </div>
  );
});