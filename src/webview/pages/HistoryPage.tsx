import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, History } from 'lucide-react';
import { ContentContainer } from '../components/ContentContainer';
import { SectionTitle } from '../components/SectionTitle';
import { IconButton } from '../components/IconButton';
import { ComponentCard } from '../features/Components/ComponentCard';
import { useRecentStore } from '../store/recentStore';
import { formatRelativeTime } from '../utils';

// ─── Empty state ──────────────────────────────────────────────────────────────

function HistoryEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center text-center py-12 gap-4"
    >
      {/* Icon */}
      <div className="w-14 h-14 rounded-2xl bg-q-elevated border border-q-border
        flex items-center justify-center">
        <History
          size={22}
          className="text-q-text-faint"
          aria-hidden="true"
        />
      </div>

      {/* Text */}
      <div className="space-y-1.5 max-w-[200px]">
        <p className="text-sm font-semibold text-q-text-muted">
          No history yet
        </p>
        <p className="text-2xs text-q-text-faint leading-relaxed">
          Assets you view will appear here for quick access
        </p>
      </div>

      {/* Hint */}
      <div className="flex items-center gap-1.5 px-3 py-2 rounded-md
        bg-q-elevated border border-q-border">
        <Clock
          size={11}
          className="text-q-text-faint flex-shrink-0"
          aria-hidden="true"
        />
        <span className="text-2xs text-q-text-faint">
          Click any asset to start your history
        </span>
      </div>
    </motion.div>
  );
}

// ─── Timestamp badge ──────────────────────────────────────────────────────────

function TimestampBadge({ timestamp }: { timestamp: number }) {
  return (
    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full
      bg-q-elevated border border-q-border w-fit">
      <Clock
        size={9}
        className="text-q-text-ghost flex-shrink-0"
        aria-hidden="true"
      />
      <span className="text-2xs text-q-text-ghost">
        {formatRelativeTime(timestamp)}
      </span>
    </div>
  );
}

// ─── Main HistoryPage ─────────────────────────────────────────────────────────

/**
 * HistoryPage — shows the 20 most recently viewed assets.
 *
 * Features:
 * - Live count in header
 * - Full ComponentCard for each recent asset
 * - Relative timestamp shown above each card
 * - Clear all button
 * - PreviewPanel overlay
 * - Polished empty state when no history exists
 */
export const HistoryPage = memo(function HistoryPage() {
  const { recentItems, getRecentAssets, getRecentCount, clearRecent } =
    useRecentStore();
  const recentAssets = getRecentAssets();
  const count = getRecentCount();
  const isEmpty = count === 0;

  return (
    <ContentContainer className="flex-1 overflow-y-auto">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <SectionTitle
        title="Recently Viewed"
        subtitle={
          isEmpty
            ? 'No recent activity'
            : `${count} recent asset${count !== 1 ? 's' : ''}`
        }
        action={
          !isEmpty ? (
            <IconButton
              icon={<Trash2 size={11} />}
              label="Clear history"
              size="sm"
              variant="ghost"
              onClick={clearRecent}
            />
          ) : undefined
        }
      />

      {/* ── Content ────────────────────────────────────────────────────── */}
      {isEmpty ? (
        <HistoryEmptyState />
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 gap-3"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {recentAssets.map((asset, index) => {
              // Get the timestamp for this asset from recentItems
              const recentItem = recentItems.find(
                (item) => item.assetId === asset.id
              );
              const timestamp = recentItem?.viewedAt ?? Date.now();

              return (
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
                  className="flex flex-col gap-1.5"
                >
                  {/* Timestamp above each card */}
                  <TimestampBadge timestamp={timestamp} />

                  {/* Asset card */}
                  <ComponentCard asset={asset} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

    </ContentContainer>
  );
});