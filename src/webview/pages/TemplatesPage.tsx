import { memo } from 'react';
import { Layout } from 'lucide-react';
import { ContentContainer } from '../components/ContentContainer';
import { SectionTitle } from '../components/SectionTitle';
import { EmptyState } from '../components/EmptyState';

const TEMPLATE_CATEGORIES = ['All', 'Landing', 'Dashboard', 'Auth', 'Profile', 'E-commerce'];

/**
 * TemplatesPage — full-page template browser.
 * Phase 1: structure + empty state.
 */
export const TemplatesPage = memo(function TemplatesPage() {
  return (
    <ContentContainer>
      <SectionTitle
        title="Templates"
        subtitle="Production-ready page layouts"
      />

      {/* Category pills */}
      <div className="flex gap-1.5 flex-wrap">
        {TEMPLATE_CATEGORIES.map((cat, i) => (
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

      <EmptyState
        icon={<Layout size={20} />}
        title="Templates coming soon"
        description="Full-page templates will be available in the next release."
      />
    </ContentContainer>
  );
});