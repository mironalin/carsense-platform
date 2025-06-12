import * as React from "react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type ProgressProps = {
  value?: number;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

// Easing function for smoother animation
function easeOutQuart(x: number): number {
  return 1 - (1 - x) ** 4;
}

export function Progress({ value = 0, className, ...props }: ProgressProps) {
  // State to track the animated value
  const [animatedValue, setAnimatedValue] = useState(value);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Cancel any existing animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Define our animation
    const startValue = animatedValue;
    const endValue = value;
    const duration = 800; // ms
    const startTime = performance.now();

    // Skip animation for very small changes or if values are the same
    if (Math.abs(startValue - endValue) < 0.1) {
      setAnimatedValue(endValue);
      return;
    }

    // Animation function
    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;

      if (elapsedTime < duration) {
        // Calculate progress with easing
        const progress = elapsedTime / duration;
        const eased = easeOutQuart(progress);

        // Update value
        const newValue = startValue + (endValue - startValue) * eased;
        setAnimatedValue(newValue);

        // Continue animation
        animationFrameRef.current = requestAnimationFrame(animate);
      }
      else {
        // Finish animation exactly at the target value
        setAnimatedValue(endValue);
        animationFrameRef.current = null;
      }
    };

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);

    // Clean up on unmount or when value changes
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value]);

  // Ensure value is between 0-100
  const safeValue = Math.max(0, Math.min(100, animatedValue));

  return (
    <div
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        className,
      )}
      {...props}
    >
      <div
        className="h-full bg-primary transition-none"
        style={{
          width: `${safeValue}%`,
          willChange: "width",
        }}
      />
    </div>
  );
}
