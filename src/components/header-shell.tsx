"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/components/motion/gsap";

/**
 * Sticky header that slides away while you read downward and returns the
 * moment you scroll up, with a crimson-to-gold progress hairline.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const bar = el?.querySelector<HTMLElement>("[data-progress]");
      if (!el || !bar) return;

      const progress = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          gsap.set(bar, { scaleX: self.progress });
          el.toggleAttribute("data-scrolled", self.scroll() > 12);
        },
      });

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const hide = gsap.to(el, { yPercent: -100, duration: 0.45, ease: "power3.inOut", paused: true });
        const st = ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            if (self.scroll() < 160 || self.direction === -1) hide.reverse();
            else hide.play();
          },
        });
        return () => st.kill();
      });

      return () => {
        progress.kill();
        mm.revert();
      };
    },
    { scope: ref },
  );

  return (
    <header
      ref={ref}
      className="sticky top-0 z-40 border-b border-line/60 bg-cream/90 text-ink backdrop-blur-md transition-[border-color,box-shadow] duration-300 data-[scrolled]:border-line data-[scrolled]:shadow-[0_14px_34px_-24px_rgba(13,6,6,0.4)]"
    >
      {children}
      <div aria-hidden className="absolute inset-x-0 bottom-[-1px] h-[2px]">
        <div data-progress className="h-full origin-left scale-x-0 bg-gradient-to-r from-crimson via-signal to-gold" />
      </div>
    </header>
  );
}
