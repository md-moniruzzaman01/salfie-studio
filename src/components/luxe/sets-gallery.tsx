"use client";

import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
import { clsx } from "clsx";
import Image, { type StaticImageData } from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { EASE, MaskLines, PillReveal } from "@/components/luxe/motion";
import { Script } from "@/components/luxe/home-sections";
import { useLenis } from "@/components/luxe/providers";
import { StripeMask } from "@/components/luxe/stripe";
import bakeryKids from "@/assets/photos/g-bakery-kids.jpeg";
import blackGoldGroup from "@/assets/photos/g-black-gold-group.jpeg";
import cabinCrew from "@/assets/photos/g-cabin-crew.jpeg";
import noirCouple from "@/assets/photos/g-noir-couple.jpeg";
import pinkFamily from "@/assets/photos/g-pink-family.jpeg";
import { SETS } from "@/lib/copy";

const GROUND = "#ffffff";

type Tile =
  | { kind: "image"; src: StaticImageData; alt: string; position?: string; wide?: boolean }
  | { kind: "video"; src: string; label: string };

/** The set photographs, in the studio's order. */
const setTiles: Tile[] = SETS.filter((s) => s.image).map((s) => ({
  kind: "image",
  src: s.image!,
  alt: s.alt ?? s.name,
  position: s.position,
}));

const guestTiles: Tile[] = [
  { kind: "image", src: bakeryKids, alt: "Three generations decorating a strawberry cake in the holiday bakery set", position: "50% 40%", wide: true },
  { kind: "video", src: "/videos/studio-1.mp4", label: "A short clip from a studio session" },
  { kind: "image", src: pinkFamily, alt: "A large family in shades of pink on a garland-lined staircase" },
  { kind: "image", src: blackGoldGroup, alt: "Four friends laughing beside a black and gold Christmas tree", position: "55% 50%", wide: true },
  { kind: "video", src: "/videos/studio-2.mp4", label: "Another short clip from a studio session" },
  { kind: "image", src: noirCouple, alt: "A couple in cream and charcoal in the black and gold set", position: "50% 30%" },
  { kind: "image", src: cabinCrew, alt: "A big family in red and plaid holding up a strawberry cake in the holiday bakery" },
];

/** Sets and guest moments alternate, so every row mixes the two. */
const TILES: Tile[] = setTiles.flatMap((t, i) => (guestTiles[i] ? [t, guestTiles[i]] : [t])).concat(guestTiles.slice(setTiles.length));

const noop = () => () => {};

const describe = (t: Tile) => (t.kind === "image" ? t.alt : t.label);

// ── Video tile: muted loop, only while on screen ─────────────────────────────

function Clip({ src, label, className }: { src: string; label: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const v = ref.current;
    if (!v || reduce) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.3 });
    io.observe(v);
    return () => io.disconnect();
  }, [reduce]);
  return <video ref={ref} src={`${src}#t=1`} aria-label={label} muted loop playsInline preload="metadata" className={className} />;
}

// ── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({ index, onClose, onStep }: { index: number; onClose: () => void; onStep: (d: 1 | -1) => void }) {
  const tile = TILES[index];
  const closeRef = useRef<HTMLButtonElement>(null);
  const lenisRef = useLenis();
  const reduce = useReducedMotion();
  const [dir, setDir] = useState<1 | -1>(1);

  const step = useCallback(
    (d: 1 | -1) => {
      setDir(d);
      onStep(d);
    },
    [onStep],
  );

  useEffect(() => {
    const lenis = lenisRef?.current;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      document.body.style.overflow = "";
      opener?.focus();
    };
  }, [lenisRef, onClose, step]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -400) step(1);
    else if (info.offset.x > 60 || info.velocity.x > 400) step(-1);
  };

  const navBtn =
    "grid size-12 shrink-0 place-items-center rounded-full border border-onyx/25 text-onyx transition-colors duration-300 hover:border-red hover:bg-red hover:text-ivory focus-visible:border-red sm:size-14";

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Gallery"
      data-lenis-prevent
      className="fixed inset-0 z-[90] flex flex-col bg-ivory text-onyx"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      <StripeMask height={8} />
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-8 sm:py-5">
        <p className="m-0 font-caps text-[13px] tracking-[0.2em] text-muted tabular-nums">
          {String(index + 1).padStart(2, "0")} <span className="text-onyx/30">/ {String(TILES.length).padStart(2, "0")}</span>
        </p>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close gallery" className={navBtn}>
          <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-24" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.figure
            key={index}
            custom={dir}
            className="m-0 flex h-full max-h-full w-full max-w-[1100px] touch-pan-y flex-col items-center justify-center"
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -80 }}
            transition={{ duration: 0.5, ease: EASE }}
            drag={reduce ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={onDragEnd}
          >
            <div className="relative min-h-0 w-full flex-1">
              {tile.kind === "image" ? (
                <Image src={tile.src} alt={tile.alt} fill quality={80} placeholder="blur" sizes="(min-width: 1100px) 1100px, 100vw" className="pointer-events-none select-none object-contain" />
              ) : (
                <video src={tile.src} aria-label={tile.label} autoPlay muted loop playsInline controls className="absolute inset-0 h-full w-full object-contain" />
              )}
            </div>
          </motion.figure>
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-x-4 top-1/2 hidden -translate-y-1/2 justify-between sm:inset-x-8 sm:flex">
          <button type="button" onClick={() => step(-1)} aria-label="Previous photo" className={clsx(navBtn, "pointer-events-auto")}>
            <Arrow dir={-1} />
          </button>
          <button type="button" onClick={() => step(1)} aria-label="Next photo" className={clsx(navBtn, "pointer-events-auto")}>
            <Arrow dir={1} />
          </button>
        </div>
      </div>

      {/* Phones: thumb-reach controls under the photo. Swiping also works. */}
      <div className="flex items-center justify-center gap-6 px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-4 sm:hidden">
        <button type="button" onClick={() => step(-1)} aria-label="Previous photo" className={navBtn}>
          <Arrow dir={-1} />
        </button>
        <span className="font-caps text-[11px] tracking-[0.2em] text-muted">Swipe</span>
        <button type="button" onClick={() => step(1)} aria-label="Next photo" className={navBtn}>
          <Arrow dir={1} />
        </button>
      </div>
      <div className="hidden h-6 sm:block" />
    </motion.div>
  );
}

