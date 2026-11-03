"use client";

import { animate, motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { clsx } from "clsx";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/** One easing for the whole site: slow in, soft landing. */
export const EASE = [0.22, 1, 0.36, 1] as const;

// ── Masked line-by-line text reveal ──────────────────────────────────────────

interface MaskLinesProps {
  /** Each entry is one authored line. */
  lines: ReactNode[];
  as?: "h1" | "h2" | "h3" | "p" | "div";
  className?: string;
  lineClassName?: string;
  delay?: number;
  /** Play on mount instead of waiting for scroll (use above the fold). */
  immediate?: boolean;
}

export function MaskLines({ lines, as = "div", className, lineClassName, delay = 0, immediate = false }: MaskLinesProps) {
  const Tag = as as ElementType;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const reduce = useReducedMotion();
  const show = reduce || immediate || inView;

  // Above the fold the reveal is pure CSS, so the headline paints without waiting for JavaScript.
  if (immediate) {
    return (
      <Tag ref={ref} className={className}>
        {lines.map((line, i) => (
          <span key={i} className={clsx("block overflow-hidden pb-[0.14em] -mb-[0.14em]", lineClassName)}>
            <span className="block animate-line" style={{ animationDelay: `${delay + i * 0.09}s` }}>
              {line}
            </span>
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className={clsx("block overflow-hidden pb-[0.14em] -mb-[0.14em]", lineClassName)}>
          <motion.span
            className="block will-change-transform"
            initial={reduce ? false : { y: "112%" }}
            animate={{ y: show ? "0%" : "112%" }}
            transition={{ duration: 1, ease: EASE, delay: delay + i * 0.09 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

// ── Simple fade-up ───────────────────────────────────────────────────────────

export function Fade({ children, delay = 0, y = 24, className }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

// ── Only fetch a photograph once it is about to scroll into view ─────────────

/**
 * Browsers start downloading lazy images far ahead of the viewport on slow
 * connections, which starves the hero photograph. Below-the-fold photos wait
 * until they are within `margin` of the screen.
 */
export function useNear<T extends HTMLElement>(margin = "250px") {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Wait for the page's own load (hero photo included) so nothing below ever competes with it.
    let loaded = document.readyState === "complete";
    let wanted = false;
    const reveal = () => {
      setNear(true);
      io.disconnect();
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        wanted = true;
        if (loaded) reveal();
      },
      { rootMargin: margin },
    );
    const onLoad = () => {
      loaded = true;
      if (wanted) reveal();
    };
    io.observe(el);
    if (!loaded) window.addEventListener("load", onLoad, { once: true });
    return () => {
      io.disconnect();
      window.removeEventListener("load", onLoad);
    };
  }, [margin]);
  return [ref, near] as const;
}

// ── Parallax photograph ──────────────────────────────────────────────────────

interface ParallaxImageProps {
  src: StaticImageData;
  alt: string;
  sizes: string;
  className?: string;
  position?: string;
  priority?: boolean;
  /** Percent of travel in each direction. */
  strength?: number;
}

export function ParallaxImage({ src, alt, sizes, className, position = "50% 50%", priority, strength = 7 }: ParallaxImageProps) {
  const [ref, near] = useNear<HTMLDivElement>();
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);
  return (
    <div ref={ref} className={clsx("relative overflow-hidden bg-sand", className)}>
      <motion.div className="absolute inset-0" style={reduce ? undefined : { y, scale: 1.16 }}>
        {priority || near ? <Image src={src} alt={alt} fill sizes={sizes} priority={priority} quality={60} className="object-cover" style={{ objectPosition: position }} /> : null}
      </motion.div>
    </div>
  );
}

// ── Pill unmask: diagonal rounded stripes retreat to reveal the photograph ───

interface PillRevealProps {
  children: ReactNode;
  /** Must match the ground the image sits on. */
  cover?: string;
  pills?: number;
  delay?: number;
  className?: string;
}

export function PillReveal({ children, cover = "#faf7f2", pills = 7, delay = 0, className }: PillRevealProps) {
  const [ref, near] = useNear<HTMLDivElement>("300px");
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const reduce = useReducedMotion();
  return (
    <div ref={ref} className={clsx("relative overflow-hidden", className)}>
      {children}
      {reduce ? null : (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {near ? (
            <div className="absolute left-1/2 top-1/2 flex h-[230%] w-[230%] -translate-x-1/2 -translate-y-1/2 rotate-45 flex-col">
              {Array.from({ length: pills }, (_, i) => (
                <motion.span
                  key={i}
                  className="-my-px block flex-1 rounded-full"
                  style={{ backgroundColor: cover, transformOrigin: "100% 50%" }}
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: inView ? 0 : 1 }}
                  transition={{ duration: 1.15, ease: EASE, delay: delay + i * 0.07 }}
                />
              ))}
            </div>
          ) : (
            // Far from the screen: one flat cover is enough and costs almost nothing.
            <div className="absolute inset-0" style={{ backgroundColor: cover }} />
          )}
        </div>
      )}
    </div>
  );
}

// ── Count up, once ───────────────────────────────────────────────────────────

export function CountUp({ to, decimals = 0, prefix = "", suffix = "", className }: { to: number; decimals?: number; prefix?: string; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(to);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, to, { duration: 1.6, ease: EASE, onUpdate: setValue });
    return () => controls.stop();
  }, [inView, reduce, to]);

  return (
    <span ref={ref} className={clsx("tabular-nums", className)}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
