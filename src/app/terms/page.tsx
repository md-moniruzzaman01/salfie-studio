import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { LegalPage, type LegalSection } from "@/components/legal-page";
import { PRICES } from "@/lib/booking";
import { BRAND, PHOTOGRAPHER_TERMS } from "@/lib/content";
import { VISIT } from "@/lib/copy";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service · The Selfie Studio Experience",
  description: "Booking, payment and visit terms for Photos with Santa, the Holiday Portrait Studio and photographer studio access in Bloomfield, NJ.",
  path: "/terms",
  image: { url: "/og-home.jpg", alt: "The Selfie Studio Experience, Holiday Edition, in Bloomfield, NJ" },
});

// Every term below restates what the site and booking flow already do. Have
// the business (and ideally a lawyer) review before relying on it, and update
// the date whenever the wording changes.
const SECTIONS: LegalSection[] = [
  {
    id: "about",
    title: "Who we are",
    body: (
      <p>
        {BRAND.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) runs a holiday photo studio at {VISIT.address}. These terms apply when you use this website or book
        Photos with Santa, a Portrait Studio session, or photographer studio access with us.
      </p>
    ),
  },
  {
    id: "booking",
    title: "Bookings and payment",
    body: (
      <>
        <p>Prices are shown in US dollars. You pay in full when you book, through Square&rsquo;s secure hosted checkout. We never see or store your card details.</p>
        <p>Your booking is confirmed once payment is complete, and your confirmation and receipt are sent to the email address you give us. Please check it is correct.</p>
        <p>
          The price you see at checkout is the price you pay. Early-bird prices apply to purchases made inside the advertised early-bird window, and the Selfie Studio
          family package ($29.99 per guest for four or more guests) is applied automatically.
        </p>
      </>
    ),
  },
  {
    id: "santa",
    title: "Photos with Santa",
    body: (
      <>
        <p>
          Photos with Santa are ${PRICES.santaPerChild} per child and include two 4×6 prints and every digital image from the sitting. Parents, grandparents and siblings
          are welcome in the photo.
        </p>
        <p>Your booking holds your chosen date. There is no time slot: arrive any time between 11 AM and 7 PM on that date.</p>
      </>
    ),
  },
  {
    id: "studio",
    title: "Portrait Studio sessions",
    body: (
      <>
        <p>Studio sessions last one hour and begin at the start time you booked, so please arrive on time. Your hour includes access to all of the holiday sets.</p>
        <ul>
          <li>Selfie Studio Access is priced per paying guest. Children aged 3 and under are free.</li>
          <li>A Professional Portrait Session (${PRICES.professional}) includes our photographer, edited images and every digital photo.</li>
          <li>Bring Your Own Photographer (${PRICES.byoPhotographer}) is one private hour with all of the sets for the photographer you choose.</li>
        </ul>
        <p>Please treat the sets, props and other guests with care.</p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes and cancellations",
    body: (
      <p>
        If you need to change your date or cancel, contact us as soon as you can at <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a> or{" "}
        <a href={`tel:${BRAND.phone.replace(/-/g, "")}`}>{BRAND.phone}</a>. We will help you move your booking where availability allows and will review cancellation
        requests individually.
      </p>
    ),
  },
  {
    id: "photographers",
    title: "Photographer Partner Program",
    body: (
      <>
        <p>
          The $75 hourly studio rate described on our <Link href="/photographers">photographer page</Link> is a separate service from our holiday packages.
        </p>
        <ul>
          {PHOTOGRAPHER_TERMS.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "website",
    title: "This website",
    body: (
      <p>
        We work to keep dates, times and prices on this site accurate, but they can change before you book. If something on the site is wrong, the details in your
        booking confirmation apply, and we will contact you if a problem affects your booking.
      </p>
    ),
  },
  {
    id: "updates",
    title: "Changes to these terms",
    body: <p>We may update these terms from time to time. The version on this page when you book applies to that booking.</p>,
  },
];

export default function TermsPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Terms of Service", path: "/terms" }])} />
      <LegalPage
        eyebrow="The fine print"
        title="Terms of Service"
        updated="November 13, 2026"
        intro={<p>The short version: book online, pay securely through Square, and contact us if your plans change.</p>}
        sections={SECTIONS}
      />
    </>
  );
}
