"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, MOTION_OK, SplitText, useGSAP } from "@/components/motion/gsap";

interface SplitRevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** Play on mount instead of when scrolled into view (heroes). */
  immediate?: boolean;
}

/**
 * Headline that rises line by line out of a mask. Text stays hidden only
 * while JS is about to split it (see the `html.js [data-split]` rule), so
 * no-JS and reduced-motion visitors always see it.
 */
export function SplitReveal({ children, as, className, delay = 0, immediate = false }: SplitRevealProps) {
  const Tag = (as ?? "h2") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      if (!el || !contextSafe) return;
      let split: SplitText | null = null;
      let cancelled = false;

      // Split once after fonts load (autoSplit re-splitting caused scroll-anchor drift).
      const run = contextSafe(() => {
        if (cancelled) return;
        if (!window.matchMedia(MOTION_OK).matches) {
          gsap.set(el, { visibility: "visible" });
          return;
        }
        const lines = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "split-line" });
        split = lines;
        gsap.set(el, { visibility: "visible" });
        gsap.from(lines.lines, {
          yPercent: 115,
          rotate: 3,
          transformOrigin: "0% 100%",
          duration: 1.15,
          ease: "expo.out",
          stagger: 0.1,
          delay,
          scrollTrigger: immediate ? undefined : { trigger: el, start: "top 88%", once: true },
          onComplete: () => {
            lines.revert();
            split = null;
          },
        });
      });
      document.fonts.ready.then(run);

      return () => {
        cancelled = true;
        split?.revert();
      };
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} data-split className={className}>
      {children}
    </Tag>
  );
}
