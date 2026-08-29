import type { Variants } from 'framer-motion';

/**
 * LEWS Enterprise Motion System Tokens
 * Strictly restrained, non-distracting timing for operational software.
 */
export const MOTION_TOKENS = {
  duration: {
    fast: 0.14, // 140ms
    standard: 0.2, // 200ms
    emphasis: 0.3, // 300ms
  },
  ease: {
    standard: [0.16, 1, 0.3, 1] as const,
    sharp: [0.4, 0, 0.2, 1] as const,
  },
};

/**
 * Subtle route page entrance transition (opacity 0->1, tiny y translation 4px->0px).
 */
export const pageTransitionVariants: Variants = {
  initial: { opacity: 0, y: 4 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_TOKENS.duration.standard,
      ease: MOTION_TOKENS.ease.standard,
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: {
      duration: MOTION_TOKENS.duration.fast,
      ease: MOTION_TOKENS.ease.sharp,
    },
  },
};

/**
 * Drawer slide-over motion variants for inspector panels.
 */
export const drawerVariants: Variants = {
  hidden: { x: '100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: MOTION_TOKENS.duration.emphasis,
      ease: MOTION_TOKENS.ease.standard,
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: MOTION_TOKENS.duration.standard,
      ease: MOTION_TOKENS.ease.sharp,
    },
  },
};

/**
 * Backdrop overlay fade variants.
 */
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: MOTION_TOKENS.duration.fast },
  },
  exit: {
    opacity: 0,
    transition: { duration: MOTION_TOKENS.duration.fast },
  },
};
