"use client";

import { clsx } from "clsx";
import { useRef, type ReactNode } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/components/motion/gsap";

interface TiltProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  /** Max rotation in degrees. */
  max?: number;
  /** Adds a soft specular glare that follows the pointer. */
  glare?: boolean;
}

/**
 * Card that leans toward the pointer in 3D. Children marked `data-pop`
 * lift off the surface (translateZ) so the card reads as layered.
 * Fine pointers only; static under reduced motion.
 */
export function Tilt({ children, className, innerClassName, max = 8, glare = false }: TiltProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = root.current;
      const inner = el?.firstElementChild as HTMLElement | null;
      if (!el || !inner || !contextSafe) return;
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (pointer: fine)`, () => {
        const shine = el.querySelector<HTMLElement>("[data-glare]");
        const rx = gsap.quickTo(inner, "rotateX", { duration: 0.6, ease: "power3.out" });
        const ry = gsap.quickTo(inner, "rotateY", { duration: 0.6, ease: "power3.out" });
        gsap.set(el.querySelectorAll("[data-pop]"), { z: 40 });

        const move = contextSafe((e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          rx(py * -max);
          ry(px * max);
          if (shine) gsap.to(shine, { opacity: 1, x: px * r.width * 0.6, y: py * r.height * 0.6, duration: 0.5 });
        });
        const leave = contextSafe(() => {
          rx(0);
          ry(0);
          if (shine) gsap.to(shine, { opacity: 0, duration: 0.5 });
        });
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={clsx("[perspective:1100px]", className)}>
      <div className={clsx("relative h-full [transform-style:preserve-3d]", innerClassName)}>
        {children}
        {glare ? (
          <span
            aria-hidden
            data-glare
            className="pointer-events-none absolute left-1/2 top-1/2 -ml-[35%] -mt-[35%] size-[70%] rounded-full opacity-0 mix-blend-soft-light blur-2xl"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 70%)" }}
          />
        ) : null}
      </div>
    </div>
  );
}
