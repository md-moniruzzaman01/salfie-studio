"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore, type MutableRefObject, type ReactNode } from "react";
import { Intro } from "@/components/luxe/intro";

/** A ref, not state: consumers read `.current` inside effects and handlers, so no re-render is needed. */
const LenisContext = createContext<MutableRefObject<Lenis | null> | null>(null);
export const useLenis = () => useContext(LenisContext);

function useMedia(query: string): boolean {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Smooth scrolling. Off for reduced motion, where the browser's native scroll is kept. */
function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const instance = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    lenisRef.current = instance;
    let raf = 0;
    const loop = (time: number) => {
      instance.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // In-page anchors glide instead of jumping.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return; // e.g. a booking button that opens the modal instead
      const a = (e.target as Element | null)?.closest?.("a[href*='#']") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank") return;
      const url = new URL(a.href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;
      const el = document.querySelector(url.hash);
      if (!el) return;
      e.preventDefault();
      instance.scrollTo(el as HTMLElement, { offset: -72, duration: 1.4 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
      instance.destroy();
      lenisRef.current = null;
    };
  }, [reduce]);

  // A new page starts at the top, unless the link carried an anchor (e.g. /santa#book): go there instead.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    const target = window.location.hash ? document.querySelector<HTMLElement>(window.location.hash) : null;
    if (target) {
      const id = requestAnimationFrame(() => lenis.scrollTo(target, { offset: -72, immediate: true }));
      return () => cancelAnimationFrame(id);
    }
    lenis.scrollTo(0, { immediate: true });
  }, [pathname]);

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>;
}

type CursorMode = "idle" | "link" | "view";

/**
 * A thin ring that trails the mouse. Over links and buttons it swells; over a
 * gallery photo (data-cursor="view") it becomes a small red disc reading
 * "View". It never blends with the photograph. Desktop with a fine pointer only.
 */
function CursorRing() {
  const reduce = useReducedMotion();
  const finePointer = useMedia("(hover: hover) and (pointer: fine)");
  const enabled = finePointer && !reduce;
  const [mode, setMode] = useState<CursorMode>("idle");
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 420, damping: 34, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 420, damping: 34, mass: 0.35 });
  const first = useRef(true);

  useEffect(() => {
    if (!enabled) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      if (first.current) {
        first.current = false;
        setVisible(true);
      }
      const t = e.target as Element | null;
      if (t?.closest?.("[data-cursor='view']")) setMode("view");
      else if (t?.closest?.("a, button, [role='button'], [role='radio'], summary, input, textarea, select, label")) setMode("link");
      else setMode("idle");
    };
    const leave = () => setVisible(false);
    const enter = () => !first.current && setVisible(true);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    document.documentElement.addEventListener("pointerenter", enter);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.removeEventListener("pointerenter", enter);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;
  const view = mode === "view";
  return (
    <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[150] size-0" style={{ x: sx, y: sy }} animate={{ opacity: visible ? 1 : 0 }} transition={{ duration: 0.3 }}>
      <motion.span
        className="absolute left-0 top-0 -ml-[18px] -mt-[18px] size-9 rounded-full border border-ivory shadow-[0_0_0_1px_rgba(0,0,0,0.3)]"
        animate={{ scale: view ? 2.1 : mode === "link" ? 1.5 : 1, backgroundColor: view ? "rgba(165,12,20,0.94)" : "rgba(255,255,255,0)", borderColor: view ? "rgba(255,255,255,0)" : "rgba(255,255,255,1)" }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.span
        className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 font-caps text-[11px] tracking-[0.2em] text-ivory"
        animate={{ opacity: view ? 1 : 0, scale: view ? 1 : 0.6 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        View
      </motion.span>
    </motion.div>
  );
}

export function SiteProviders({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      {children}
      <CursorRing />
      <Intro />
    </SmoothScroll>
  );
}
