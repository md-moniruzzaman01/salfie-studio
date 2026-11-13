import { z } from "zod";
import { BRAND, DEFAULT_STUDIO_TIMES, EVENT_DATES } from "./content";
import type {
  BookingRequest,
  BookingResult,
  DayAvailability,
  ExperienceId,
  PhotographerAvailability,
  PhotographerBookingRequest,
  SantaPackageId,
} from "./types";

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
  // Absent on older backends — treated as "unknown" below.
  privateAvailable: z.boolean().optional(),
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
    if (experience === "santa") return EVENT_DATES.map((d) => ({ date: d.iso, available: true }));
    // The studio is open every day of the season, not just Santa's dates.
    const days: DayAvailability[] = [];
    for (let t = Date.UTC(2026, 10, 27); t <= Date.UTC(2026, 11, 20); t += 86_400_000) {
      days.push({ date: new Date(t).toISOString().slice(0, 10), available: true, times: DEFAULT_STUDIO_TIMES, privateTimes: DEFAULT_STUDIO_TIMES });
    }
    return days;
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
      // Professional / BYO need the whole hour to themselves.
      privateTimes: slots
        .filter((s) => s.remaining > 0 && s.privateAvailable !== false)
        .map((s) => s.startTime),
    };
  });
}

// ── Selfie Studio Access price (server is the source of truth) ───────────────

export interface SelfiePricing {
  /** Per-person price in force today (early bird applied), in cents. */
  unitCents: number;
  /** List price after any early bird ends, in cents. */
  regularCents: number;
  /** Last day (YYYY-MM-DD) of the early-bird price, or null when none is active. */
  earlyBirdEndDate: string | null;
}

const selfiePricingSchema = z.object({
  data: z.object({
    packages: z.array(
      z.object({
        key: z.string(),
        priceCents: z.number(),
        regularPriceCents: z.number().optional(),
        earlyBirdEndDate: z.string().nullish(),
      }),
    ),
  }),
});

let selfiePricingRequest: Promise<SelfiePricing | null> | null = null;

/**
 * The price checkout will actually charge, straight from the availability
 * endpoint (the server picks early bird vs regular by purchase date in the
 * event's timezone). Resolves null in demo mode or on any failure, so callers
 * fall back to the local constants. Cached for the life of the page.
 */
export function getSelfiePricing(): Promise<SelfiePricing | null> {
  if (MOCK_MODE) return Promise.resolve(null);
  if (selfiePricingRequest) return selfiePricingRequest;

  selfiePricingRequest = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/bookable-events/public/${EXPERIENCE_SLUG.selfie}/availability`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!res.ok) return null;
      const parsed = selfiePricingSchema.safeParse(await res.json());
      if (!parsed.success) return null;
      const pkg = parsed.data.data.packages.find((p) => p.key === PORTRAIT_PACKAGE_KEY.selfie);
      if (!pkg) return null;
      return {
        unitCents: pkg.priceCents,
        regularCents: pkg.regularPriceCents ?? pkg.priceCents,
        earlyBirdEndDate: pkg.earlyBirdEndDate ?? null,
      };
    } catch {
      return null;
    }
  })();

  // Don't cache a failure: the next component to mount may succeed.
  void selfiePricingRequest.then((p) => {
    if (p === null) selfiePricingRequest = null;
  });
  return selfiePricingRequest;
}

// ── Bookings ─────────────────────────────────────────────────────────────────

const bookingResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({ id: z.number() }),
  // https only: this value is passed to window.location.assign, so reject
  // javascript:/data: and plain-http URLs.
  checkoutUrl: z
    .string()
    .url()
    .refine((u) => {
      try {
        return new URL(u).protocol === "https:";
      } catch {
        return false;
      }
    }, "checkoutUrl must be https")
    .optional()
    .nullable(),
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

// ── Professional photographers (studio rental) ──────────────────────────────
//
// Separate BookableEvent from the holiday experiences above: working
// photographers renting the studio for their own client shoots, not a guest
// buying photos of themselves. Slug: professional-photographers.

const PHOTOGRAPHER_SLUG = "professional-photographers";

const photographerSlotSchema = z.object({
  startTime: z.string(),
  endTime: z
    .string()
    .nullish()
    .transform((v) => v ?? null),
  durationMin: z
    .number()
    .nullish()
    .transform((v) => v ?? null),
  remaining: z.number(),
});

const photographerDaySchema = z.object({
  date: z.string(),
  slots: z.array(photographerSlotSchema),
});

const photographerPackageSchema = z.object({
  key: z.string(),
  label: z.string(),
  description: z.string().nullable(),
  priceCents: z.number(),
  durationMin: z.number().nullable(),
});

const photographerAvailabilityResponseSchema = z.object({
  data: z.object({
    event: z.object({
      name: z.string(),
      location: z.string().nullable(),
      timezone: z.string(),
      capacity: z.number(),
      requiresPayment: z.boolean(),
    }),
    packages: z.array(photographerPackageSchema),
    days: z.array(photographerDaySchema),
  }),
});

const MOCK_PHOTOGRAPHER_SLOTS = [
  { startTime: "11:00", endTime: "12:00" },
  { startTime: "13:00", endTime: "14:00" },
  { startTime: "15:00", endTime: "16:00" },
  { startTime: "17:00", endTime: "18:00" },
];

export async function getPhotographerAvailability(): Promise<PhotographerAvailability> {
  if (MOCK_MODE) {
    await wait(250);
    const today = new Date();
    const days = Array.from({ length: 10 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() + i + 1);
      return {
        date: d.toISOString().slice(0, 10),
        slots: MOCK_PHOTOGRAPHER_SLOTS.map((s) => ({ ...s, durationMin: 60, remaining: 2 })),
      };
    });
    return {
      event: {
        name: "Professional Photographer Studio Access",
        location: BRAND.address,
        timezone: "America/New_York",
        capacity: 2,
        requiresPayment: true,
      },
      packages: [
        {
          key: "studio-hour",
          label: "Professional photographer access",
          description: "One hour of studio access",
          priceCents: 7500,
          durationMin: 60,
        },
      ],
      days,
    };
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/api/bookable-events/public/${PHOTOGRAPHER_SLUG}/availability`, {
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

  const parsed = photographerAvailabilityResponseSchema.safeParse(await res.json());
  if (!parsed.success) throw new ApiError("The booking service sent an unexpected response.");
  return parsed.data.data;
}

export interface PhotographerApplication {
  name: string;
  email: string;
  phone: string;
  portfolio: string;
  frequency: string;
  /** Anti-spam signals the backend's inquiry guard requires. */
  guard: { company: string; elapsedMs: number; turnstileToken: string };
}

/**
 * Photographer Partner Application → the backend's inquiry endpoint
 * (POST /api/inquiries), so it lands in the admin Inquiries inbox and emails
 * the team. Never faked: without an API URL it fails loudly.
 */
export async function submitPhotographerApplication(app: PhotographerApplication): Promise<void> {
  if (MOCK_MODE) {
    throw new ApiError("Applications can't be sent right now. Please email us instead.");
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/api/inquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name: app.name,
        email: app.email,
        phone: app.phone,
        subject: "Photographer Partner Application",
        message: [
          `Name / business: ${app.name}`,
          `Email: ${app.email}`,
          `Phone: ${app.phone}`,
          `Website / Instagram / portfolio: ${app.portfolio || "Not provided"}`,
          `Planned studio use: ${app.frequency}`,
        ].join("\n"),
        company: app.guard.company,
        elapsedMs: app.guard.elapsedMs,
        turnstileToken: app.guard.turnstileToken,
      }),
    });
  } catch {
    throw new ApiError("We couldn't reach the server. Check your connection and try again.");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError((body && typeof body.message === "string" && body.message) || "Something went wrong. Please try again.", res.status);
  }
}

