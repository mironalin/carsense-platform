import { useEffect, useRef, useState } from "react";

type ScrollingTextProps = {
  text: string;
  className?: string;
};

export function ScrollingText({ text, className = "" }: ScrollingTextProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [shouldScroll, setShouldScroll] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if text overflows container
  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current && containerRef.current) {
        const isOverflowing = textRef.current.scrollWidth > containerRef.current.clientWidth;
        setShouldScroll(isOverflowing);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [text]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden whitespace-nowrap cursor-default ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        position: "relative",
      }}
    >
      {shouldScroll && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "25px",
            height: "100%",
            background: "linear-gradient(to right, transparent, var(--card) 90%)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
      )}
      <span
        ref={textRef}
        style={{
          display: "inline-block",
          transition: `transform ${shouldScroll ? "1.5s" : "0s"} ease-in-out`,
          transform: isHovering && shouldScroll
            ? `translateX(calc(-100% + ${containerRef.current?.clientWidth || 0}px))`
            : "translateX(0)",
          paddingRight: shouldScroll ? "20px" : "0",
        }}
      >
        {text}
      </span>
    </div>
  );
}
