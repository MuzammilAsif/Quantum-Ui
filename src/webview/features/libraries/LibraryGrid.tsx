import { memo } from 'react';
import { motion } from 'framer-motion';
import {
  Zap, Layers, Sparkles, Star, LayoutDashboard,
  ChevronRight, BadgeCheck, type LucideIcon,
} from 'lucide-react';
import { LIBRARIES } from './data';
import { useLibraryStore } from '../../store/libraryStore';
import { STAGGER_CONTAINER_VARIANTS, STAGGER_ITEM_VARIANTS } from '../../constants';
import { cn } from '../../utils';

const ICON_MAP: Record<string, LucideIcon> = {
  Zap, Layers, Sparkles, Star, LayoutDashboard,
};

/**
 * LibraryGrid — home view showing all supported UI libraries as tiles.
 * Clicking a tile opens that library's category/component browser.
 */
export const LibraryGrid = memo(function LibraryGrid() {
  const { setActiveLibrary } = useLibraryStore();

  return (
    <motion.div
      variants={STAGGER_CONTAINER_VARIANTS}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-2"
    >
      {LIBRARIES.map((lib) => {
        const Icon = ICON_MAP[lib.icon] ?? Layers;

        return (
          <motion.button
            key={lib.id}
            variants={STAGGER_ITEM_VARIANTS}
            onClick={() => setActiveLibrary(lib.id)}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            className={cn(
              'group flex items-center gap-3 p-3 rounded-lg w-full text-left',
              'bg-q-elevated border border-q-border cursor-pointer',
              'hover:border-[var(--q-accent-border)] transition-colors duration-150'
            )}
          >
            {/* Icon */}
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: `${lib.color}20`,
                border: `1px solid ${lib.color}40`,
              }}
            >
              <Icon size={18} style={{ color: lib.color }} aria-hidden="true" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-q-text truncate">
                  {lib.name}
                </p>
                {lib.isOfficial && (
                  <BadgeCheck
                    size={12}
                    className="text-[var(--q-accent)] flex-shrink-0"
                    aria-hidden="true"
                  />
                )}
              </div>
              <p className="text-2xs text-q-text-faint mt-0.5 truncate">
                {lib.description}
              </p>
            </div>

            {/* Arrow */}
            <ChevronRight
              size={14}
              className="text-q-text-ghost group-hover:text-q-text-faint
                transition-colors flex-shrink-0"
              aria-hidden="true"
            />
          </motion.button>
        );
      })}
    </motion.div>
  );
});