import { EARLY_BIRD, EXPERIENCES, SANTA_PACKAGES } from "./content";
import type { BookingSelection } from "./types";

export function isEarlyBird(now: number): boolean {
  return now >= Date.parse(EARLY_BIRD.startsAt) && now <= Date.parse(EARLY_BIRD.endsAt);
}

export function daysLeftInEarlyBird(now: number): number {
  return Math.max(0, Math.ceil((Date.parse(EARLY_BIRD.endsAt) - now) / 86_400_000));
}

export function formatMoney(amount: number): string {
  return amount % 1 === 0 ? `$${amount}` : `$${amount.toFixed(2)}`;
}

export function formatTime(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hour}:${String(m).padStart(2, "0")} ${suffix}` : `${hour} ${suffix}`;
}

export interface Quote {
  total: number;
  savings: number;
  summary: string;
}

/** Client-side estimate shown to the guest. The backend is the source of truth for the charge. */
export function quote(selection: Partial<BookingSelection>, earlyBird: boolean): Quote {
  switch (selection.experience) {
    case "santa": {
      const pack = SANTA_PACKAGES.find((p) => p.id === (selection.santaPackage ?? "one")) ?? SANTA_PACKAGES[0];
      const price = earlyBird && pack.earlyBirdPrice ? pack.earlyBirdPrice : pack.price;
      return { total: price, savings: pack.price - price, summary: pack.name };
    }
    case "selfie": {
      const guests = selection.guests ?? 1;
      return { total: guests * EXPERIENCES.selfie.price, savings: 0, summary: `${guests} ${guests === 1 ? "guest" : "guests"} · 1 hour` };
    }
    case "pro":
      return { total: EXPERIENCES.pro.price, savings: 0, summary: "Session with our photographer" };
    case "byo":
      return { total: EXPERIENCES.byo.price, savings: 0, summary: "1 private hour" };
    default:
      return { total: 0, savings: 0, summary: "" };
  }
}

export function toCents(amount: number): number {
  return Math.round(amount * 100);
}
