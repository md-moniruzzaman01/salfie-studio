"use client";

import { useId, useRef, useState } from "react";
import { gsap, useGSAP } from "@/components/motion/gsap";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";

interface FaqProps {
  items: { q: string; a: string }[];
  title: string;
  id?: string;
}

/** One question open at a time; answers glide open instead of snapping. */
export function Faq({ items, title, id = "faq" }: FaqProps) {
  const [open, setOpen] = useState(0);
  const root = useRef<HTMLElement>(null);
  const base = useId();

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.utils.toArray<HTMLElement>("[data-answer]", root.current).forEach((panel, i) => {
        const isOpen = i === open;
        gsap.to(panel, { height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0, duration: reduce ? 0 : 0.55, ease: "power3.inOut", overwrite: "auto" });
      });
      gsap.utils.toArray<HTMLElement>("[data-plus]", root.current).forEach((icon, i) => {
        gsap.to(icon, { rotate: i === open ? 135 : 0, duration: reduce ? 0 : 0.5, ease: "back.out(2)", overwrite: "auto" });
      });
    },
    { scope: root, dependencies: [open] },
  );

  return (
    <section ref={root} id={id} className="scroll-mt-24 bg-sand px-6 py-[clamp(72px,10vw,120px)] sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading script="Good to know" title={title} />
        </Reveal>
        <div className="flex flex-col border-t border-line2">
          {items.map((item, i) => {
            const isOpen = i === open;
            return (
              <div key={item.q} className="border-b border-line2">
                <h3 className="m-0">
                  <button
                    type="button"
                    id={`${base}-q${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`${base}-a${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="group flex min-h-[72px] w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span className={`font-display text-[clamp(19px,1.9vw,23px)] leading-tight transition-colors ${isOpen ? "text-crimson" : "text-ink group-hover:text-crimson"}`}>
                      {item.q}
                    </span>
                    <span
                      aria-hidden
                      data-plus
                      className="flex size-9 shrink-0 items-center justify-center rounded-full border border-crimson/40 text-[22px] leading-none text-crimson"
                    >
                      +
                    </span>
                  </button>
                </h3>
                <div
                  id={`${base}-a${i}`}
                  role="region"
                  aria-labelledby={`${base}-q${i}`}
                  data-answer
                  className="overflow-hidden"
                  // Initial state only — GSAP owns height/opacity after mount.
                  style={i === 0 ? undefined : { height: 0, opacity: 0 }}
                  inert={!isOpen}
                >
                  <p className="m-0 max-w-[60ch] pb-7 pr-10 text-[16px] leading-relaxed text-bark">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
