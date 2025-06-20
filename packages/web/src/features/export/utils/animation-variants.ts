import type { Variants } from "framer-motion";

// Simple ease transition for height animation
export const heightTransition = {
  type: "tween",
  ease: [0.25, 1, 0.5, 1],
  duration: 0.4,
};

// Simple smooth transition for all animations
export const smoothTransition = {
  duration: 0.5,
  ease: [0.25, 1, 0.5, 1], // Custom easing for smooth motion without bounce
};

// Animation variants for fading elements in and out
export const fadeAnimation: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

// Animation variants for card elements with slight scaling
export const cardAnimation: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1], // Custom ease curve for smooth effect
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.96,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

// Animation variants for list items with staggered children
export const listAnimation: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      duration: 0.3,
    },
  },
};

// Animation variants for list items
export const listItemAnimation: Variants = {
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

// Animation for buttons with hover effect
export const buttonAnimation: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

// Enhanced slide transitions for step changes
export const slideLeftAnimation: Variants = {
  hidden: {
    opacity: 0,
    x: 70,
    scale: 0.98,
    filter: "blur(2px)",
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      x: { duration: 0.5, ease: [0.33, 1, 0.68, 1] },
      opacity: { duration: 0.4, ease: [0.33, 1, 0.68, 1] },
      scale: { duration: 0.5, ease: [0.33, 1, 0.68, 1] },
      filter: { duration: 0.4, ease: [0.33, 1, 0.68, 1] },
    },
  },
  exit: {
    opacity: 0,
    x: -70,
    scale: 0.98,
    filter: "blur(2px)",
    transition: {
      x: { duration: 0.4, ease: "easeIn" },
      opacity: { duration: 0.3, ease: "easeIn" },
      filter: { duration: 0.3, ease: "easeIn" },
      scale: { duration: 0.3, ease: "easeIn" },
    },
  },
};

export const slideRightAnimation: Variants = {
  hidden: {
    opacity: 0,
    x: -70,
    scale: 0.98,
    filter: "blur(2px)",
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      x: { duration: 0.5, ease: [0.33, 1, 0.68, 1] },
      opacity: { duration: 0.4, ease: [0.33, 1, 0.68, 1] },
      scale: { duration: 0.5, ease: [0.33, 1, 0.68, 1] },
      filter: { duration: 0.4, ease: [0.33, 1, 0.68, 1] },
    },
  },
  exit: {
    opacity: 0,
    x: 70,
    scale: 0.98,
    filter: "blur(2px)",
    transition: {
      x: { duration: 0.4, ease: "easeIn" },
      opacity: { duration: 0.3, ease: "easeIn" },
      filter: { duration: 0.3, ease: "easeIn" },
      scale: { duration: 0.3, ease: "easeIn" },
    },
  },
};

// Page transition animation
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1],
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

// Animation for progress indicators
export const progressAnimation: Variants = {
  incomplete: {
    backgroundColor: "var(--muted)",
    borderColor: "var(--border)",
    scale: 0.95,
  },
  active: {
    backgroundColor: "var(--primary-light)",
    borderColor: "var(--primary)",
    scale: 1.1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  complete: {
    backgroundColor: "var(--primary)",
    borderColor: "var(--primary)",
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

// Animation for tab slider
export const tabTransition = {
  type: "spring" as const,
  bounce: 0.2,
  duration: 0.6,
};
