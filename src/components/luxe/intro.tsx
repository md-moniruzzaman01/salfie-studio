"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { EASE } from "@/components/luxe/motion";

const FLAG = "sse-intro-seen";

/** Red and crimson pills, like the logo, drawn in a rotated frame so they read top-left to bottom-right. */
const PILLS = [
  { y: 6, w: 52, c: "#ed1c24", x0: -900 },
  { y: 74, w: 44, c: "#a50c14", x0: -1100 },
  { y: 134, w: 56, c: "#ed1c24", x0: -800 },
  { y: 206, w: 46, c: "#a50c14", x0: -1000 },
  { y: 270, w: 54, c: "#ed1c24", x0: -950 },
  { y: 340, w: 44, c: "#a50c14", x0: -1050 },
  { y: 402, w: 52, c: "#ed1c24", x0: -850 },
  { y: 470, w: 46, c: "#a50c14", x0: -1000 },
  { y: 532, w: 54, c: "#ed1c24", x0: -900 },
];

/**
 * The logo builds itself: stripes slide in diagonally, SELFIE rises letter by
 * letter, "Studios" draws on like a pen stroke, EXPERIENCE tracks in. Under
 * 2.2 seconds, skippable, shown once per session on the home page only.
 */
export function Intro() {
  const pathname = usePathname();
  const [open, setOpen] = useState(pathname === "/");

  const close = useCallback(() => {
    try {
      sessionStorage.setItem(FLAG, "1");
    } catch {
      /* private mode: show again next time, no harm */
    }
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem(FLAG) === "1";
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const skip = seen || reduce;
    // Repeat visits and reduced motion are already hidden by CSS; unmount on the next tick.
    const timer = window.setTimeout(close, skip ? 0 : 1800);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") close();
    };
    if (!skip) window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          data-intro
          aria-hidden
          className="fixed inset-0 z-[200] flex items-center justify-center bg-ivory"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          onClick={close}
        >
          <div className="relative aspect-[5/4] w-[min(88vw,560px)]">
            {/* diagonal pill stripes */}
            <svg viewBox="0 0 600 480" className="absolute inset-0 h-full w-full overflow-hidden" role="presentation">
              <g transform="rotate(45 300 240)">
                {PILLS.map((p, i) => (
                  <motion.rect
                    key={i}
                    x={-260}
                    y={p.y - 50}
                    width={1120}
                    height={p.w}
                    rx={p.w / 2}
                    fill={p.c}
                    initial={{ x: p.x0 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.85, ease: EASE, delay: i * 0.04 }}
                  />
                ))}
              </g>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="flex font-heavy text-[clamp(64px,22vw,150px)] leading-[0.9] text-onyx" style={{ textShadow: "0 0 0.4em rgba(255,255,255,0.35)" }}>
                {"SELFIE".split("").map((ch, i) => (
                  <span key={i} className="block overflow-hidden pb-[0.08em]">
                    <motion.span
                      className="block"
                      initial={{ y: "105%" }}
                      animate={{ y: "0%" }}
                      transition={{ duration: 0.6, ease: EASE, delay: 0.4 + i * 0.06 }}
                    >
                      {ch}
                    </motion.span>
                  </span>
                ))}
              </span>

              {/* "Studios", drawn on with a stroke before it fills in */}
              <svg viewBox="0 0 300 90" className="pointer-events-none absolute left-1/2 top-[41%] w-[72%] -translate-x-1/2 overflow-visible" role="presentation">
                <motion.text
                  x="150"
                  y="62"
                  textAnchor="middle"
                  className="font-script"
                  style={{ fontSize: 76, fontFamily: "var(--font-script)" }}
                  stroke="#1d961e"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ strokeDasharray: 520, strokeDashoffset: 520, fill: "rgba(29,150,30,0)" }}
                  animate={{ strokeDashoffset: 0, fill: "rgba(29,150,30,1)" }}
                  transition={{ strokeDashoffset: { duration: 0.7, ease: "easeInOut", delay: 0.75 }, fill: { duration: 0.35, delay: 1.3 } }}
                >
                  Studios
                </motion.text>
              </svg>

              <motion.span
                className="mt-[2.2vw] font-caps text-[clamp(11px,2.8vw,18px)] font-light uppercase text-onyx [text-shadow:0_0_10px_#fff,0_0_18px_#fff]"
                initial={{ opacity: 0, letterSpacing: "1.1em" }}
                animate={{ opacity: 1, letterSpacing: "0.5em" }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.95 }}
              >
                EXPERIENCE
              </motion.span>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            className="eyebrow absolute bottom-8 right-6 min-h-12 px-3 text-onyx/70 transition-colors hover:text-onyx sm:right-10"
          >
            Skip
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
