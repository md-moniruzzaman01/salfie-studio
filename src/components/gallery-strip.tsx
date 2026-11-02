"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";
import { DESKTOP, gsap, MOTION_OK, useGSAP } from "@/components/motion/gsap";
import { SectionHeading } from "@/components/section-heading";
import { BRAND } from "@/lib/content";
import { IMAGE_ALT, IMAGES } from "@/lib/images";

const PHOTOS: { src: StaticImageData; alt: string; pos: string; caption: string }[] = [
  { src: IMAGES.door, alt: IMAGE_ALT.door, pos: "50% 45%", caption: "The golden doorway" },
  { src: IMAGES.santaMailbox, alt: IMAGE_ALT.santaMailbox, pos: "60% 35%", caption: "North Pole post" },
  { src: IMAGES.familyStudioPortrait, alt: IMAGE_ALT.familyStudioPortrait, pos: "50% 30%", caption: "The whole crew" },
  { src: IMAGES.carousel, alt: IMAGE_ALT.carousel, pos: "50% 50%", caption: "The carousel" },
  { src: IMAGES.santaSack, alt: IMAGE_ALT.santaSack, pos: "60% 30%", caption: "Shh, it's a surprise" },
  { src: IMAGES.colorfulBackdropPortrait, alt: IMAGE_ALT.colorfulBackdropPortrait, pos: "50% 30%", caption: "Laugh out loud" },
  { src: IMAGES.mailbox, alt: IMAGE_ALT.mailbox, pos: "50% 50%", caption: "Letters for Santa" },
];

const TILT = [-3, 2.5, -1.5, 3, -2.5, 1.5, -2];

/**
 * A contact sheet that slides sideways as you scroll down (desktop), each
 * print swinging through 3D as it crosses the frame. On touch screens it's
 * a native swipe row with snap points.
 */
export function GalleryStrip() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const track = el?.querySelector<HTMLElement>("[data-track]");
      const viewport = el?.querySelector<HTMLElement>("[data-viewport]");
      if (!el || !track || !viewport) return;
      const mm = gsap.matchMedia();
      mm.add(`${DESKTOP} and ${MOTION_OK}`, () => {
        const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
        const slide = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        gsap.utils.toArray<HTMLElement>("[data-print]", track).forEach((card) => {
          gsap
            .timeline({ scrollTrigger: { trigger: card, containerAnimation: slide, start: "left right", end: "right left", scrub: true } })
            .fromTo(card, { rotateY: -32, z: -160, scale: 0.9 }, { rotateY: 0, z: 0, scale: 1, ease: "power1.out" })
            .to(card, { rotateY: 32, z: -160, scale: 0.9, ease: "power1.in" });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Gallery" className="overflow-hidden bg-cream">
      <div className="flex flex-col gap-10 py-[clamp(72px,10vw,120px)] lg:min-h-screen lg:justify-center lg:py-12">
        <div className="mx-auto flex w-full max-w-[1280px] flex-wrap items-end justify-between gap-6 px-6 sm:px-10 lg:px-16">
          <SectionHeading script="A moment, framed" title="Same people. New sets." />
          <a href={BRAND.instagramUrl} target="_blank" rel="noreferrer" className="link-grow text-[13px] font-semibold uppercase tracking-[0.16em] text-ink">
            {BRAND.instagram} →
          </a>
        </div>
        <div data-viewport className="no-scrollbar snap-x snap-mandatory overflow-x-auto lg:snap-none lg:overflow-visible [perspective:1400px]">
          <ul data-track className="m-0 flex w-max list-none gap-5 p-0 px-6 pb-6 sm:gap-8 sm:px-10 lg:gap-12 lg:px-[max(4rem,calc((100vw-1280px)/2+4rem))] [transform-style:preserve-3d]">
            {PHOTOS.map((p, i) => (
              <li key={p.caption} className="snap-center">
                <figure
                  data-print
                  className="m-0 flex w-[min(68vw,300px)] flex-col gap-3 bg-porcelain p-3 pb-6 shadow-[0_30px_60px_-24px_rgba(40,10,20,0.4)] lg:w-[clamp(260px,24vw,340px)]"
                  style={{ rotate: `${TILT[i % TILT.length]}deg` }}
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-line">
                    <Image src={p.src} alt={p.alt} fill sizes="(min-width: 1024px) 340px, 68vw" className="object-cover" style={{ objectPosition: p.pos }} />
                  </div>
                  <figcaption className="flex items-baseline justify-between gap-3 px-1">
                    <span className="font-display text-[17px] italic text-bark">{p.caption}</span>
                    <span className="font-display text-[14px] text-crimson">{String(i + 1).padStart(2, "0")}</span>
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
