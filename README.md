# The Selfie Studio Experience · Holiday site (frontend)

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4.

Pages:

| Route     | What it is                                                                 |
| --------- | -------------------------------------------------------------------------- |
| `/`       | Landing: photo-booth hero, experience panels, gallery, pricing, FAQ        |
| `/santa`  | Photos with Santa: dates, packages, early bird, steps, FAQ                 |
| `/studio` | The Holiday Portrait Experience: 8-backdrop gallery, 3 session packages    |

Every "Book" button opens one shared booking panel (bottom sheet on phones, side drawer on desktop):
experience → date (+ time for studio) → sitting size or guests → pay (Apple Pay, Google Pay, card) → confirmation.

## Getting started

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_BASE_URL
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

Without `NEXT_PUBLIC_API_BASE_URL` the site runs in **demo mode**: availability and bookings are mocked, so the whole flow can be clicked through.

## Connecting the existing backend

All network calls live in `src/lib/api.ts`. Components never call `fetch` directly, so wiring the backend means editing one file:

- `ENDPOINTS` — paths for availability and booking creation.
- `availabilitySchema`, `bookingResultSchema` — Zod schemas for responses. Map field names here if yours differ.

Expected contract (adjust to match your API):

```http
GET  /availability?experience=santa|selfie|pro|byo
→ { "dates": [ { "date": "2026-11-27", "available": true, "times": ["11:00", "12:00"] } ] }

POST /bookings
{
  "experience": "selfie",
  "date": "2026-11-28",
  "time": "13:00",            // studio only
  "guests": 2,                // selfie only
  "santaPackage": "one",      // santa only: one | two | family
  "customer": { "name": "…", "email": "…" },
  "paymentMethod": "card",    // card | apple_pay | google_pay
  "expectedTotalCents": 4998  // what the guest saw; re-price on the server
}
→ { "bookingId": "…", "status": "pending_payment", "checkoutUrl": "https://square.link/…" }
```

If the response includes `checkoutUrl` (e.g. a Square hosted checkout link), the guest is redirected to it. Otherwise the confirmation screen is shown. Prices on the frontend are display estimates only; **the backend must calculate the real charge**.

Apple Pay and Google Pay buttons send `paymentMethod` to the backend. For in-page wallet payments, add the Square Web Payments SDK in `src/components/booking/booking-sheet.tsx` (`pay()`).

## Content and prices

`src/lib/content.ts` holds dates, prices, Santa packages, backdrop names, FAQs and contact details. Early bird dates are in `EARLY_BIRD`.

## Images

`src/assets/*.jpg` are crops of the client's flyers and are low resolution. Replace them with the original photos using the same file names. Backdrops 03–08 show "Photo to come" until you add images and names in `BACKDROPS` (`src/lib/content.ts`) and `src/lib/images.ts`.

## Before launch

- Real guest reviews in `Reviews` (`src/components/sections.tsx`) — placeholders today.
- Confirm studio start times (`DEFAULT_STUDIO_TIMES`), the street address, and the contact email for the new domain.
- Add `/terms` and `/privacy` pages.

## Project structure

```
src/
  app/                 layout, globals.css (brand tokens), pages
  components/
    booking/           BookingProvider (context), BookingSheet, BookButton
    photo-booth-hero   animated landing hero
    backdrop-accordion studio set gallery
    sections.tsx       shared marketing sections
  lib/
    api.ts             backend client (edit here)
    content.ts         copy, prices, dates
    pricing.ts         quote + early bird helpers
    use-now.ts         client-only clock (Cache Components safe)
```

Notes for this Next.js version: `cacheComponents` is on, so anything that reads the current time runs in the browser (`useNow`). Turbopack is the default bundler.
