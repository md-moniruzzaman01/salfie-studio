"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ElementType, type ReactNode } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface RevealProps {
  children: ReactNode;
  /** Render element — defaults to a div. */
  as?: ElementType;
  /** Stagger in seconds. */
  delay?: number;
  className?: string;
}

/**
 * Pops its children into place — scale + fade, back-out ease — the first
 * time they enter the viewport, echoing the hero's product-assembly motion.
 * Honors prefers-reduced-motion.
 */
export function Reveal({ children, as, delay = 0, className }: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const node = ref.current;
      if (!node) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(node, { opacity: 1, scale: 1, y: 0 });
        return;
      }

      gsap.set(node, { opacity: 0, scale: 0.94, y: 26 });
      gsap.to(node, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        delay,
        ease: "back.out(1.5)",
        scrollTrigger: { trigger: node, start: "top 88%", once: true },
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
