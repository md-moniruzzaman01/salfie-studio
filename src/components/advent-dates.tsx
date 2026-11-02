"use client";

import { useRef } from "react";
import { claySurface } from "@/components/motion/clay-shapes";
import { gsap, MOTION_OK, useGSAP } from "@/components/motion/gsap";
import { BRAND, EVENT_DATES } from "@/lib/content";

const OPEN = -96;

/**
 * Santa's eight dates as an advent calendar. Server-rendered with every
 * door open; when motion is welcome the doors close and swing open one by
 * one as the calendar scrolls into view, and nudge wider on hover.
 */
export function AdventDates() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = root.current;
      if (!el || !contextSafe) return;
      const doors = gsap.utils.toArray<HTMLElement>("[data-door]", el);
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.set(doors, { rotateY: 0 });
        gsap.to(doors, {
          rotateY: OPEN,
          duration: 1.1,
          ease: "back.out(1.3)",
          stagger: { each: 0.11, from: "start" },
          scrollTrigger: { trigger: el, start: "top 72%", once: true },
        });

        const cells = gsap.utils.toArray<HTMLElement>("[data-cell]", el);
        const handlers = cells.map((cell, i) => {
          const enter = contextSafe(() => gsap.to(doors[i], { rotateY: OPEN + 14, duration: 0.5, ease: "power2.out", overwrite: "auto" }));
          const leave = contextSafe(() => gsap.to(doors[i], { rotateY: OPEN, duration: 0.7, ease: "back.out(2)", overwrite: "auto" }));
          cell.addEventListener("pointerenter", enter);
          cell.addEventListener("pointerleave", leave);
          return () => {
            cell.removeEventListener("pointerenter", enter);
            cell.removeEventListener("pointerleave", leave);
          };
        });
        return () => handlers.forEach((off) => off());
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4 sm:gap-x-7 sm:gap-y-5">
      {EVENT_DATES.map((d, i) => (
        <div key={d.iso} data-cell className="relative aspect-[4/5] [perspective:1400px]">
          {/* inside of the door */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 border border-line bg-white px-2 text-center shadow-[inset_0_6px_18px_rgba(74,31,46,0.12)]">
            <span className="eyebrow !text-[10px] text-crimson">{d.dow}</span>
            <span className="font-display text-[clamp(30px,3.6vw,44px)] font-bold leading-none text-ink">{d.day}</span>
            <span className="font-display text-[15px] italic text-bark">{d.month}</span>
            <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Santa {BRAND.santaHours}</span>
          </div>
          {/* the door */}
          <div
            aria-hidden
            data-door
            className="absolute inset-0 origin-left [transform-style:preserve-3d]"
            style={{ transform: `rotateY(${OPEN}deg)` }}
          >
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-1 border border-gold/60 [backface-visibility:hidden]"
              style={claySurface(i % 2 ? "#7a3a52" : "#e38aa9", i % 2 ? "var(--color-velvet)" : "var(--color-crimson)", i % 2 ? "#2e1220" : "#6e2748", 150)}
            >
              <span className="absolute inset-[7%] border border-gold/50" />
              <span className="font-display text-[clamp(34px,4vw,52px)] font-bold italic leading-none text-gold">{d.day}</span>
              <span className="eyebrow !text-[10px] text-parchment">{d.month}</span>
              <span className="absolute right-[12%] top-1/2 size-[7%] -translate-y-1/2 rounded-full" style={claySurface("#fbe8ad", "var(--color-gold)", "#8f6f2e", 150)} />
            </div>
            <div
              className="absolute inset-0 border border-gold/50 [backface-visibility:hidden] [transform:rotateY(180deg)]"
              style={{ background: "linear-gradient(90deg, #b23d6e 0%, #7a2f4a 60%, #4a1f2e 100%)" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
