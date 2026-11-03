"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { Button } from "@/components/luxe/button";
import { Field } from "@/components/luxe/booking-ui";
import { useLenis } from "@/components/luxe/providers";
import { onCheckout, type Booking, type CheckoutResult, type Customer } from "@/lib/booking";
import { BRAND } from "@/lib/content";

/** Shared by the Santa and Studio flows: contact details, validation, handing off to `onCheckout`. */
export function useCheckout() {
  const [customer, setCustomer] = useState<Customer>({ name: "", email: "", phone: "" });
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CheckoutResult | null>(null);

  const errors = {
    name: customer.name.trim().length < 2 ? "Please enter your name." : "",
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email) ? "" : "Please enter a valid email address.",
    phone: customer.phone.replace(/\D/g, "").length < 7 ? "Please enter a phone number we can reach." : "",
  };
  const valid = !errors.name && !errors.email && !errors.phone;

  const submit = useCallback(
    async (build: (c: Customer) => Booking) => {
      setTouched(true);
      if (!valid) return false;
      setBusy(true);
      setError(null);
      try {
        const res = await onCheckout(build({ name: customer.name.trim(), email: customer.email.trim(), phone: customer.phone.trim() }));
        if (res.checkoutUrl) {
          window.location.assign(res.checkoutUrl);
          return true; // leave the button busy while the browser navigates
        }
        setResult(res);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      }
      setBusy(false);
      return true;
    },
    [customer, valid],
  );

  return { customer, setCustomer, errors, touched, valid, busy, error, result, submit };
}

export type Checkout = ReturnType<typeof useCheckout>;

export function ContactFields({ flow }: { flow: Checkout }) {
  const { customer, setCustomer, errors, touched } = flow;
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Field label="Full name" autoComplete="name" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} error={touched ? errors.name : ""} />
      </div>
      <Field label="Email" type="email" inputMode="email" autoComplete="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} error={touched ? errors.email : ""} />
      <Field label="Phone" type="tel" inputMode="tel" autoComplete="tel" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} error={touched ? errors.phone : ""} />
    </div>
  );
}

export function CheckoutError({ message }: { message: string | null }) {
  return (
    <div aria-live="assertive">
      {message ? (
        <p className="m-0 border border-crimson bg-ivory px-4 py-3 text-[16px] font-bold text-crimson">{message}</p>
      ) : null}
    </div>
  );
}

/** Shown when the backend confirms without a payment link (demo mode, free holds). */
export function Confirmation({ result, summary }: { result: CheckoutResult; summary: string }) {
  return (
    <div className="border border-onyx bg-ivory px-6 py-12 text-center sm:px-10">
      <p className="eyebrow m-0 text-crimson">You are booked</p>
      <h3 className="mx-auto mt-4 max-w-[18ch] text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.05] tracking-[-0.02em]">See you at the studio.</h3>
      <p className="mx-auto mt-4 max-w-[44ch] text-[17px] text-muted">
        {summary} A confirmation is on its way to your inbox. Questions? Call {BRAND.phone}.
      </p>
      {result.bookingId ? <p className="eyebrow mt-6 text-muted">Reference {result.bookingId}</p> : null}
      <div className="mt-8 flex justify-center">
        <Button href="/" variant="outline">
          Back home
        </Button>
      </div>
    </div>
  );
}

/**
 * Tracks whether the booking section is on screen so the sticky bar only
 * appears while someone is actually booking.
 */
export function useSectionInView(ref: RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "0px 0px -12% 0px", threshold: 0.02 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return inView;
}

/** Jump to the top of the booking section whenever `stage` changes (not on first render). */
export function useScrollOnStage(ref: RefObject<HTMLElement | null>, stage: string) {
  const toTop = useScrollToSection(ref);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const id = requestAnimationFrame(toTop);
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);
}

function useScrollToSection(ref: RefObject<HTMLElement | null>) {
  const lenisRef = useLenis();
  const last = useRef(0);
  return useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const now = Date.now();
    if (now - last.current < 300) return;
    last.current = now;
    const sheet = el.closest<HTMLElement>("[data-modal-scroll]");
    if (sheet) {
      sheet.scrollTop = 0;
      return;
    }
    // Instant, after the new stage has rendered: the booking UI never animates layout.
    const lenis = lenisRef?.current;
    if (lenis) lenis.scrollTo(el, { offset: -80, immediate: true, force: true });
    else el.scrollIntoView({ behavior: "auto", block: "start" });
  }, [lenisRef, ref]);
}
