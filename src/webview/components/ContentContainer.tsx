import { type ReactNode, memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils';
import { FADE_IN_VARIANTS } from '../constants';

interface ContentContainerProps {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  animate?: boolean;
}

/**
 * ContentContainer — wraps page content with consistent padding and
 * an optional entrance animation. Used by all page components.
 */
export const ContentContainer = memo(function ContentContainer({
  children,
  className,
  padded = true,
  animate = true,
}: ContentContainerProps) {
  return (
    <motion.div
      variants={animate ? FADE_IN_VARIANTS : undefined}
      initial={animate ? 'hidden' : undefined}
      animate={animate ? 'visible' : undefined}
      exit={animate ? 'exit' : undefined}
      className={cn(
        'flex flex-col min-h-full',
        padded && 'px-3 py-3 gap-4',
        className
      )}
    >
      {children}
    </motion.div>
  );
});