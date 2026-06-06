import { useMemo } from 'react';
import { useThemeStore } from '../store';
import {
  FADE_IN_VARIANTS,
  SLIDE_UP_VARIANTS,
  SLIDE_IN_LEFT_VARIANTS,
  SCALE_IN_VARIANTS,
  STAGGER_CONTAINER_VARIANTS,
  STAGGER_ITEM_VARIANTS,
  ANIMATION_CONFIG,
} from '../constants';

type VariantMap = Record<string, object>;

const NO_ANIMATION: VariantMap = {
  hidden: {},
  visible: {},
  exit: {},
};

/**
 * useAnimation — returns motion variants that respect user preferences.
 * Disables all animations when animationsEnabled=false or prefers-reduced-motion.
 */
export function useAnimation() {
  const { animationsEnabled } = useThemeStore();
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const enabled = animationsEnabled && !prefersReduced;

  const variants = useMemo(
    () => ({
      fadeIn: enabled ? FADE_IN_VARIANTS : NO_ANIMATION,
      slideUp: enabled ? SLIDE_UP_VARIANTS : NO_ANIMATION,
      slideInLeft: enabled ? SLIDE_IN_LEFT_VARIANTS : NO_ANIMATION,
      scaleIn: enabled ? SCALE_IN_VARIANTS : NO_ANIMATION,
      staggerContainer: enabled ? STAGGER_CONTAINER_VARIANTS : NO_ANIMATION,
      staggerItem: enabled ? STAGGER_ITEM_VARIANTS : NO_ANIMATION,
    }),
    [enabled]
  );

  const duration = useMemo(
    () => ({
      fast: enabled ? ANIMATION_CONFIG.duration.fast : 0,
      normal: enabled ? ANIMATION_CONFIG.duration.normal : 0,
      slow: enabled ? ANIMATION_CONFIG.duration.slow : 0,
    }),
    [enabled]
  );

  const spring = useMemo(
    () => ({
      stiff: enabled ? ANIMATION_CONFIG.spring.stiff : { duration: 0 },
      smooth: enabled ? ANIMATION_CONFIG.spring.smooth : { duration: 0 },
      bounce: enabled ? ANIMATION_CONFIG.spring.bounce : { duration: 0 },
    }),
    [enabled]
  );

  return { enabled, variants, duration, spring };
}