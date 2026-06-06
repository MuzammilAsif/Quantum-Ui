import { memo } from 'react';
import { Layers, Filter } from 'lucide-react';
import { ContentContainer } from '../components/ContentContainer';
import { SectionTitle } from '../components/SectionTitle';
import { EmptyState } from '../components/EmptyState';
import { IconButton } from '../components/IconButton';

const CATEGORY_PILLS = [
  'All', 'Buttons', 'Forms', 'Cards', 'Navigation',
  'Modals', 'Tables', 'Charts', 'Layouts',
];

/**
 * ComponentsPage — UI component browser.
 * Phase 1: skeleton structure with empty state.
 * Phase 2: wire to component API + render component grid.
 */
export const ComponentsPage = memo(function ComponentsPage() {
  return (
    <ContentContainer>
      {/* Header row */}
      <div className="flex items-center justify-between">
        <SectionTitle
          title="Components"
          subtitle="Browse and copy UI building blocks"
        />
        <IconButton
          icon={<Filter size={12} />}
          label="Filter components"
          size="sm"
          variant="subtle"
        />
      </div>

      {/* Category filter pills */}
      <div className="flex gap-1.5 flex-wrap">
        {CATEGORY_PILLS.map((cat, i) => (
          <button
            key={cat}
            className={`px-2.5 py-1 rounded-full text-2xs font-medium cursor-pointer
              transition-all duration-150 select-none
              ${i === 0
                ? 'bg-[var(--q-accent)] text-white'
                : 'bg-q-elevated border border-q-border text-q-text-muted hover:text-q-text hover:border-[var(--q-accent-border)]'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Empty state — replaced by component grid in Phase 2 */}
      <EmptyState
        icon={<Layers size={20} />}
        title="Components coming soon"
        description="The component library will be available in the next phase."
      />
    </ContentContainer>
  );
});