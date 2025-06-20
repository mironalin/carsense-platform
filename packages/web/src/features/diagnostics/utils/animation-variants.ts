import type { Variants } from "framer-motion";

// Simple smooth transition for all animations
export const smoothTransition = {
  duration: 0.4,
  ease: [0.25, 1, 0.5, 1],
};

// Page transition animation
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1],
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.2 },
  },
};

// Animation variants for card elements with slight scaling
export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 1, 0.5, 1],
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: 15,
    transition: { duration: 0.2 },
  },
};

// Animation variants for list items with staggered children
export const listVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

// Animation variants for list items
export const listItemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

// Animation for DTC card items
export const dtcCardVariants: Variants = {
  hidden: (i: number) => ({
    opacity: 0,
    y: 20,
    transition: {
      delay: i * 0.02,
    },
  }),
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1],
    },
  }),
  exit: {
    opacity: 0,
    y: 10,
    transition: { duration: 0.2 },
  },
};

// Animation for status badges
export const badgeVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
    x: 10,
  },
  animate: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

export const tooltipVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 5,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.1 },
  },
};

// Animation for height transitions
export const heightTransition = {
  type: "tween" as const,
  ease: [0.25, 1, 0.5, 1],
  duration: 0.5,
};
