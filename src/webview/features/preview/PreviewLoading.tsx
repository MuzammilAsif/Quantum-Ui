import { memo } from 'react';
import { motion } from 'framer-motion';

interface PreviewLoadingProps {
    theme?: 'dark' | 'light';
}

/**
 * PreviewLoading — shimmer skeleton shown while the sandbox iframe
 * is loading and Tailwind CDN is being processed.
 *
 * Matches the general shape of what a component preview looks like
 * so there is no jarring layout shift when the preview appears.
 */
export const PreviewLoading = memo(function PreviewLoading({
    theme = 'dark',
}: PreviewLoadingProps) {
    const bgBase = theme === 'dark' ? 'bg-[#0a0a12]' : 'bg-white';
    const shimmer = theme === 'dark' ? 'bg-[#1a1a2e]' : 'bg-gray-100';
    const shimmerHighlight = theme === 'dark' ? 'bg-[#252540]' : 'bg-gray-200';

    return (
        <div className={`flex flex-col items-center justify-center
      w-full h-full gap-4 p-6 ${bgBase}`}
        >
            {/* Main content shimmer block */}
            <div className="flex flex-col items-center gap-3 w-full max-w-[240px]">

                {/* Simulated component shape — top bar */}
                <motion.div
                    className={`w-full h-8 rounded-md ${shimmer}`}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Simulated component shape — middle content */}
                <div className="flex gap-2 w-full">
                    <motion.div
                        className={`h-16 rounded-md flex-1 ${shimmer}`}
                        animate={{ opacity: [0.4, 0.9, 0.4] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 0.1,
                        }}
                    />
                    <motion.div
                        className={`h-16 rounded-md flex-1 ${shimmer}`}
                        animate={{ opacity: [0.4, 0.9, 0.4] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 0.2,
                        }}
                    />
                </div>

                {/* Simulated component shape — bottom bar */}
                <motion.div
                    className={`w-3/4 h-6 rounded-md ${shimmerHighlight}`}
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 0.15,
                    }}
                />
            </div>

            {/* Loading label */}
            <motion.p
                className="text-2xs font-medium tracking-widest uppercase
          text-q-text-faint select-none"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
                Rendering preview...
            </motion.p>
        </div>
    );
});