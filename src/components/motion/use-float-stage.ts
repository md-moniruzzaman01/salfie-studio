"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/components/motion/gsap";

/**
 * Idle bob on every [data-float] child, each parked at its own `data-z`
 * depth, plus a pointer tilt on the inner `[data-stage]` so the layers
 * separate in 3D. Honors prefers-reduced-motion; no tilt on touch.
 */
export function useFloatStage<T extends HTMLElement>() {
  const rootRef = useRef<T>(null);

  useGSAP(
    (_, contextSafe) => {
      const root = rootRef.current;
      if (!root || !contextSafe) return;
      const stage = root.querySelector<HTMLElement>("[data-stage]") ?? root;
      const layers = gsap.utils.toArray<HTMLElement>("[data-float]", root);
      layers.forEach((el) => gsap.set(el, { z: Number(el.dataset.z ?? 0) }));

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        layers.forEach((el, i) => {
          gsap.to(el, {
            y: `+=${12 + i * 5}`,
            rotate: `+=${i % 2 === 0 ? 1.6 : -1.6}`,
            duration: 3.2 + i * 0.7,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        });
      });
      mm.add(`${MOTION_OK} and (pointer: fine)`, () => {
        const rx = gsap.quickTo(stage, "rotateX", { duration: 0.9, ease: "power2.out" });
        const ry = gsap.quickTo(stage, "rotateY", { duration: 0.9, ease: "power2.out" });
        const onMove = contextSafe((e: PointerEvent) => {
          const rect = root.getBoundingClientRect();
          ry(((e.clientX - rect.left) / rect.width - 0.5) * 18);
          rx(((e.clientY - rect.top) / rect.height - 0.5) * -14);
        });
        const onLeave = contextSafe(() => {
          rx(0);
          ry(0);
        });
        root.addEventListener("pointermove", onMove);
        root.addEventListener("pointerleave", onLeave);
        return () => {
          root.removeEventListener("pointermove", onMove);
          root.removeEventListener("pointerleave", onLeave);
        };
      });
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return rootRef;
}
