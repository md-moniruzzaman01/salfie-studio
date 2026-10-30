"use client";

import { clsx } from "clsx";
import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Render element — defaults to a div. */
  as?: ElementType;
  /** Stagger in seconds. */
  delay?: number;
  className?: string;
}

/**
 * Fades + lifts its children into view once, the first time they enter the
 * viewport. Honors prefers-reduced-motion (the CSS utility renders it visible).
 */
export function Reveal({ children, as, delay = 0, className }: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || shown) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [shown]);

  return (
    <Tag
      ref={ref}
      className={clsx("reveal", shown && "is-visible", className)}
      style={delay ? { ["--reveal-delay" as string]: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  );
}
