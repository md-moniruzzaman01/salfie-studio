"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { DESKTOP, gsap, MOTION_OK, useGSAP } from "@/components/motion/gsap";
import { SectionHeading } from "@/components/section-heading";
import { IMAGES } from "@/lib/images";

const FEATURED = [
  { num: "01", name: "The Golden Doorway", image: IMAGES.door, pos: "50% 42%" },
  { num: "02", name: "The Carousel", image: IMAGES.carousel, pos: "50% 48%" },
];

const VEILED = ["03", "04", "05", "06", "07", "08"];

const CARD = "relative aspect-[4/5] w-[min(72vw,320px)] shrink-0 overflow-hidden lg:w-[min(30vw,calc(62svh*0.8))]";

const CURTAIN: CSSProperties = {
  backgroundImage:
    "linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.35) 100%), repeating-linear-gradient(90deg, #5c2338 0px, #7a2f4a 14px, #4a1f2e 30px, #6b2941 44px)",
  boxShadow: "inset 0 -30px 40px -20px rgba(0,0,0,0.45)",
};

/**
 * A walk past all eight sets. On desktop the row is pinned and slides as
 * you scroll; the two photographed sets show in full and the six still
 * under wraps sit behind velvet curtains that part as they pass center.
 * On touch screens it's a native swipe row.
 */
export function BackdropShowcase() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const track = el?.querySelector<HTMLElement>("[data-track]");
      if (!el || !track) return;
      const mm = gsap.matchMedia();
      mm.add(`${DESKTOP} and ${MOTION_OK}`, () => {
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
        const slide = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true },
        });

        gsap.utils.toArray<HTMLElement>("[data-set]", track).forEach((card) => {
          const img = card.querySelector("[data-set-img]");
          if (img) {
            gsap.fromTo(img, { xPercent: -10 }, { xPercent: 10, ease: "none", scrollTrigger: { trigger: card, containerAnimation: slide, start: "left right", end: "right left", scrub: true } });
          }
          const left = card.querySelector("[data-curtain='left']");
          const right = card.querySelector("[data-curtain='right']");
          if (left && right) {
            gsap
              .timeline({ scrollTrigger: { trigger: card, containerAnimation: slide, start: "left 90%", end: "right 10%", scrub: true } })
              .fromTo([left, right], { x: 0, xPercent: 0, skewY: 0 }, { xPercent: (i) => (i === 0 ? -100 : 100), skewY: (i) => (i === 0 ? -3 : 3), ease: "sine.inOut" })
              .to([left, right], { xPercent: 0, skewY: 0, ease: "sine.inOut" });
          }
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="The eight sets" className="grain overflow-hidden bg-ink text-cream">
      <div className="flex flex-col justify-center py-[clamp(72px,10vw,120px)] lg:min-h-[100svh] lg:py-0">
        <div className="no-scrollbar snap-x snap-mandatory overflow-x-auto lg:snap-none lg:overflow-visible">
          <ul data-track className="m-0 flex w-max list-none items-center gap-5 p-0 px-6 pb-4 sm:gap-8 sm:px-10 lg:gap-10 lg:pl-[max(4rem,calc((100vw-1280px)/2+4rem))] lg:pr-[12vw]">
            <li className="flex w-[min(80vw,420px)] shrink-0 snap-start flex-col gap-6 pr-4 lg:w-[clamp(340px,30vw,440px)]">
              <SectionHeading script="Different backdrops." title="Same magic." tone="light" />
              <p className="m-0 max-w-[36ch] font-body text-[clamp(20px,2vw,25px)] leading-snug text-parchment">
                Eight signature sets in all. Two you can preview — the other six are revealed when you step inside.
              </p>
              <span className="eyebrow hidden items-center gap-3 text-gold lg:flex">
                Keep scrolling
                <span aria-hidden className="h-px w-16 bg-gold" />
              </span>
            </li>

            {FEATURED.map((set) => (
              <li key={set.num} data-set className="snap-center">
                <figure className="m-0 flex flex-col gap-4">
                  <div className={`${CARD} border border-cream/20`}>
                    <span data-set-img className="absolute inset-y-0 -inset-x-[14%]">
                      <Image src={set.image} alt={`Set ${set.num}: ${set.name}`} fill sizes="(min-width:1024px) 440px, 72vw" className="object-cover" style={{ objectPosition: set.pos }} />
                    </span>
                  </div>
                  <figcaption className="flex items-baseline gap-4">
                    <span className="font-display text-[22px] italic leading-none text-crimson">{set.num}</span>
                    <span aria-hidden className="h-px flex-1 translate-y-[-6px] bg-cream/15" />
                    <span className="font-display text-[clamp(20px,2vw,26px)] leading-tight">{set.name}</span>
                  </figcaption>
                </figure>
              </li>
            ))}

            {VEILED.map((num) => (
              <li key={num} data-set className="snap-center">
                <figure className="m-0 flex flex-col gap-4">
                  <div className={`${CARD} bg-[#1d0c13]`}>
                    <span
                      aria-hidden
                      className="absolute inset-0"
                      style={{ background: "radial-gradient(60% 50% at 50% 40%, rgba(201,162,74,0.45) 0%, rgba(178,61,110,0.25) 45%, rgba(29,12,19,0) 75%)" }}
                    />
                    <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
                      <span className="font-display text-[64px] italic leading-none text-gold">{num}</span>
                      <span className="eyebrow text-parchment">Revealed in-studio</span>
                    </span>
                    <span aria-hidden data-curtain="left" className="absolute inset-y-0 left-0 w-[51%] origin-top-left" style={{ ...CURTAIN, transform: "translateX(-76%)" }} />
                    <span aria-hidden data-curtain="right" className="absolute inset-y-0 right-0 w-[51%] origin-top-right" style={{ ...CURTAIN, transform: "translateX(76%)" }} />
                    <span aria-hidden className="absolute inset-x-0 top-0 h-[7%] bg-gradient-to-b from-gold/80 to-[#8f6f2e] shadow-[0_6px_14px_rgba(0,0,0,0.5)]" />
                  </div>
                  <figcaption className="flex items-baseline gap-4">
                    <span className="font-display text-[22px] italic leading-none text-crimson">{num}</span>
                    <span aria-hidden className="h-px flex-1 translate-y-[-6px] bg-cream/15" />
                    <span className="font-display text-[clamp(20px,2vw,26px)] leading-tight text-parchment/70">Under wraps</span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
