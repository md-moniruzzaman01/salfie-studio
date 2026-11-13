import type { EventDate, Experience, SantaPackage } from "./types";

export const BRAND = {
  name: "The Selfie Studio Experience",
  tagline: "Bigger. Better. More magical.",
  instagram: "@theselfiestudioexperience",
  instagramUrl: "https://www.instagram.com/theselfiestudioexperience",
  address: "77–79 Washington St, Bloomfield, NJ",
  phone: "973-695-8381",
  email: "info@theselfiestudioexperience.com",
  season: "Nov 27 – Dec 20",
  santaHours: "11 AM – 7 PM",
} as const;

/** Early bird applies to purchases made before November 27, through 11:59 PM Nov 26 (Eastern Time). */
export const EARLY_BIRD = {
  startsAt: "2026-10-15T04:00:00Z",
  endsAt: "2026-11-27T04:59:59Z",
} as const;

export const EVENT_DATES: EventDate[] = [
  { iso: "2026-11-27", dow: "Fri", month: "Nov", day: "27", label: "Fri, Nov 27" },
  { iso: "2026-11-28", dow: "Sat", month: "Nov", day: "28", label: "Sat, Nov 28" },
  { iso: "2026-12-05", dow: "Sat", month: "Dec", day: "5", label: "Sat, Dec 5" },
  { iso: "2026-12-06", dow: "Sun", month: "Dec", day: "6", label: "Sun, Dec 6" },
  { iso: "2026-12-12", dow: "Sat", month: "Dec", day: "12", label: "Sat, Dec 12" },
  { iso: "2026-12-13", dow: "Sun", month: "Dec", day: "13", label: "Sun, Dec 13" },
  { iso: "2026-12-19", dow: "Sat", month: "Dec", day: "19", label: "Sat, Dec 19" },
  { iso: "2026-12-20", dow: "Sun", month: "Dec", day: "20", label: "Sun, Dec 20" },
];

/** Studio start times shown when the backend gives no availability. Confirm with the client. */
export const DEFAULT_STUDIO_TIMES = ["11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

export const EXPERIENCES: Record<Experience["id"], Experience> = {
  santa: {
    id: "santa",
    name: "Photos with Santa",
    description: "2 4×6 prints + all digitals",
    unit: "per sitting",
    price: 34.99,
    timed: false,
    hasQuantityStep: true,
  },
  selfie: {
    id: "selfie",
    name: "Selfie Studio Access",
    description: "1 hour · 8 backdrops · your phone",
    unit: "per person",
    price: 44.99,
    timed: true,
    hasQuantityStep: true,
  },
  pro: {
    id: "pro",
    name: "Professional Photos",
    description: "Our photographer · all digitals",
    unit: "per session",
    price: 200,
    timed: true,
    hasQuantityStep: false,
  },
  byo: {
    id: "byo",
    name: "Bring Your Own Photographer",
    description: "Private hour · all 8 backdrops",
    unit: "for 1 hour",
    price: 100,
    timed: true,
    hasQuantityStep: false,
  },
};

export const SANTA_PACKAGES: SantaPackage[] = [
  { id: "one", name: "1 sitting · 1 child", description: "Two 4×6 prints + all digitals", price: 34.99 },
  { id: "two", name: "2 kids", description: "Two children in one sitting", price: 50 },
  { id: "family", name: "Family", description: "Up to 6 people in one sitting", price: 75 },
];

export const BACKDROPS = [
  { num: "01", name: "The golden doorway", image: "door" as const },
  { num: "02", name: "The carousel", image: "carousel" as const },
  { num: "03", name: "[Set name]" },
  { num: "04", name: "[Set name]" },
  { num: "05", name: "[Set name]" },
  { num: "06", name: "[Set name]" },
  { num: "07", name: "[Set name]" },
  { num: "08", name: "[Set name]" },
];

// FAQ copy lives in ./copy.ts (HOME_FAQ, SANTA_FAQ, STUDIO_FAQ).

// ── Professional photographers (studio rental) ─────────────────────────────
// A separate service from the regular holiday packages above: approved
// photographers rent the studio for their own client sessions at $75/hour.

/** Studio hours shown on the photographer pages (the backend enforces them). */
export const PHOTOGRAPHER_HOURS: { day: string; hours: string; sub?: string }[] = [
  { day: "Tuesday – Friday", hours: "11:00 AM – 8:00 PM" },
  { day: "Saturday – Sunday", hours: "10:00 AM – 12:00 PM", sub: "6:00 PM – 10:00 PM" },
  { day: "November 16 & 27", hours: "10:00 AM – 8:00 PM", sub: "Special availability" },
  { day: "Monday", hours: "Closed" },
];

export const PHOTOGRAPHER_BOOKING_START = "Bookings open November 16, 2026";

export const PHOTOGRAPHER_HIGHLIGHTS = [
  { title: "Beautifully designed holiday sets", body: "Styled holiday backdrops, ready the moment you walk in." },
  { title: "Dedicated one-hour studio access", body: "A full 60 minutes on set for your session." },
  { title: "Special partner pricing", body: "An exclusive $75 hourly rate for approved partners." },
  { title: "Photograph your own clients", body: "Your clients, your direction, your gallery." },
  { title: "Flexible scheduling", body: "Book any open hour during studio hours." },
];

export const PHOTOGRAPHER_INCLUDES = [
  "Exclusive access to holiday studio sets",
  "Bring your own photography equipment",
  "Manage your own photography clients",
  "Advance approval required",
];

/** "Please note" terms from the client — keep the wording intact. */
export const PHOTOGRAPHER_TERMS = [
  "This $75 hourly rate is available to approved professional photographers only.",
  "Prior approval is required before booking.",
  "This rate is not available to individual customers, families, or guests seeking holiday portraits.",
  "Photographers must provide their own photography equipment and manage their own client sessions.",
  "Unauthorized bookings will be subject to cancellation and refund in accordance with our booking policy.",
];

export const PHOTOGRAPHER_FREQUENCIES = ["1–2 sessions", "3–5 sessions", "Weekly", "Multiple times per week"] as const;
