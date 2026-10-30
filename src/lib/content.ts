import type { EventDate, Experience, SantaPackage } from "./types";

export const BRAND = {
  name: "The Selfie Studio Experience",
  tagline: "Bigger. Better. More magical.",
  instagram: "@theselfiestudioexperience",
  instagramUrl: "https://www.instagram.com/theselfiestudioexperience",
  address: "77–79 Washington St, Bloomfield, NJ",
  phone: "973-695-8381",
  email: "events@casadeflorabar.com",
  season: "Nov 27 – Dec 20",
  santaHours: "11 AM – 7 PM",
} as const;

/** Early bird applies to purchases made Oct 15–31 (Eastern Time). */
export const EARLY_BIRD = {
  startsAt: "2026-10-15T04:00:00Z",
  endsAt: "2026-11-01T04:59:59Z",
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
    price: 39.99,
    timed: false,
    hasQuantityStep: true,
  },
  selfie: {
    id: "selfie",
    name: "Selfie Studio Access",
    description: "1 hour · 8 backdrops · your phone",
    unit: "per person",
    price: 24.99,
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
  { id: "one", name: "1 sitting · 1 child", description: "Two 4×6 prints + all digitals", price: 39.99, earlyBirdPrice: 34.99 },
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

export const HOME_FAQ = [
  { q: "Do I need a time slot for Santa?", a: "No. Your booking saves your date. Santa is here 11 AM – 7 PM, so walk in any time that day." },
  { q: "What comes with Photos with Santa?", a: "Two 4×6 prints and all digital images. One child is $39.99 ($34.99 early bird, Oct 15–31), 2 kids are $50, and a family of up to 6 is $75." },
  { q: "How does the Portrait Studio work?", a: "Selfie Studio Access is $24.99 per person for 1 hour with all 8 backdrops and unlimited phone photos. Professional photos are $200, and bringing your own photographer is $100 for 1 hour." },
  { q: "Which dates are available?", a: "November 27 and 28, and December 5, 6, 12, 13, 19 and 20." },
  { q: "Where are you?", a: "77–79 Washington St, Bloomfield, NJ." },
];

export const SANTA_FAQ = [
  { q: "Do we need a time slot?", a: "No. Your booking saves your date. Santa is here 11 AM – 7 PM, so walk in any time that day." },
  { q: "What comes with a sitting?", a: "Two 4×6 prints and all digital images." },
  { q: "Can siblings or the whole family join?", a: "Yes. 2 kids are $50, and a family of up to 6 people is $75 for one sitting." },
  { q: "How does the early bird work?", a: "Book 1 sitting for 1 child at $34.99 instead of $39.99 when you purchase between October 15 and 31." },
];

export const STUDIO_FAQ = [
  { q: "How long is a session?", a: "One hour, with access to all 8 backdrops." },
  { q: "Can I take my own photos?", a: "Yes. Selfie Studio Access is $24.99 per person and includes unlimited phone photos. You can also bring your own photographer for $100 for 1 hour." },
  { q: "What do I get with Professional Photos?", a: "Our photographer, high-quality edited images, and all digital photos sent to you, for $200." },
  { q: "Who is it for?", a: "Individuals, couples, families, friends and groups." },
];
