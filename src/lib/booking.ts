import { createBooking } from "./api";
import { EARLY_BIRD } from "./content";
import type { BookingResult, ExperienceId } from "./types";

/**
 * The single hand-off between the booking UI and payment.
 *
 * Every booking screen builds a typed `Booking` and calls `onCheckout(booking)`.
 * Replace the body of `onCheckout` to connect Square directly; nothing else in
 * the UI needs to change.
 */

// ── Prices (dollars) ─────────────────────────────────────────────────────────

export const PRICES = {
  santaPerChild: 34.99,
  selfieEarlyBird: 39.99,
  selfieRegular: 44.99,
  /** Family package: 4 or more paying guests are $29.99 each. Mirrors the backend bundle rule. */
  selfieFamily: { minGuests: 4, each: 29.99 },
  professional: 200,
  byoPhotographer: 100,
} as const;

export const LIMITS = {
  /** Matches maxQuantity on the backend's santa-one-child package. */
  santaMaxChildren: 6,
  selfieMaxGuests: 10,
  selfieMaxFreeGuests: 6,
} as const;

export type SessionId = Extract<ExperienceId, "selfie" | "pro" | "byo">;

export interface QuoteLine {
  label: string;
  amount: number;
}

export interface Quote {
  lines: QuoteLine[];
  total: number;
  /** Money saved by early bird or the family bundle, when it applies. */
  savings: number;
  savingsLabel?: string;
}

export const round2 = (n: number) => Math.round(n * 100) / 100;

export function selfieUnitPrice(earlyBird: boolean): number {
  return earlyBird ? PRICES.selfieEarlyBird : PRICES.selfieRegular;
}

/** Santa: a flat price per child. */
export function santaQuote(children: number): Quote {
  const total = round2(children * PRICES.santaPerChild);
  return {
    lines: [{ label: `${children} ${children === 1 ? "child" : "children"} × $${PRICES.santaPerChild}`, amount: total }],
    total,
    savings: 0,
  };
}

/** Selfie Studio Access: the lower of per-person and the family package, applied automatically. */
export function selfieQuote(guests: number, earlyBird: boolean, live?: { unit: number; regular: number }): Quote {
  const unit = live?.unit ?? selfieUnitPrice(earlyBird);
  const perPerson = round2(guests * unit);
  const f = PRICES.selfieFamily;
  const family = guests >= f.minGuests ? round2(guests * f.each) : Infinity;
  const useFamily = family < perPerson;
  const total = useFamily ? family : perPerson;
  const regular = round2(guests * (live?.regular ?? PRICES.selfieRegular));
  const lines: QuoteLine[] = useFamily
    ? [{ label: `Family package · ${guests} guests × $${f.each}`, amount: family }]
    : [{ label: `${guests} ${guests === 1 ? "guest" : "guests"} × $${unit}`, amount: perPerson }];
  const savings = round2(regular - total);
  return {
    lines,
    total,
    savings,
    savingsLabel: useFamily ? "Family package applied" : earlyBird ? "Early bird price" : undefined,
  };
}

export function sessionQuote(session: SessionId, guests: number, earlyBird: boolean, live?: { unit: number; regular: number }): Quote {
  if (session === "selfie") return selfieQuote(guests, earlyBird, live);
  if (session === "pro") return { lines: [{ label: "Professional Portrait Session", amount: PRICES.professional }], total: PRICES.professional, savings: 0 };
  return { lines: [{ label: "1 private hour", amount: PRICES.byoPhotographer }], total: PRICES.byoPhotographer, savings: 0 };
}

export function isEarlyBirdAt(now: number | null): boolean {
  return now !== null && now >= Date.parse(EARLY_BIRD.startsAt) && now <= Date.parse(EARLY_BIRD.endsAt);
}

// ── The booking handed to checkout ───────────────────────────────────────────

export interface Customer {
  name: string;
  email: string;
  phone: string;
}

export interface Booking {
  experience: ExperienceId;
  /** ISO date, e.g. "2026-11-27" */
  date: string;
  /** 24h start time, e.g. "13:00". Studio sessions only. */
  time?: string;
  /** Santa: number of children in the sitting. */
  children?: number;
  /** Studio: paying guests. */
  guests?: number;
  /** Studio: guests aged 3 and under, who are free. */
  freeGuests?: number;
  notes?: string;
  customer: Customer;
  /** What the guest saw. The server must recompute the real charge. */
  quote: Quote;
}

export interface CheckoutResult {
  bookingId?: string;
  /** Square hosted checkout URL. When present the guest is redirected. */
  checkoutUrl?: string;
}

export type CheckoutHandler = (booking: Booking) => Promise<CheckoutResult>;

/**
 * Default handler: sends the booking to the existing backend, which answers
 * with a Square checkout link. Swap this out to call Square yourself.
 */
export const onCheckout: CheckoutHandler = async (booking) => {
  const result: BookingResult = await createBooking({
    experience: booking.experience,
    date: booking.date,
    time: booking.time,
    // Santa is $34.99 per child: one per-child package, quantity = children,
    // so the backend charges exactly what the page shows (children × $34.99).
    guests: booking.experience === "santa" ? (booking.children ?? 1) : booking.guests,
    santaPackage: booking.experience === "santa" ? "one" : undefined,
    customer: booking.customer,
    // `notes` and `freeGuests` are not part of the current backend contract;
    // extend `createBooking` when the API supports them.
  });
  return { bookingId: result.bookingId, checkoutUrl: result.checkoutUrl };
};

// ── Dates ────────────────────────────────────────────────────────────────────

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export interface DateParts {
  iso: string;
  dow: string;
  month: string;
  day: string;
  label: string;
}

/** Timezone-safe: parses the ISO string directly, never through the local clock. */
export function dateParts(iso: string): DateParts {
  const [y, m, d] = iso.split("-").map(Number);
  const dow = DOW[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return { iso, dow, month: MONTHS[m - 1], day: String(d), label: `${dow}, ${MONTHS[m - 1]} ${d}` };
}

/** Every day of the studio season, Nov 27 to Dec 20. */
export function studioSeasonDates(): string[] {
  const out: string[] = [];
  for (let t = Date.UTC(2026, 10, 27); t <= Date.UTC(2026, 11, 20); t += 86_400_000) out.push(new Date(t).toISOString().slice(0, 10));
  return out;
}
