"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/luxe/button";
import { BookingModalContext, PHONE_QUERY, useBookingModal, type ModalKind } from "@/components/luxe/booking-modal-context";
import { useLenis } from "@/components/luxe/providers";
import type { SessionId } from "@/lib/booking";

// This provider wraps every page, so the booking flows load only when the sheet
// first opens (phones only). Pages that show a flow inline import it directly.
function SheetLoading() {
  return (
    <div role="status" className="flex flex-1 items-center justify-center px-6 py-24 text-[15px] text-muted">
      Loading booking…
    </div>
  );
}
const SantaBooking = dynamic(() => import("@/components/luxe/santa-booking").then((m) => m.SantaBooking), { ssr: false, loading: SheetLoading });
const StudioBooking = dynamic(() => import("@/components/luxe/studio-booking").then((m) => m.StudioBooking), { ssr: false, loading: SheetLoading });

const TITLES: Record<ModalKind, string> = { santa: "Photos with Santa", studio: "Portrait Studio" };

/**
 * On phones, booking opens as a bottom sheet over the page instead of a long
 * scroll. It hosts the very same flow as the desktop page, so prices and
 * checkout never differ between the two.
 */
export function BookingModalProvider({ children }: { children: ReactNode }) {
  const [kind, setKind] = useState<ModalKind | null>(null);
  const [preset, setPreset] = useState<SessionId | undefined>();
  const lenisRef = useLenis();
  const panel = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const open = useCallback((k: ModalKind, opts?: { session?: SessionId }) => {
    if (!window.matchMedia(PHONE_QUERY).matches) return false;
    returnFocus.current = document.activeElement as HTMLElement | null;
    setPreset(opts?.session);
    setKind(k);
    return true;
  }, []);
  const close = useCallback(() => setKind(null), []);
  const value = useMemo(() => ({ open, close }), [open, close]);

  useEffect(() => {
    if (!kind) return;
    const lenis = lenisRef?.current;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setKind(null);
    window.addEventListener("keydown", onKey);
    // Leaving the phone breakpoint (rotation, resize) closes the sheet rather than stranding it.
    const mq = window.matchMedia(PHONE_QUERY);
    const onChange = () => !mq.matches && setKind(null);
    mq.addEventListener("change", onChange);
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
      returnFocus.current?.focus?.();
    };
  }, [kind, lenisRef]);

  return (
    <BookingModalContext.Provider value={value}>
      {children}
      {kind ? (
        <div className="fixed inset-0 z-[120] md:hidden" role="dialog" aria-modal="true" aria-label={`Book: ${TITLES[kind]}`}>
          <button type="button" aria-label="Close booking" onClick={close} className="absolute inset-0 animate-fade bg-onyx/70" tabIndex={-1} />
          <div
            ref={panel}
            tabIndex={-1}
            data-modal-scroll
            data-lenis-prevent
            className="absolute inset-x-0 bottom-0 flex max-h-[94svh] min-h-[82svh] animate-sheet-up flex-col overflow-y-auto overflow-x-hidden overscroll-contain bg-soft text-bark outline-none"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-line bg-soft/95 px-5 py-3 backdrop-blur-md">
              <div className="flex flex-col">
                <span className="eyebrow !tracking-[0.3em] text-crimson">Book</span>
                <span className="text-[17px] font-extrabold text-onyx">{TITLES[kind]}</span>
              </div>
              <button type="button" onClick={close} aria-label="Close" className="relative grid size-12 place-items-center text-onyx">
                <span className="absolute h-px w-7 rotate-45 bg-current" />
                <span className="absolute h-px w-7 -rotate-45 bg-current" />
              </button>
            </div>
            {kind === "santa" ? <SantaBooking mode="modal" /> : <StudioBooking mode="modal" initialSession={preset} />}
          </div>
        </div>
      ) : null}
    </BookingModalContext.Provider>
  );
}

/** The phone-only stand-in for the long booking section: one card that opens the sheet. */
export function BookLauncher({ kind, eyebrow, title, body, cta }: { kind: ModalKind; eyebrow: string; title: string; body: string; cta: string }) {
  const { open } = useBookingModal();
  return (
    <div className="bg-soft px-6 py-16">
      <div className="border border-onyx bg-ivory p-7">
        <p className="eyebrow m-0 text-crimson">{eyebrow}</p>
        {/* Not a heading: on /santa the desktop section below repeats this text as its own <h2>. */}
        <p className="m-0 mt-3 text-[28px] font-extrabold leading-[1.08] tracking-[-0.02em]">{title}</p>
        <p className="m-0 mt-3 text-[17px] leading-relaxed text-muted">{body}</p>
        <div className="mt-6">
          <Button onClick={() => open(kind)} className="w-full" magnetic={false}>
            {cta}
          </Button>
        </div>
      </div>
    </div>
  );
}

/** A sticky bar on phones: the price and one button. It slides in once the hero has scrolled away, so the opening screen stays clean. */
export function MobileBookBar({ kind, price, note, label }: { kind: ModalKind; price: ReactNode; note: string; label: string }) {
  const { open } = useBookingModal();
  const [shown, setShown] = useState(false);
  useEffect(() => {
    // Past the hero, and not while the booking section itself is on screen (it has its own buttons).
    const onScroll = () => {
      const book = document.getElementById("book")?.getBoundingClientRect();
      const inBook = !!book && book.top < window.innerHeight * 0.9 && book.bottom > window.innerHeight * 0.1;
      setShown(window.scrollY > window.innerHeight * 0.7 && !inBook);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      inert={!shown}
      className={`fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-line2 bg-soft/95 px-5 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 text-onyx backdrop-blur-md transition-transform duration-500 ease-[var(--ease-lux)] md:hidden ${shown ? "translate-y-0" : "translate-y-full"}`}
    >
      <div className="flex min-w-0 flex-col leading-tight">
        <span className="font-heavy text-[22px]">{price}</span>
        <span className="truncate font-caps text-[11px] uppercase tracking-[0.22em] text-muted">{note}</span>
      </div>
      <Button magnetic={false} onClick={() => open(kind)} className="shrink-0">
        {label}
      </Button>
    </div>
  );
}
