"use client";

import { clsx } from "clsx";
import Image, { type StaticImageData } from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { useFloatStage } from "@/components/motion/use-float-stage";

interface FloatingCard {
  src: StaticImageData;
  alt: string;
  caption?: string;
  rotate: number;
  /** Absolute position + size within the stage (percentages read best). */
  style: CSSProperties;
  /** Depth in px — positive floats toward the viewer. */
  z?: number;
}

interface FloatingHeroProps {
  /** Soft ambient bokeh wash behind the floating objects; omit for a CSS spotlight (better on dark sections). */
  glow?: StaticImageData;
  /** The large centerpiece — a cut-out product shot, or a framed print. */
  primary: { src: StaticImageData; alt: string; caption?: string; position?: string; variant?: "cutout" | "print"; rotate?: number };
  /** Smaller instant-photo-style cards layered around the centerpiece. */
  cards?: FloatingCard[];
  /** Extra floating props (clay ornaments, stars, the camera) placed in the same 3D stage. */
  children?: ReactNode;
  /** Spotlight palette when no glow image is given. */
  tone?: "dark" | "light";
  className?: string;
}

const SPOTLIGHT = {
  dark: "radial-gradient(circle at 50% 48%, rgba(201,162,74,0.42) 0%, rgba(178,61,110,0.3) 38%, rgba(178,61,110,0) 70%)",
  light: "radial-gradient(circle at 50% 48%, rgba(238,196,204,0.95) 0%, rgba(243,217,220,0.7) 34%, rgba(201,162,74,0.16) 52%, rgba(243,217,220,0) 70%)",
};

/**
 * A cinematic "product launch" stage: a centerpiece photo on an ambient
 * glow, framed snapshots and clay props drifting at different depths, the
 * whole set tilting toward the pointer.
 */
export function FloatingHero({ glow, primary, cards = [], children, tone = "dark", className }: FloatingHeroProps) {
  const rootRef = useFloatStage<HTMLDivElement>();

  return (
    <div ref={rootRef} style={{ perspective: "1200px" }} className={clsx("relative mx-auto", className)}>
      {glow ? (
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-[20%] opacity-80 blur-2xl"
          style={{
            maskImage: "radial-gradient(ellipse at center, black 38%, transparent 72%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 38%, transparent 72%)",
          }}
        >
          <Image src={glow} alt="" fill sizes="900px" className="object-cover" />
        </div>
      ) : (
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-[8%] rounded-full blur-2xl"
          style={{ background: SPOTLIGHT[tone] }}
        />
      )}

      <div data-stage className="absolute inset-0 flex items-center justify-center [transform-style:preserve-3d]">
        {primary.variant === "print" ? (
          <figure
            data-float
            data-z={0}
            className="relative m-0 flex w-[52%] max-w-[320px] flex-col gap-2.5 bg-porcelain p-3 pb-6 shadow-[0_40px_70px_-24px_rgba(10,0,5,0.6)] sm:p-3.5 sm:pb-7"
            style={{ transform: `rotate(${primary.rotate ?? -3}deg)` }}
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-line">
              <Image src={primary.src} alt={primary.alt} fill sizes="340px" priority className="object-cover" style={{ objectPosition: primary.position ?? "50% 50%" }} />
            </div>
            {primary.caption ? <figcaption className="text-center font-display text-[15px] italic leading-none text-bark/80">{primary.caption}</figcaption> : null}
          </figure>
        ) : (
          <div
            data-float
            data-z={0}
            className="relative aspect-[4/3] w-[64%] max-w-[420px] drop-shadow-[0_44px_60px_rgba(25,10,15,0.3)]"
            style={{
              maskImage: "radial-gradient(ellipse at center, black 56%, transparent 90%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, black 56%, transparent 90%)",
            }}
          >
            <Image src={primary.src} alt={primary.alt} fill sizes="420px" priority className="object-contain" />
          </div>
        )}

        {cards.map((card) => (
          <figure
            key={card.alt}
            data-float
            data-z={card.z ?? 110}
            className="absolute m-0 flex flex-col gap-2 bg-porcelain p-2.5 pb-5 shadow-[0_28px_50px_-18px_rgba(25,10,15,0.42)] sm:p-3 sm:pb-6"
            style={{ ...card.style, transform: `rotate(${card.rotate}deg)` }}
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <Image src={card.src} alt={card.alt} fill sizes="220px" className="object-cover" />
            </div>
            {card.caption ? <figcaption className="text-center font-display text-[13px] italic leading-none text-bark/80">{card.caption}</figcaption> : null}
          </figure>
        ))}

        {children}
      </div>
    </div>
  );
}
