import { memo, Suspense, lazy } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Header } from '../components/Header';
import { ScrollArea } from '../components/ScrollArea';
import { ToastContainer } from '../components/ToastContainer';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useNavigation } from '../hooks/useNavigation';
import { cn } from '../utils';

// ── Lazy-loaded pages (code splitting per route) ───────────────────────────
const HomePage = lazy(() =>
  import('../pages/HomePage').then((m) => ({ default: m.HomePage }))
);
const ComponentsPage = lazy(() =>
  import('../pages/ComponentsPage').then((m) => ({ default: m.ComponentsPage }))
);
const TemplatesPage = lazy(() =>
  import('../pages/TemplatesPage').then((m) => ({ default: m.TemplatesPage }))
);
const AIStudioPage = lazy(() =>
  import('../pages/AIStudioPage').then((m) => ({ default: m.AIStudioPage }))
);
const FavoritesPage = lazy(() =>
  import('../pages/FavoritesPage').then((m) => ({ default: m.FavoritesPage }))
);
const HistoryPage = lazy(() =>
  import('../pages/HistoryPage').then((m) => ({ default: m.HistoryPage }))
);
const SettingsPage = lazy(() =>
  import('../pages/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);

/** Minimal inline page skeleton shown while lazy chunks load */
function PageSkeleton() {
  return (
    <div className="flex flex-col gap-3 px-3 py-3 animate-pulse">
      <div className="h-3 w-24 rounded bg-q-elevated" />
      <div className="h-2 w-40 rounded bg-q-elevated opacity-60" />
      <div className="mt-2 flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 rounded-md bg-q-elevated opacity-40" />
        ))}
      </div>
    </div>
  );
}

/**
 * SidebarLayout — the top-level shell of the Quantum UI webview.
 *
 * Structure:
 * ┌─────────────────────────────┐
 * │  Header (logo + search)     │  ← fixed height
 * ├─────────────────────────────┤
 * │  Navigation (nav items)     │  ← fixed height
 * ├─────────────────────────────┤
 * │  ScrollArea                 │  ← flex-1, scrollable
 * │    <ActivePage />           │
 * ├─────────────────────────────┤
 * │  ToastContainer (overlay)   │
 * └─────────────────────────────┘
 */
export const SidebarLayout = memo(function SidebarLayout() {
  const { activePage } = useNavigation();

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-q-base bg-mesh relative">

      {/* Top header */}
      <Header />

      {/* Navigation rail */}
      <NavRail />

      {/* Page content */}
      <ScrollArea fadeTop fadeBottom className="flex-1">
        <ErrorBoundary>
          <Suspense fallback={<PageSkeleton />}>
            <AnimatePresence mode="wait" initial={false}>
              <PageRouter key={activePage} page={activePage} />
            </AnimatePresence>
          </Suspense>
        </ErrorBoundary>
      </ScrollArea>

      {/* Toast overlay */}
      <ToastContainer />
    </div>
  );
});

// ── Inline nav rail (horizontal tab strip under header) ───────────────────

import { NAV_ITEMS_CONFIG } from '../constants';
import { NavigationItem } from '../components/NavigationItem';
import type { NavPage } from '../types';

function NavRail() {
  const { navigate, isActive } = useNavigation();

  return (
    <div
      role="tablist"
      aria-label="Navigation"
      className={cn(
        'flex-shrink-0 flex items-center gap-0.5 px-2 py-1.5',
        'border-b border-q-border-subtle bg-q-base/80'
      )}
    >
      {NAV_ITEMS_CONFIG.map((item) => (
        <NavigationItem
          key={item.id}
          item={item}
          isActive={isActive(item.id)}
          isCompact={false}
          onClick={() => navigate(item.id)}
        />
      ))}
    </div>
  );
}

// ── Page router ───────────────────────────────────────────────────────────

function PageRouter({ page }: { page: NavPage | 'settings' }) {
  switch (page) {
    case 'home':        return <HomePage />;
    case 'components':  return <ComponentsPage />;
    case 'templates':   return <TemplatesPage />;
    case 'ai-studio':   return <AIStudioPage />;
    case 'favorites':   return <FavoritesPage />;
    case 'history':     return <HistoryPage />;
    case 'settings':    return <SettingsPage />;
    default:            return <HomePage />;
  }
}