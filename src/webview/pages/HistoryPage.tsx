import { memo } from 'react';
import { Clock, Trash2 } from 'lucide-react';
import { ContentContainer } from '../components/ContentContainer';
import { SectionTitle } from '../components/SectionTitle';
import { EmptyState } from '../components/EmptyState';
import { IconButton } from '../components/IconButton';
import { useUserStore } from '../store';
import { formatRelativeTime, cn } from '../utils';

const ACTION_COLORS: Record<string, string> = {
  viewed: 'text-q-text-faint',
  copied: 'text-blue-400',
  inserted: 'text-emerald-400',
  generated: 'text-[var(--q-accent)]',
};

/**
 * HistoryPage — chronological list of recent component interactions.
 */
export const HistoryPage = memo(function HistoryPage() {
  const { history, clearHistory } = useUserStore();
  const isEmpty = history.length === 0;

  return (
    <ContentContainer>
      <SectionTitle
        title="History"
        subtitle={isEmpty ? undefined : `${history.length} recent actions`}
        action={
          !isEmpty ? (
            <IconButton
              icon={<Trash2 size={11} />}
              label="Clear history"
              size="xs"
              variant="ghost"
              onClick={clearHistory}
            />
          ) : undefined
        }
      />

      {isEmpty ? (
        <EmptyState
          icon={<Clock size={20} />}
          title="No history yet"
          description="Your recent component interactions will appear here."
        />
      ) : (
        <div className="flex flex-col gap-1">
          {history.slice(0, 50).map((entry) => (
            <div
              key={entry.id}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-md',
                'bg-q-elevated border border-q-border',
                'hover:border-q-border transition-colors'
              )}
            >
              {/* Action dot */}
              <span
                className={cn(
                  'w-1.5 h-1.5 rounded-full flex-shrink-0',
                  ACTION_COLORS[entry.action] ?? 'text-q-text-faint',
                  'bg-current'
                )}
                aria-hidden="true"
              />

              {/* Name */}
              <span className="flex-1 text-xs text-q-text-muted truncate">
                {entry.name}
              </span>

              {/* Timestamp */}
              <span className="text-2xs text-q-text-ghost flex-shrink-0">
                {formatRelativeTime(entry.timestamp)}
              </span>
            </div>
          ))}
        </div>
      )}
    </ContentContainer>
  );
});