/**
 * Is this email approved for the $75 photographer rate? Unlocks the booking
 * form; the server re-checks the email when the booking is created.
 */
export async function checkPhotographerAccess(email: string): Promise<boolean> {
  if (MOCK_MODE) throw new ApiError("Booking isn't available right now. Please try again later.");

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/api/bookable-events/public/${PHOTOGRAPHER_SLUG}/access`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email }),
    });
  } catch {
    throw new ApiError("We couldn't reach the booking service. Check your connection and try again.");
  }

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError((body && typeof body.message === "string" && body.message) || "Something went wrong. Please try again.", res.status);
  }
  return Boolean(body?.data?.approved);
}

export async function createPhotographerBooking(payload: PhotographerBookingRequest): Promise<BookingResult> {
  if (MOCK_MODE) {
    await wait(700);
    return { bookingId: `mock_${payload.date}_${payload.startTime}`, status: "confirmed" };
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/api/bookable-events/public/${PHOTOGRAPHER_SLUG}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        packageKey: payload.packageKey,
        dates: [payload.date],
        startTime: payload.startTime,
        quantity: 1,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        ...(payload.notes ? { notes: payload.notes } : {}),
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

// ── Marketing unsubscribe ────────────────────────────────────────────────────
// Campaign emails link to /unsubscribe/<token> on this site. The signed token
// is checked by the backend:
//   GET  /api/unsubscribe/:token/status   → current state, never changes it
//   POST /api/unsubscribe/:token/confirm  → opts the customer out of marketing

export type UnsubscribeState = "invalid" | "subscribed" | "unsubscribed";

export interface UnsubscribeView {
  state: UnsubscribeState;
  /** e.g. "j***@gmail.com", so people can see which address it is. */
  maskedEmail: string | null;
}

const unsubscribeSchema = z.object({
  state: z.enum(["invalid", "subscribed", "unsubscribed"]),
  maskedEmail: z.string().nullable(),
});

/** Token shape the email tool creates: "<customer id base36>.<43-char signature>". */
const TOKEN_SHAPE = /^[0-9a-z]{1,12}\.[A-Za-z0-9_-]{43}$/;

async function unsubscribeCall(token: string, action: "status" | "confirm"): Promise<UnsubscribeView> {
  if (!TOKEN_SHAPE.test(token)) return { state: "invalid", maskedEmail: null };
  if (MOCK_MODE) {
    await wait(400);
    return { state: action === "confirm" ? "unsubscribed" : "subscribed", maskedEmail: "j***@example.com" };
  }
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/api/unsubscribe/${encodeURIComponent(token)}/${action}`, {
      method: action === "confirm" ? "POST" : "GET",
      cache: "no-store",
    });
  } catch {
    throw new ApiError("We couldn't reach our server. Check your connection and try again.");
  }
  if (res.status === 404) return { state: "invalid", maskedEmail: null };
  if (!res.ok) {
    throw new ApiError(
      res.status === 429 ? "Too many tries. Please wait a minute and try again." : "Something went wrong on our side. Please try again.",
      res.status,
    );
  }
  const parsed = unsubscribeSchema.safeParse(await res.json().catch(() => null));
  if (!parsed.success) throw new ApiError("Our server sent an unexpected response.");
  return parsed.data;
}

export const getUnsubscribeStatus = (token: string) => unsubscribeCall(token, "status");
export const confirmUnsubscribe = (token: string) => unsubscribeCall(token, "confirm");
