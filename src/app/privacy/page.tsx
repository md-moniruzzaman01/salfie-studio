import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { LegalPage, type LegalSection } from "@/components/legal-page";
import { BRAND } from "@/lib/content";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy · The Selfie Studio Experience",
  description: "What The Selfie Studio Experience collects when you book or apply, how it is used, the services we rely on, and how to reach us about your information.",
  path: "/privacy",
  image: { url: "/og-home.jpg", alt: "The Selfie Studio Experience, Holiday Edition, in Bloomfield, NJ" },
});

// Describes what this site actually does (forms in src/lib/api.ts, Square
// checkout, Turnstile, the Google Maps embed, one sessionStorage flag). Update
// it whenever a form field, analytics tool or third-party script is added.
const SECTIONS: LegalSection[] = [
  {
    id: "collect",
    title: "What we collect",
    body: (
      <>
        <p>We only collect what you give us in our forms:</p>
        <ul>
          <li>
            <strong>Bookings:</strong> your name, email address and phone number, with the date, time and number of guests you choose.
          </li>
          <li>
            <strong>Photographer Partner Application:</strong> your name or business name, email address, phone number, website or portfolio link, and how often you plan
            to use the studio.
          </li>
          <li>
            <strong>Photographer bookings:</strong> the details above plus any shoot notes you add.
          </li>
          <li>
            <strong>Messages:</strong> anything you send us by email or phone.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "payments",
    title: "Payments",
    body: (
      <p>
        Payments are taken by Square on its own secure checkout page. Your card details go directly to Square and never reach us. Square&rsquo;s handling of your
        payment information is covered by the{" "}
        <a href="https://squareup.com/us/en/legal/general/privacy" target="_blank" rel="noreferrer">
          Square Privacy Notice
        </a>
        .
      </p>
    ),
  },
  {
    id: "use",
    title: "How we use your information",
    body: (
      <ul>
        <li>To create and manage your booking, and to send your confirmation and receipt.</li>
        <li>To contact you about your booking, for example if you ask to change your date.</li>
        <li>To review photographer applications and confirm approved partners.</li>
        <li>To keep the records we need for accounting and legal purposes.</li>
      </ul>
    ),
  },
  {
    id: "sharing",
    title: "Services we use",
    body: (
      <>
        <p>We do not sell your personal information. We share it only with the services that run the site and your booking:</p>
        <ul>
          <li>
            <strong>Square</strong> processes payments.
          </li>
          <li>
            <strong>Cloudflare Turnstile</strong> checks that the photographer application is sent by a person, not a bot.
          </li>
          <li>
            <strong>Google Maps</strong> shows the map in the &ldquo;Plan your visit&rdquo; section. It loads only when you scroll to it, and Google may set its own cookies when
            it does.
          </li>
          <li>Our booking system and email provider store your booking and send our emails.</li>
        </ul>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and analytics",
    body: (
      <p>
        This site does not use advertising or analytics cookies. It stores one small setting in your browser for the current visit, so the opening animation plays only
        once. The Google Maps and Cloudflare services above may use their own cookies under their own policies.
      </p>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: <p>We keep booking and application details for as long as we need them to provide the service and meet our accounting and legal obligations.</p>,
  },
  {
    id: "choices",
    title: "Your choices",
    body: (
      <p>
        You can ask to see, correct or delete the personal information we hold about you by emailing <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>. We may need to keep
        some records, such as payment records, where the law requires it.
      </p>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: <p>Bookings are made by adults. We do not knowingly collect personal information directly from children under 13.</p>,
  },
  {
    id: "updates",
    title: "Changes to this policy",
    body: <p>If we change how we handle personal information, we will update this page and the date at the top.</p>,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Privacy Policy", path: "/privacy" }])} />
      <LegalPage
        eyebrow="Your information"
        title="Privacy Policy"
        updated="November 13, 2026"
        intro={<p>We collect only what we need to take your booking, we never see your card details, and we do not sell your information.</p>}
        sections={SECTIONS}
      />
    </>
  );
}
