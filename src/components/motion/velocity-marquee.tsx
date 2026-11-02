"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/components/motion/gsap";

/**
 * Endless ribbon of phrases that speeds up and leans with scroll velocity,
 * reversing direction when you scroll back up.
 */
export function VelocityMarquee({ items }: { items: string[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const row = root.current?.querySelector<HTMLElement>("[data-row]");
      if (!row) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const loop = gsap.to(row, { xPercent: -50, duration: 38, ease: "none", repeat: -1 });
        let direction = 1;
        const st = ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            const v = self.getVelocity();
            if (self.direction !== direction) direction = self.direction;
            const boost = gsap.utils.clamp(1, 6, 1 + Math.abs(v) / 400);
            gsap.to(loop, { timeScale: boost * direction, duration: 0.2, overwrite: true });
            gsap.to(loop, { timeScale: direction, duration: 1.2, delay: 0.25, ease: "power2.out" });
            gsap.to(row, { skewX: gsap.utils.clamp(-10, 10, v / -250), duration: 0.25, overwrite: "auto" });
            gsap.to(row, { skewX: 0, duration: 0.9, delay: 0.25, ease: "power2.out" });
          },
        });
        return () => st.kill();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const doubled = [...items, ...items];
  return (
    <div ref={root} aria-hidden className="overflow-hidden border-y border-crimson bg-crimson py-4 text-cream">
      <div data-row className="flex w-max items-center whitespace-nowrap font-display text-[clamp(22px,3vw,34px)] italic will-change-transform">
        {doubled.map((t, i) => (
          <span key={i} className="flex items-center">
            <span className="px-7">{t}</span>
            <span className="not-italic text-gold">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