function Arrow({ dir }: { dir: 1 | -1 }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d={dir === 1 ? "M4 12h16M14 6l6 6-6 6" : "M20 12H4M10 6l-6 6 6 6"} />
    </svg>
  );
}

// ── The section ──────────────────────────────────────────────────────────────

/**
 * The one gallery on the Portrait Studio page: the sets and guests' photos and
 * clips on a black ground, framed by the logo's pill stripes. Each tile is
 * unmasked by the logo's diagonal pills; tapping one opens it full screen.
 */
export function SetsGallery() {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const stepBy = useCallback((d: 1 | -1) => setOpen((i) => (i === null ? i : (i + d + TILES.length) % TILES.length)), []);
  // The lightbox renders into <body>, so it sits above the sticky header and booking bar.
  const mounted = useSyncExternalStore(noop, () => true, () => false);

  return (
    <section id="sets" aria-label="The sets" className="relative isolate overflow-hidden bg-ivory text-onyx">

      <div className="mx-auto flex max-w-[1360px] flex-col gap-[clamp(36px,5vw,64px)] px-3 py-[clamp(64px,9vw,128px)] sm:px-10 lg:px-16">
        <div className="grid items-end gap-6 px-1 sm:px-0 lg:grid-cols-[1fr_auto] lg:gap-16">
          <div className="flex flex-col gap-5">
            <p className="eyebrow m-0 text-crimson">The sets</p>
            <MaskLines as="h2" className="m-0 max-w-[16ch] text-[clamp(40px,6vw,80px)] font-extrabold text-onyx leading-[1.02] tracking-[-0.025em]" lines={["Eight sets,", <Script key="s">endless looks.</Script>]} />
          </div>
          <div className="flex flex-col gap-5 lg:max-w-[38ch] lg:pb-3">
            <p className="m-0 text-[17px] leading-relaxed text-muted">
              Your hour includes every set. Here they are, with a few of the photos and clips guests have made in them. Tap any photo to see it full size.
            </p>
            <span aria-hidden className="block h-px w-24 bg-gold/60" />
          </div>
        </div>

        <ul className="m-0 grid list-none grid-flow-row-dense grid-cols-2 gap-2 p-0 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {TILES.map((t, i) => (
            <li key={i} className={t.kind === "image" && t.wide ? "lg:col-span-2" : undefined}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`Open: ${describe(t)}`}
                data-cursor="view"
                className="group relative block h-full w-full text-left focus-visible:outline-offset-4"
              >
                <PillReveal cover={GROUND} pills={6} delay={(i % 4) * 0.08} className={clsx("h-full w-full bg-sand", t.kind === "image" && t.wide ? "aspect-[4/5] lg:aspect-auto" : "aspect-[4/5]")}>
                  {t.kind === "image" ? (
                    <Image
                      src={t.src}
                      alt=""
                      fill
                      quality={65}
                      placeholder="blur"
                      sizes={t.wide ? "(min-width: 1024px) 48vw, 50vw" : "(min-width: 1024px) 24vw, 50vw"}
                      className="object-cover transition-transform duration-[1400ms] ease-[var(--ease-lux)] group-hover:scale-[1.06]"
                      style={{ objectPosition: t.position ?? "50% 35%" }}
                    />
                  ) : (
                    <Clip src={t.src} label="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-lux)] group-hover:scale-[1.06]" />
                  )}

                  {/* Gold inner frame, as on a printed portrait mount. */}
                  <span aria-hidden className="pointer-events-none absolute inset-2 border border-gold/45 transition-[inset,border-color] duration-700 ease-[var(--ease-lux)] group-hover:inset-3 group-hover:border-gold/80 sm:inset-3 sm:group-hover:inset-4" />

                  {t.kind === "video" ? (
                    <span aria-hidden className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-onyx/65 px-2.5 py-1 font-caps text-[10px] tracking-[0.18em] text-ivory backdrop-blur-sm sm:right-5 sm:top-5">
                      <span className="size-1.5 animate-pulse rounded-full bg-red" />
                      Video
                    </span>
                  ) : null}

                </PillReveal>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {mounted
        ? createPortal(<AnimatePresence>{open !== null ? <Lightbox key="lightbox" index={open} onClose={close} onStep={stepBy} /> : null}</AnimatePresence>, document.body)
        : null}
    </section>
  );
}
