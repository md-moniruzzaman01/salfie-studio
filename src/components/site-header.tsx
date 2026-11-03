"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { Button } from "@/components/luxe/button";
import { EASE } from "@/components/luxe/motion";
import { useLenis } from "@/components/luxe/providers";
import { BRAND } from "@/lib/content";
import { IMAGES } from "@/lib/images";
import type { ModalKind } from "@/components/luxe/booking-modal-context";
import type { ExperienceId } from "@/lib/types";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/santa", label: "Photos with Santa" },
  { href: "/portrait-studio", label: "Portrait Studio" },
  { href: "/photographers", label: "Photographers" },
  { href: "/#visit", label: "Plan your visit" },
];

interface SiteHeaderProps {
  /**
   * `dark`: the page opens on a photograph, so the header starts transparent
   * with ivory type and turns solid after scrolling. `light`: always solid.
   */
  tone?: "light" | "dark";
  /** Where "Book now" goes. Omit to open the general booking panel. */
  bookHref?: string;
  /** On phones, "Book now" opens this booking sheet instead of scrolling. */
  bookModal?: ModalKind;
  // Accepted for the pages that still pass them; the header ignores them.
  current?: string;
  bookPreset?: ExperienceId;
  bookLabel?: string;
}

const HEADER_H = 76;

export function SiteHeader({ tone = "light", bookHref, bookModal, bookLabel = "Book now" }: SiteHeaderProps) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const lenisRef = useLenis();
  const [scrolled, setScrolled] = useState(false);
  const [menuFor, setMenuFor] = useState<string | null>(null);
  // Open only for the page it was opened on, so navigating closes it without an effect.
  const menu = menuFor === pathname;
  const setMenu = (open: boolean | ((o: boolean) => boolean)) => setMenuFor((cur) => ((typeof open === "function" ? open(cur === pathname) : open) ? pathname : null));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on route change, lock scroll while open, close with Escape.
  useEffect(() => {
    if (!menu) return;
    const lenis = lenisRef?.current;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuFor(null);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menu, lenisRef]);

  const overHero = tone === "dark" && !scrolled && !menu;
  const isCurrent = (href: string) => (href === "/" ? pathname === "/" : href.startsWith("/#") ? false : pathname.startsWith(href));

  const target = bookHref ?? "/#experiences";
  const renderBook = (compact: boolean) => (
    <Button href={target} modal={bookModal} tone={overHero ? "dark" : "light"} magnetic={!compact} className={compact ? "min-h-10 px-4 text-[12px] tracking-[0.14em]" : "min-h-12 px-6"}>
      {compact ? "Book" : bookLabel}
    </Button>
  );

  return (
    <>
      <header
        className={clsx(
          "sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ease-out",
          tone === "dark" && "-mb-[76px]",
          overHero ? "border-b border-transparent bg-transparent text-ivory on-dark" : "border-b border-line bg-soft/92 text-onyx backdrop-blur-md",
        )}
        style={{ height: HEADER_H }}
      >
        {/* A soft scrim keeps the links legible over any photograph while the bar is transparent. */}
        <span
          aria-hidden
          className={clsx("pointer-events-none absolute inset-x-0 top-0 -z-10 h-[150%] bg-gradient-to-b from-onyx/65 via-onyx/25 to-transparent transition-opacity duration-500", overHero ? "opacity-100" : "opacity-0")}
        />
        <div className="mx-auto grid h-full max-w-[1360px] grid-cols-[auto_1fr] items-center gap-4 px-5 sm:px-10 lg:grid-cols-[1fr_auto_1fr] lg:px-16">
          <Link href="/" aria-label="The Selfie Studio Experience, home" className="block shrink-0 justify-self-start leading-none">
            <Image src={IMAGES.logo} alt="" height={48} priority className={clsx("h-11 w-auto transition-[outline-color] duration-500 sm:h-12", overHero ? "outline outline-1 outline-ivory/50" : "outline outline-1 outline-line")} />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-10 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isCurrent(item.href) ? "page" : undefined}
                className={clsx(
                  "group relative py-2 font-caps text-[13px] font-medium uppercase tracking-[0.24em] transition-colors duration-500",
                  overHero ? "text-ivory [text-shadow:0_1px_14px_rgba(0,0,0,0.55)]" : "text-onyx hover:text-crimson",
                  isCurrent(item.href) && !overHero && "text-crimson",
                )}
              >
                {item.label}
                <span
                  aria-hidden
                  className={clsx(
                    "absolute inset-x-0 -bottom-0.5 h-[2px] origin-left transition-transform duration-500 ease-out",
                    overHero ? "bg-red" : "bg-crimson",
                    isCurrent(item.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                  )}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-self-end gap-2 sm:gap-3">
            <div className="hidden sm:block">{renderBook(false)}</div>
            <div className="sm:hidden">{renderBook(true)}</div>
            <button
              type="button"
              aria-expanded={menu}
              aria-controls="mobile-menu"
              aria-label={menu ? "Close menu" : "Open menu"}
              onClick={() => setMenu((m) => !m)}
              className="relative grid size-12 place-items-center lg:hidden"
            >
              <span className={clsx("absolute h-px w-7 bg-current transition-transform duration-500", menu ? "rotate-45" : "-translate-y-[5px]")} />
              <span className={clsx("absolute h-px w-7 bg-current transition-transform duration-500", menu ? "-rotate-45" : "translate-y-[5px]")} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menu ? (
          <motion.div
            id="mobile-menu"
            data-lenis-prevent
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="on-dark fixed inset-0 z-40 flex flex-col bg-onyx px-6 pb-8 pt-28 text-ivory sm:px-10 lg:hidden"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center gap-1">
              {NAV.map((item, i) => (
                <div key={item.href} className="overflow-hidden">
                  <motion.div
                    initial={reduce ? false : { y: "105%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "105%" }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.12 + i * 0.07 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMenu(false)}
                      aria-current={isCurrent(item.href) ? "page" : undefined}
                      className={clsx("block min-h-14 py-2 font-heavy text-[clamp(34px,10.5vw,64px)] uppercase leading-[1.05] tracking-[-0.01em]", isCurrent(item.href) ? "text-red" : "text-ivory")}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                </div>
              ))}
            </nav>
            <motion.div
              className="flex flex-col gap-5 border-t border-ivory/20 pt-6"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
            >
              <p className="eyebrow m-0 text-ivory/70">
                {BRAND.address}
                <br />
                {BRAND.season}
              </p>
              <Button href={target} modal={bookModal} tone="dark" magnetic={false} className="w-full">
                {bookLabel}
              </Button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
