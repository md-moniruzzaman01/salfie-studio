import { z } from "zod";
import { DEFAULT_STUDIO_TIMES, EVENT_DATES } from "./content";
import type { BookingRequest, BookingResult, DayAvailability, ExperienceId, SantaPackageId } from "./types";

/**
 * Frontend client for the Casa de Flora backend.
 *
 * Set NEXT_PUBLIC_API_BASE_URL (e.g. https://api.casadeflora.com) to talk to
 * the real API. When unset the client runs in demo mode so the UI works end
 * to end without a backend.
 *
 * Public endpoints used:
 *   GET  /api/bookable-events/public/:slug/availability
 *   POST /api/bookable-events/public/:slug/bookings
 *
 * Two BookableEvent slugs must be configured in the admin:
 *   santa-photos      — packages: 1-child, 2-kids, family
 *   holiday-portraits — packages: selfie, pro, byo
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";
export const MOCK_MODE = BASE_URL === "";

// ── Experience → backend slug ────────────────────────────────────────────────

const EXPERIENCE_SLUG: Record<ExperienceId, string> = {
  santa: "santa-photos",
  selfie: "holiday-portraits",
  pro: "holiday-portraits",
  byo: "holiday-portraits",
};

// Santa UI package id → backend packageKey on the santa-photos event.
const SANTA_PACKAGE_KEY: Record<SantaPackageId, string> = {
  one: "santa-one-child",
  two: "santa-two-kids",
  family: "santa-family",
};

// Portrait Studio UI experience id → backend packageKey on the holiday-portraits event.
const PORTRAIT_PACKAGE_KEY: Record<"selfie" | "pro" | "byo", string> = {
  selfie: "portrait-selfie-access",
  pro: "portrait-professional",
  byo: "portrait-byop",
};

function toPackageKey(experience: ExperienceId, santaPackage?: SantaPackageId): string {
  if (experience === "santa") {
    return SANTA_PACKAGE_KEY[santaPackage ?? "one"];
  }
  return PORTRAIT_PACKAGE_KEY[experience];
}

// ── Error type ───────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ── Availability ─────────────────────────────────────────────────────────────

const slotSchema = z.object({
  startTime: z.string(),
  remaining: z.number(),
});

const daySchema = z.object({
  date: z.string(),
  remaining: z.number().nullable(),
  slots: z.array(slotSchema).optional(),
});

const availabilityResponseSchema = z.object({
  data: z.object({
    days: z.array(daySchema),
  }),
});

export async function getAvailability(experience: ExperienceId): Promise<DayAvailability[]> {
  if (MOCK_MODE) {
    await wait(250);
    return EVENT_DATES.map((d) => ({
      date: d.iso,
      available: true,
      times: experience === "santa" ? undefined : DEFAULT_STUDIO_TIMES,
    }));
  }

  const slug = EXPERIENCE_SLUG[experience];
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/api/bookable-events/public/${slug}/availability`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
  } catch {
    throw new ApiError("We couldn't reach the booking service. Check your connection and try again.");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message =
      (body && typeof body.message === "string" && body.message) ||
      "Couldn't load availability.";
    throw new ApiError(message, res.status);
  }

  const parsed = availabilityResponseSchema.safeParse(await res.json());
  if (!parsed.success) throw new ApiError("The booking service sent an unexpected response.");

  return parsed.data.data.days.map((d) => {
    const slots = d.slots ?? [];
    // Date-only events: remaining is a number. Slot-mode events: check slots.
    const available =
      d.remaining !== null
        ? d.remaining > 0
        : slots.some((s) => s.remaining > 0);
    return {
      date: d.date,
      available,
      // Only timed (slot-mode) events return open start times.
      times: slots.filter((s) => s.remaining > 0).map((s) => s.startTime),
    };
  });
}

// ── Bookings ─────────────────────────────────────────────────────────────────

const bookingResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({ id: z.number() }),
  checkoutUrl: z.string().url().optional().nullable(),
});

export async function createBooking(payload: BookingRequest): Promise<BookingResult> {
  if (MOCK_MODE) {
    await wait(700);
    return { bookingId: `mock_${payload.date}_${payload.experience}`, status: "confirmed" };
  }

  const slug = EXPERIENCE_SLUG[payload.experience];
  const packageKey = toPackageKey(payload.experience, payload.santaPackage);

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/api/bookable-events/public/${slug}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        packageKey,
        dates: [payload.date],
        startTime: payload.time ?? null,
        quantity: payload.guests ?? 1,
        name: payload.customer.name,
        email: payload.customer.email,
        phone: payload.customer.phone,
      }),
    });
  } catch {
    throw new ApiError("We couldn't reach the booking service. Check your connection and try again.");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message =
      (body && typeof body.message === "string" && body.message) ||
      "Something went wrong. Please try again.";
    throw new ApiError(message, res.status);
  }

  const parsed = bookingResponseSchema.safeParse(await res.json());
  if (!parsed.success) throw new ApiError("The booking service sent an unexpected response.");

  const { data, checkoutUrl } = parsed.data;
  return {
    bookingId: String(data.id),
    status: checkoutUrl ? "pending_payment" : "confirmed",
    checkoutUrl: checkoutUrl ?? undefined,
  };
}
