"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/components/motion/gsap";

interface ScrollFxProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  id?: string;
  "aria-label"?: string;
}

/**
 * Declarative scroll effects for server-rendered markup. Wrap a section and
 * mark descendants with data attributes:
 *
 * - `data-parallax="0.15"`  drifts against the scroll (pair with an oversized image)
 * - `data-clip`             wipes up from the bottom when it enters
 * - `data-count="39.99"`    counts up to its own value (`data-decimals`, `data-prefix`)
 * - `data-aperture`         opens like a camera iris as the section arrives
 * - `data-depth`            tips back into the page as it scrolls away
 *
 * The final state is the server-rendered state, so nothing is lost without JS
 * or with reduced motion.
 */
export function ScrollFx({ children, as, className, ...rest }: ScrollFxProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const q = <T extends HTMLElement>(sel: string) => [...(root.matches(sel) ? [root] : []), ...root.querySelectorAll<T>(sel)] as T[];
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        q("[data-parallax]").forEach((el) => {
          const speed = Number(el.dataset.parallax) || 0.15;
          gsap.fromTo(
            el,
            { yPercent: speed * 60 },
            { yPercent: speed * -60, ease: "none", scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true } },
          );
        });

        q("[data-clip]").forEach((el) => {
          gsap.fromTo(
            el,
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.inOut", scrollTrigger: { trigger: el, start: "top 85%", once: true } },
          );
        });

        const counters = q("[data-count]");
        const finals = counters.map((el) => el.textContent);
        counters.forEach((el) => {
          const target = Number(el.dataset.count);
          const decimals = Number(el.dataset.decimals ?? 0);
          const prefix = el.dataset.prefix ?? "";
          const state = { v: 0 };
          el.textContent = `${prefix}${(0).toFixed(decimals)}`;
          gsap.to(state, {
            v: target,
            duration: 1.6,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
            onUpdate: () => {
              el.textContent = `${prefix}${state.v.toFixed(decimals)}`;
            },
          });
        });
        const restoreCounters = () => counters.forEach((el, i) => (el.textContent = finals[i]));

        q("[data-aperture]").forEach((el) => {
          gsap.fromTo(
            el,
            { clipPath: "circle(9% at 50% 50%)" },
            { clipPath: "circle(78% at 50% 50%)", ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 15%", scrub: 0.6 } },
          );
        });

        q("[data-depth]").forEach((el) => {
          gsap.to(el, {
            rotateX: 16,
            scale: 0.84,
            yPercent: -8,
            autoAlpha: 0.25,
            transformPerspective: 1200,
            transformOrigin: "50% 100%",
            ease: "none",
            scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
          });
        });

        return restoreCounters;
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
