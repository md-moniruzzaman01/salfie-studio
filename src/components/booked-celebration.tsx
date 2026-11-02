"use client";

import Image from "next/image";
import { useRef } from "react";
import { ClayCamera } from "@/components/motion/clay-camera";
import { ClayOrnament, ClayStar } from "@/components/motion/clay-shapes";
import { gsap, MOTION_OK, useGSAP } from "@/components/motion/gsap";
import { IMAGE_ALT, IMAGES } from "@/lib/images";

const CONFETTI = Array.from({ length: 14 }, (_, i) => i);

/**
 * The confirmation shot: the camera flashes, a polaroid slides out and
 * develops from white to full colour, and clay stars and ornaments burst
 * around it. Rendered fully developed for reduced motion.
 */
export function BookedCelebration() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const print = el.querySelector("[data-print]");
        const photo = el.querySelector("[data-photo]");
        const flash = el.querySelector("[data-flash]");
        const camera = el.querySelector("[data-camera]");
        const bits = gsap.utils.toArray<HTMLElement>("[data-bit]", el);

        gsap.set(bits, { x: 0, y: 0, scale: 0, autoAlpha: 0 });
        gsap
          .timeline({ delay: 0.3 })
          .from(camera, { y: 40, autoAlpha: 0, scale: 0.8, duration: 0.7, ease: "back.out(1.6)" })
          .to(camera, { y: 5, duration: 0.07 }, "+=0.15")
          .to(camera, { y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" })
          .fromTo(flash, { opacity: 0 }, { opacity: 1, duration: 0.06 }, "<-0.05")
          .to(flash, { opacity: 0, duration: 0.9, ease: "power2.out" })
          .fromTo(print, { yPercent: -70, scale: 0.6, rotate: 0, autoAlpha: 0 }, { yPercent: 0, scale: 1, rotate: -4, autoAlpha: 1, duration: 1, ease: "back.out(1.3)" }, "<")
          .fromTo(photo, { filter: "brightness(2.6) saturate(0) blur(6px)" }, { filter: "brightness(1) saturate(1) blur(0px)", duration: 2.4, ease: "power1.out" }, "<0.2")
          .to(
            bits,
            {
              autoAlpha: 1,
              scale: () => gsap.utils.random(0.7, 1.2),
              x: () => gsap.utils.random(-260, 260),
              y: () => gsap.utils.random(-220, 60),
              rotate: () => gsap.utils.random(-180, 180),
              duration: 1.2,
              ease: "expo.out",
              stagger: 0.02,
            },
            "<",
          )
          .to(bits, { y: "+=40", duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative mx-auto flex w-full max-w-[420px] flex-col items-center">
      <span
        aria-hidden
        data-flash
        className="pointer-events-none fixed inset-0 z-50 opacity-0"
        style={{ background: "radial-gradient(circle at 50% 30%, rgba(255,252,244,1) 0%, rgba(255,246,230,0.8) 30%, rgba(255,246,230,0.2) 70%)" }}
      />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[38%] z-0">
        {CONFETTI.map((i) =>
          i % 2 === 0 ? (
            <div key={i} data-bit className="invisible absolute aspect-square w-[34px]">
              <ClayStar style={{ position: "relative", width: "100%", height: "100%" }} floating={false} />
            </div>
          ) : (
            <div key={i} data-bit className="invisible absolute w-[30px]">
              <ClayOrnament style={{ position: "relative", width: "100%" }} floating={false} />
            </div>
          ),
        )}
      </div>
      <div data-camera className="relative z-20 w-[52%]">
        <ClayCamera className="w-full" />
      </div>
      <figure
        data-print
        className="relative z-10 m-0 -mt-4 flex w-[62%] flex-col gap-2 bg-porcelain p-3 pb-7 shadow-[0_30px_50px_-20px_rgba(40,10,20,0.45)]"
        style={{ transform: "rotate(-4deg)" }}
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-line">
          <span data-photo className="absolute inset-0">
            <Image src={IMAGES.familyStudioPortrait} alt={IMAGE_ALT.familyStudioPortrait} fill sizes="260px" className="object-cover" style={{ objectPosition: "50% 30%" }} priority />
          </span>
        </div>
        <figcaption className="text-center font-display text-[18px] italic leading-none text-crimson">You&apos;re booked!</figcaption>
      </figure>
    </div>
  );
}
