import type { Metadata } from "next";
import { BRAND, EVENT_DATES } from "./content";
import { PRICES } from "./booking";

/**
 * Search and social metadata in one place.
 *
 * Everything here must stay factual: only details the site already states
 * (address, phone, dates, prices, season opening hours). Do not add ratings,
 * reviews, map coordinates or anything the business has not confirmed.
 */

export const SITE = {
  url: "https://theselfiestudioexperience.com",
  name: BRAND.name,
  locale: "en_US",
  phoneE164: "+1-973-695-8381",
  address: {
    streetAddress: "77–79 Washington Street",
    addressLocality: "Bloomfield",
    addressRegion: "NJ",
    postalCode: "07003",
    addressCountry: "US",
  },
  /** Season dates, ISO, Eastern Time. */
  seasonStart: "2026-11-27",
  seasonEnd: "2026-12-20",
} as const;

export const abs = (path: string) => new URL(path, SITE.url).toString();

interface PageSeo {
  /** Full <title>, used as-is (no template), so it can lead with the keyword. */
  title: string;
  description: string;
  /** Canonical path, e.g. "/santa". */
  path: string;
  /** Shorter title for social cards. Defaults to `title`. */
  socialTitle?: string;
  socialDescription?: string;
  image: { url: string; alt: string };
  noindex?: boolean;
}

/** Title, description, canonical, Open Graph and X card for one page, kept in sync. */
export function pageMetadata({ title, description, path, socialTitle, socialDescription, image, noindex }: PageSeo): Metadata {
  const ogTitle = socialTitle ?? title;
  const ogDescription = socialDescription ?? description;
  const images = [{ url: image.url, width: 1200, height: 630, alt: image.alt }];
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: SITE.locale,
      url: path,
      title: ogTitle,
      description: ogDescription,
      images,
    },
    twitter: { card: "summary_large_image", title: ogTitle, description: ogDescription, images },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

// ── JSON-LD ─────────────────────────────────────────────────────────────────

const BUSINESS_ID = `${SITE.url}/#business`;
const WEBSITE_ID = `${SITE.url}/#website`;

const postalAddress = { "@type": "PostalAddress", ...SITE.address };

const ESSEX_COUNTY = { "@type": "AdministrativeArea", name: "Essex County, NJ" };

/** Open daily, 11 AM to 7 PM, for the season only (the studio, Santa and portrait hours the pages state). */
const seasonHours = {
  "@type": "OpeningHoursSpecification",
  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  opens: "11:00",
  closes: "19:00",
  validFrom: SITE.seasonStart,
  validThrough: SITE.seasonEnd,
};

const place = {
  "@type": "Place",
  name: SITE.name,
  address: postalAddress,
};

/** The business and the website, on every page. */
export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": BUSINESS_ID,
        name: SITE.name,
        description:
          "A holiday photo studio in Bloomfield, New Jersey with Photos with Santa, eight styled holiday sets, Selfie Studio Access, Professional Portrait Sessions and private studio hours.",
        url: SITE.url,
        logo: abs("/logo.jpg"),
        image: [abs("/og-home.jpg"), abs("/og-portrait-studio.jpg"), abs("/og-santa.jpg")],
        telephone: SITE.phoneE164,
        priceRange: `$${PRICES.selfieFamily.each}–$${PRICES.professional}`,
        address: postalAddress,
        openingHoursSpecification: seasonHours,
        areaServed: [{ "@type": "City", name: "Bloomfield, NJ" }, ESSEX_COUNTY],
        sameAs: [BRAND.instagramUrl],
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE.url,
        name: SITE.name,
        inLanguage: "en-US",
        publisher: { "@id": BUSINESS_ID },
      },
    ],
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

/** One Event per Santa date: 11 AM to 7 PM Eastern, walk in any time on the booked date. */
export function santaEventsJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": EVENT_DATES.map((d) => ({
      "@type": "Event",
      name: `Photos with Santa in Bloomfield, NJ · ${d.label}`,
      description:
        "Photos with Santa at The Selfie Studio Experience. Two 4×6 prints and every digital image, per child. Book your date, then arrive any time between 11 AM and 7 PM.",
      startDate: `${d.iso}T11:00:00-05:00`,
      endDate: `${d.iso}T19:00:00-05:00`,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: place,
      image: [abs("/og-santa.jpg")],
      organizer: { "@type": "Organization", name: SITE.name, url: SITE.url },
      offers: {
        "@type": "Offer",
        name: "Photos with Santa, per child",
        price: PRICES.santaPerChild.toFixed(2),
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: abs("/santa#book"),
      },
    })),
  };
}

const offer = (name: string, price: number, description: string) => ({
  "@type": "Offer",
  name,
  description,
  price: price.toFixed(2),
  priceCurrency: "USD",
  availability: "https://schema.org/InStock",
  url: abs("/portrait-studio#book"),
});

export function studioServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Holiday Selfie & Portrait Studio",
    serviceType: "Holiday portrait photography studio",
    description:
      "One-hour sessions in eight styled holiday sets in Bloomfield, NJ, from 11 AM to 7 PM daily, November 27 to December 20.",
    provider: { "@id": BUSINESS_ID },
    areaServed: ESSEX_COUNTY,
    url: abs("/portrait-studio"),
    image: abs("/og-portrait-studio.jpg"),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Portrait Studio sessions",
      itemListElement: [
        offer("Selfie Studio Access", PRICES.selfieRegular, "Per person. One hour with all eight sets, using your own phone. Children aged 3 and under are free."),
        {
          ...offer(
            "Family Package: Selfie Studio Access for 4 or more guests",
            PRICES.selfieFamily.each,
            `Per person when booking ${PRICES.selfieFamily.minGuests} or more guests for the same hour. Applied automatically at checkout.`,
          ),
          eligibleQuantity: { "@type": "QuantitativeValue", minValue: PRICES.selfieFamily.minGuests, unitText: "guests" },
        },
        offer("Professional Portrait Session", PRICES.professional, "Per session. Our photographer, edited images and every digital photo."),
        offer("Bring Your Own Photographer", PRICES.byoPhotographer, "One private hour with all eight sets for your own photographer."),
      ],
    },
  };
}

export function photographerServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Holiday Photography Studio Rental for Photographers",
    serviceType: "Photography studio rental",
    description: "Approved professional photographers can rent the holiday studio sets for their own client sessions, 60 minutes at $75 per hour.",
    provider: { "@id": BUSINESS_ID },
    areaServed: ESSEX_COUNTY,
    audience: { "@type": "BusinessAudience", name: "Professional photographers" },
    url: abs("/photographers"),
    image: abs("/og-photographers.jpg"),
    offers: { "@type": "Offer", price: "75.00", priceCurrency: "USD", description: "Per 60-minute session, approved partners only", url: abs("/photographers#apply") },
  };
}
