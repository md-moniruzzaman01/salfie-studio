"use client";

import Image from "next/image";
import { useRef } from "react";
import { claySurface } from "@/components/motion/clay-shapes";
import { ClayCamera } from "@/components/motion/clay-camera";
import { DESKTOP, gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/components/motion/gsap";
import { SectionHeading } from "@/components/section-heading";
import { IMAGE_ALT, IMAGES } from "@/lib/images";

const STEPS = [
  {
    title: "Pick your experience",
    body: "Santa, the studio, or both — on one of 8 dates.",
    img: IMAGES.santaSack,
    alt: IMAGE_ALT.santaSack,
    pos: "60% 30%",
    caption: "Santa or the studio",
  },
  {
    title: "Reserve in a tap",
    body: "Apple Pay, Google Pay or card, secured by Square.",
    img: IMAGES.door,
    alt: IMAGE_ALT.door,
    pos: "50% 45%",
    caption: "Your date, saved",
  },
  {
    title: "Step in & strike a pose",
    body: "We handle the magic. You take the memories home.",
    img: IMAGES.familyStudioPortrait,
    alt: IMAGE_ALT.familyStudioPortrait,
    pos: "50% 35%",
    caption: "Memories, developed",
  },
];

/** Where each print lands once it's ejected (relative to its own size). */
const LANDING = [
  { x: -92, y: 64, rotate: -10 },
  { x: 0, y: 80, rotate: 2 },
  { x: 92, y: 64, rotate: 9 },
];

/**
 * "Booked in three taps" as a photo shoot: each step fires the clay
 * camera's flash and ejects a polaroid. Pinned and scroll-stepped on
 * desktop; plays through once on smaller screens; static with all three
 * prints laid out under reduced motion.
 */
export function HowItWorks() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = root.current;
      if (!el || !contextSafe) return;
      const steps = gsap.utils.toArray<HTMLElement>("[data-step]", el);
      const bars = gsap.utils.toArray<HTMLElement>("[data-step-bar]", el);
      const prints = gsap.utils.toArray<HTMLElement>("[data-print]", el);
      const flash = el.querySelector<HTMLElement>("[data-flash]");
      const bulb = el.querySelector<HTMLElement>("[data-cam-flash]");
      const lens = el.querySelector<HTMLElement>("[data-cam-lens]");
      const camera = el.querySelector<HTMLElement>("[data-camera]");
      const pin = el.querySelector<HTMLElement>("[data-pin]");
      const stage = el.querySelector<HTMLElement>("[data-stage]");

      const mm = gsap.matchMedia();
      mm.add({ desktop: DESKTOP, motion: MOTION_OK }, (ctx) => {
        const { desktop, motion } = ctx.conditions ?? {};
        if (!motion) return;

        let current = -1;
        gsap.set(prints, { xPercent: -50, x: 0, yPercent: -30, y: 0, rotate: 0, scale: 0.55, autoAlpha: 0 });
        gsap.set(steps, { opacity: 0.45 });
        gsap.set(bars, { scaleX: 0, transformOrigin: "0% 50%" });

        const fire = () => {
          const tl = gsap.timeline();
          tl.to(camera, { y: 6, rotate: -1.5, duration: 0.08, ease: "power2.out" })
            .to(camera, { y: 0, rotate: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" })
            .fromTo(lens, { scale: 0.9 }, { scale: 1, duration: 0.5, ease: "back.out(3)" }, 0)
            .fromTo(
              bulb,
              { boxShadow: "0 0 0px 0px rgba(255,248,230,0)" },
              { boxShadow: "0 0 60px 26px rgba(255,248,230,0.95)", duration: 0.07, yoyo: true, repeat: 1 },
              0,
            )
            .fromTo(flash, { opacity: 0 }, { opacity: 0.9, duration: 0.06, ease: "none" }, 0.02)
            .to(flash, { opacity: 0, duration: 0.7, ease: "power2.out" });
          return tl;
        };

        const show = contextSafe((idx: number) => {
          if (idx === current) return;
          const forward = idx > current;
          current = idx;
          steps.forEach((s, i) => gsap.to(s, { opacity: i === idx ? 1 : i < idx ? 0.7 : 0.45, duration: 0.45, overwrite: "auto" }));
          bars.forEach((b, i) => gsap.to(b, { scaleX: i <= idx ? 1 : 0, duration: 0.6, ease: "power3.out", overwrite: "auto" }));
          prints.forEach((p, i) => {
            if (i < idx || (i === idx && !forward)) {
              gsap.to(p, { autoAlpha: 1, scale: 1, xPercent: LANDING[i].x - 50, yPercent: LANDING[i].y, rotate: LANDING[i].rotate, duration: 0.6, ease: "power3.out", overwrite: "auto" });
            } else if (i === idx) {
              gsap
                .timeline({ delay: 0.12 })
                .set(p, { autoAlpha: 1, xPercent: -50, yPercent: -30, rotate: 0, scale: 0.55, filter: "brightness(2.2) saturate(0)" })
                .to(p, { yPercent: 18, scale: 0.8, duration: 0.35, ease: "power2.out" })
                .to(p, { xPercent: LANDING[i].x - 50, yPercent: LANDING[i].y, rotate: LANDING[i].rotate, scale: 1, duration: 0.9, ease: "back.out(1.4)" })
                .to(p, { filter: "brightness(1) saturate(1)", duration: 1.6, ease: "power1.out" }, "<");
            } else {
              gsap.to(p, { autoAlpha: 0, scale: 0.55, xPercent: -50, yPercent: -30, rotate: 0, duration: 0.4, ease: "power2.in", overwrite: "auto" });
            }
          });
          if (forward && idx >= 0) fire();
        });

        if (desktop && pin) {
          // Fire the first shot as the section arrives, before the pin starts.
          ScrollTrigger.create({ trigger: pin, start: "top 55%", onEnter: () => show(0), onLeaveBack: () => show(-1) });
          ScrollTrigger.create({
            trigger: pin,
            start: "top top",
            end: "+=190%",
            pin: true,
            snap: { snapTo: [0, 0.5, 1], duration: { min: 0.25, max: 0.6 }, ease: "power1.inOut", delay: 0.08 },
            onUpdate: (self) => show(Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length))),
          });
        } else if (stage) {
          ScrollTrigger.create({
            trigger: stage,
            start: "top 70%",
            once: true,
            onEnter: () => {
              STEPS.forEach((_, i) => gsap.delayedCall(i * 1.25, () => show(i)));
            },
          });
        }

        return () => {
          current = -1;
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="How it works" className="overflow-hidden bg-sand">
      <div
        data-pin
        className="mx-auto grid max-w-[1280px] items-center gap-x-16 gap-y-12 px-6 py-[clamp(72px,10vw,120px)] sm:px-10 lg:min-h-screen lg:grid-cols-[0.95fr_1.05fr] lg:px-16 lg:py-0"
      >
        <div className="order-2 flex flex-col gap-10 lg:order-1">
          <SectionHeading script="How it works" title="Booked in three taps" />
          <ol className="m-0 flex list-none flex-col gap-7 p-0">
            {STEPS.map((s, i) => (
              <li key={s.title} data-step className="relative flex gap-5 pt-6">
                <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-ink/15" />
                <span aria-hidden data-step-bar className="absolute inset-x-0 top-0 h-[2px] bg-crimson" />
                <span
                  className="flex size-12 shrink-0 items-center justify-center rounded-full font-display text-[18px] font-bold text-cream"
                  style={i === 1 ? claySurface("#f3dca0", "var(--color-gold)", "#8f6f2e", 150) : claySurface("#e38aa9", "var(--color-crimson)", "#6e2748", 150)}
                >
                  {i + 1}
                </span>
                <span className="flex flex-col gap-1.5">
                  <span className="font-display text-[clamp(22px,2.4vw,28px)] leading-tight text-ink">{s.title}</span>
                  <span className="text-[16px] leading-relaxed text-muted">{s.body}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div data-stage className="relative order-1 mx-auto aspect-[1/1.08] w-full max-w-[520px] lg:order-2">
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-[12%] rounded-full opacity-80 blur-3xl"
            style={{ background: "radial-gradient(circle at 50% 38%, rgba(201,162,74,0.28) 0%, rgba(178,61,110,0.14) 45%, rgba(178,61,110,0) 72%)" }}
          />
          {STEPS.map((s, i) => (
            <figure
              key={s.caption}
              data-print
              className="absolute left-1/2 top-[30%] z-10 m-0 flex w-[34%] flex-col gap-1.5 bg-porcelain p-[3.5%] pb-[9%] shadow-[0_26px_44px_-18px_rgba(40,10,20,0.45)]"
              style={{ transform: `translate(${LANDING[i].x - 50}%, ${LANDING[i].y}%) rotate(${LANDING[i].rotate}deg)` }}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-line">
                <Image src={s.img} alt={s.alt} fill sizes="180px" className="object-cover" style={{ objectPosition: s.pos }} />
              </div>
              <figcaption className="text-center font-display text-[clamp(10px,1.1vw,13px)] italic leading-tight text-bark/80">{s.caption}</figcaption>
            </figure>
          ))}
          <div data-camera className="absolute left-1/2 top-[2%] z-20 w-[64%] -translate-x-1/2">
            <ClayCamera className="w-full" />
          </div>
          <span
            aria-hidden
            data-flash
            className="pointer-events-none absolute -inset-[40%] z-30 opacity-0"
            style={{ background: "radial-gradient(circle at 50% 22%, rgba(255,252,244,1) 0%, rgba(255,246,230,0.75) 22%, rgba(255,246,230,0) 60%)" }}
          />
        </div>
      </div>
    </section>
  );
}
