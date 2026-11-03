"use client";

import Image from "next/image";
import { useRef } from "react";
import { Fade, MaskLines, PillReveal, useNear } from "@/components/luxe/motion";
import { Script } from "@/components/luxe/home-sections";
import { SETS } from "@/lib/copy";

/** One set photograph, fetched only when it is close to the viewport. */
function SetPhoto({ set, delay }: { set: (typeof SETS)[number]; delay: number }) {
  const [ref, near] = useNear<HTMLDivElement>("400px");
  return (
    <div ref={ref}>
      <PillReveal cover="#f1ece3" delay={delay} className="aspect-[3/4] w-full">
        {near && set.image ? (
          <Image src={set.image} alt={set.alt ?? set.name} fill quality={60} sizes="(min-width: 1024px) 26vw, (min-width: 640px) 44vw, 78vw" className="object-cover" style={{ objectPosition: set.position }} />
        ) : null}
        <span aria-hidden className="pointer-events-none absolute inset-3 border border-ivory/60" />
      </PillReveal>
    </div>
  );
}

/**
 * The eight sets, in a horizontal snap row. Native touch scrolling on phones;
 * arrow buttons on desktop. Set 08 is a labelled placeholder until there is a photo.
 */
export function SetsGallery() {
  const row = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) => row.current?.scrollBy({ left: dir * Math.min(520, row.current.clientWidth * 0.8), behavior: "smooth" });

  return (
    <section id="sets" aria-label="The eight sets" className="overflow-hidden bg-sand py-[clamp(80px,12vw,176px)]">
      <div className="mx-auto flex max-w-[1360px] flex-col gap-[clamp(40px,6vw,80px)]">
        <div className="flex flex-wrap items-end justify-between gap-8 px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col gap-5">
            <p className="eyebrow m-0 text-crimson">The sets</p>
            <MaskLines as="h2" className="m-0 max-w-[16ch] text-[clamp(34px,6vw,76px)] font-extrabold leading-[1.02] tracking-[-0.025em]" lines={["Eight sets,", <Script key="s">endless looks.</Script>]} />
          </div>
          <div className="hidden gap-2 lg:flex">
            {([-1, 1] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => scroll(d)}
                aria-label={d === 1 ? "Next sets" : "Previous sets"}
                className="grid size-14 place-items-center border border-onyx text-onyx transition-colors duration-500 hover:bg-onyx hover:text-ivory"
              >
                <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.25">
                  <path d={d === 1 ? "M4 12h16M14 6l6 6-6 6" : "M20 12H4M10 6l-6 6 6 6"} />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <ul ref={row} className="no-scrollbar m-0 flex w-full snap-x snap-mandatory list-none gap-4 overflow-x-auto scroll-smooth p-0 px-6 pb-2 sm:gap-6 sm:px-10 lg:px-16" tabIndex={0} aria-label="Scroll to see all eight sets">
          {SETS.map((s, i) => (
            <li key={s.num} className="w-[78vw] max-w-[380px] shrink-0 snap-start sm:w-[44vw] lg:w-[26vw]">
              <Fade delay={Math.min(i, 3) * 0.08} y={20}>
                <figure className="m-0 flex flex-col gap-5">
                  {s.image ? (
                    <SetPhoto set={s} delay={Math.min(i, 3) * 0.08} />
                  ) : (
                    <div className="relative grid aspect-[3/4] w-full place-items-center border border-dashed border-line2 bg-ivory/60">
                      <span className="eyebrow !tracking-[0.3em] text-muted">Photo to come</span>
                    </div>
                  )}
                  <figcaption className="flex items-baseline gap-4 border-t border-line2 pt-4">
                    <span className="font-heavy text-[22px] leading-none text-crimson">{s.num}</span>
                    <span className="flex flex-col">
                      <span className="text-[18px] font-bold leading-snug text-onyx">{s.name}</span>
                      <span className="text-[15px] text-muted">{s.note}</span>
                    </span>
                  </figcaption>
                </figure>
              </Fade>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
