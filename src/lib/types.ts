export type ExperienceId = "santa" | "selfie" | "pro" | "byo";

export type SantaPackageId = "one" | "two" | "family";

export interface EventDate {
  /** ISO date, e.g. "2026-11-27" */
  iso: string;
  dow: string;
  month: string;
  day: string;
  label: string;
}

export interface Experience {
  id: ExperienceId;
  name: string;
  description: string;
  unit: string;
  /** Regular price in dollars. Santa uses the 1-child package price. */
  price: number;
  /** Whether this experience books a start time (studio) or walk-in (Santa). */
  timed: boolean;
  /** Whether the guest picks a party size or package. */
  hasQuantityStep: boolean;
}

export interface SantaPackage {
  id: SantaPackageId;
  name: string;
  description: string;
  price: number;
  /** Early bird price, when the package has one. */
  earlyBirdPrice?: number;
}

export interface BookingSelection {
  experience: ExperienceId;
  date: string;
  time?: string;
  guests?: number;
  santaPackage?: SantaPackageId;
}

export type PaymentMethod = "card";

export interface BookingRequest extends BookingSelection {
  customer: { name: string; email: string; phone: string };
  // Payment method and client-side total are intentionally excluded:
  // Square's hosted checkout handles payment method selection, and the
  // backend always recomputes the total from the package price.
}

export interface BookingResult {
  bookingId: string;
  status: "pending_payment" | "confirmed";
  /** Square hosted checkout URL, when the backend returns one. */
  checkoutUrl?: string;
}

export interface DayAvailability {
  date: string;
  available: boolean;
  /** Start times still open, e.g. ["11:00", "12:00"]. Studio only. */
  times?: string[];
}
