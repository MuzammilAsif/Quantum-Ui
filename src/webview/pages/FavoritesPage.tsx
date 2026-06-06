import { memo } from 'react';
import { Star } from 'lucide-react';
import { ContentContainer } from '../components/ContentContainer';
import { SectionTitle } from '../components/SectionTitle';
import { EmptyState } from '../components/EmptyState';
import { useUserStore } from '../store';
import { cn } from '../utils';

/**
 * FavoritesPage — saved components and templates.
 */
export const FavoritesPage = memo(function FavoritesPage() {
  const { favorites } = useUserStore();
  const isEmpty = favorites.length === 0;

  return (
    <ContentContainer>
      <SectionTitle
        title="Favorites"
        subtitle={isEmpty ? undefined : `${favorites.length} saved items`}
      />

      {isEmpty ? (
        <EmptyState
          icon={<Star size={20} />}
          title="No favorites yet"
          description="Star components and templates to save them here for quick access."
        />
      ) : (
        <div className="flex flex-col gap-2">
          {favorites.map((id) => (
            <div
              key={id}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md',
                'bg-q-elevated border border-q-border',
                'text-xs text-q-text-muted'
              )}
            >
              <Star size={12} className="text-amber-400 flex-shrink-0" />
              <span className="truncate font-mono text-2xs text-q-text-faint">{id}</span>
            </div>
          ))}
        </div>
      )}
    </ContentContainer>
  );
});