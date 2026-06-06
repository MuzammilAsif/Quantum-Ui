import { forwardRef, type ReactNode, useRef, useState, useCallback } from 'react';
import { cn } from '../utils';

interface ScrollAreaProps {
  children: ReactNode;
  className?: string;
  fadeTop?: boolean;
  fadeBottom?: boolean;
  onScrollCapture?: (e: React.UIEvent<HTMLDivElement>) => void;
}

/**
 * ScrollArea — styled scrollable region with optional top/bottom fade masks.
 * Tracks scroll position to show/hide fades dynamically.
 */
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ children, className, fadeTop = false, fadeBottom = true, onScrollCapture }, ref) => {
    const innerRef = useRef<HTMLDivElement>(null);
    const [atTop, setAtTop] = useState(true);
    const [atBottom, setAtBottom] = useState(false);

    const handleScroll = useCallback(
      (e: React.UIEvent<HTMLDivElement>) => {
        const el = e.currentTarget;
        const threshold = 8;
        setAtTop(el.scrollTop <= threshold);
        setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - threshold);
        onScrollCapture?.(e);
      },
      [onScrollCapture]
    );

    return (
      <div className={cn('relative flex-1 overflow-hidden', className)}>
        {/* Top fade */}
        {fadeTop && (
          <div
            aria-hidden="true"
            className={cn(
              'absolute top-0 left-0 right-0 h-6 z-10 pointer-events-none',
              'bg-gradient-to-b from-q-base to-transparent',
              'transition-opacity duration-200',
              atTop ? 'opacity-0' : 'opacity-100'
            )}
          />
        )}

        {/* Scrollable content */}
        <div
          ref={(node) => {
            // Support both forwardRef and local ref
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
            (innerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          onScroll={handleScroll}
          className="h-full overflow-y-auto overflow-x-hidden"
          style={{ scrollbarGutter: 'stable' }}
        >
          {children}
        </div>

        {/* Bottom fade */}
        {fadeBottom && (
          <div
            aria-hidden="true"
            className={cn(
              'absolute bottom-0 left-0 right-0 h-6 z-10 pointer-events-none',
              'bg-gradient-to-t from-q-base to-transparent',
              'transition-opacity duration-200',
              atBottom ? 'opacity-0' : 'opacity-100'
            )}
          />
        )}
      </div>
    );
  }
);

ScrollArea.displayName = 'ScrollArea';