import { useEffect, useState } from "react";

import type { AnimatedCounterProps } from "../types";

export function AnimatedCounter({ value, unit, duration = 400 }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value === 0 ? 0 : value || 0);

  useEffect(() => {
    if (value === null) {
      return;
    }

    const startTime = Date.now();
    const startValue = displayValue;
    const endValue = value;

    // If the value is the same, no need to animate
    if (startValue === endValue) {
      return;
    }

    // For small changes, just update immediately
    if (Math.abs(endValue - startValue) < 1) {
      setDisplayValue(endValue);
      return;
    }

    // For large values or big changes, use shorter duration
    let adjustedDuration = duration;
    if (endValue > 1000 || Math.abs(endValue - startValue) > 100) {
      adjustedDuration = duration * 0.6;
    }

    const updateValue = () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;

      if (elapsedTime < adjustedDuration) {
        const progress = elapsedTime / adjustedDuration;
        // Use easeOutCubic for smoother animation
        const easedProgress = 1 - (1 - progress) ** 3;
        setDisplayValue(startValue + (endValue - startValue) * easedProgress);
        requestAnimationFrame(updateValue);
      }
      else {
        setDisplayValue(endValue);
      }
    };

    requestAnimationFrame(updateValue);
  }, [value, duration, displayValue]);

  if (value === null) {
    return <span>N/A</span>;
  }

  // Format the display value to avoid too many decimal places
  let formattedValue;
  if (value === 0) {
    formattedValue = 0; // Handle zero explicitly
  }
  else if (Math.abs(displayValue) < 0.01) {
    formattedValue = displayValue.toFixed(3); // Small values get 3 decimal places
  }
  else if (Math.abs(displayValue) < 1) {
    formattedValue = displayValue.toFixed(2); // Values less than 1 get 2 decimal places
  }
  else {
    formattedValue = Math.round(displayValue * 100) / 100; // Otherwise round to 2 decimal places
  }

  return (
    <span>
      {formattedValue}
      {" "}
      {unit}
    </span>
  );
}
