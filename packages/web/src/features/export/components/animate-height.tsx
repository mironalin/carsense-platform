import { motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";

type AnimateHeightProps = {
  children: React.ReactNode;
  className?: string;
  initial?: number | "auto";
  duration?: number;
  ease?: number[];
};

/**
 * AnimateHeight component that smoothly animates height changes using ResizeObserver
 *
 * This component will automatically detect height changes in its children and
 * animate to the new height without causing bouncy effects on the inner content.
 */
export function AnimateHeight({
  children,
  className,
  initial = "auto",
  duration = 0.4,
  ease = [0.25, 1, 0.5, 1],
}: AnimateHeightProps) {
  const [height, setHeight] = useState<number | "auto">(initial);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Use callback ref to ensure we have access to the DOM node immediately
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      // Create and attach resize observer when the node is available
      resizeObserverRef.current = new ResizeObserver((entries) => {
        const observedHeight = entries[0]?.contentRect?.height;
        setHeight(observedHeight || "auto");
      });
      resizeObserverRef.current.observe(node);
    }
    else if (resizeObserverRef.current) {
      // Disconnect the observer when the node is unmounted
      resizeObserverRef.current.disconnect();
    }
  }, []);

  // Smooth transition without bounce
  const smoothTransition = {
    type: "tween" as const,
    ease,
    duration,
  };

  return (
    <motion.div
      style={{ height }}
      animate={{ height }}
      transition={smoothTransition}
      className={`overflow-hidden ${className || ""}`}
    >
      <div ref={containerRef}>{children}</div>
    </motion.div>
  );
}
