import type { Metadata } from "next";
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/400-italic.css";
import { ClosingCta, EarlyBirdBand, ExperiencePanels, Faq, PlanYourVisit, ThreeTaps } from "@/components/luxe/home-sections";
import { LightHero } from "@/components/luxe/light-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { HOME_FAQ } from "@/lib/copy";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: { absolute: "The Selfie Studio Experience · The Holiday Experience in Bloomfield, NJ" },
  description: "Photos with Santa and eight styled holiday sets in Bloomfield, NJ. Two experiences, one magical season, November 27 to December 20.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "The Holiday Experience · The Selfie Studio Experience",
    description: "Two experiences. One magical season. Photos with Santa and eight holiday sets in Bloomfield, NJ.",
    url: "/",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "The Selfie Studio Experience, Holiday Edition" }],
  },
};

const LOCAL_BUSINESS = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "The Selfie Studio Experience",
  url: "https://theselfiestudioexperience.com",
  telephone: "+1-973-695-8381",
  address: { "@type": "PostalAddress", streetAddress: "77–79 Washington Street", addressLocality: "Bloomfield", addressRegion: "NJ", postalCode: "07003", addressCountry: "US" },
  sameAs: ["https://www.instagram.com/theselfiestudioexperience"],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS) }} />
      <SiteHeader bookHref="#experiences" />
      <main>
        <LightHero
          image={IMAGES.santaReading}
          alt="Santa in a red velvet suit reading the Santa's Naughty and Nice Book"
          position="50% 30%"
          label="Holiday Edition · Bloomfield, NJ"
          script="The Holiday"
          title="Experience"
          lead="Two experiences. One magical season. Meet Santa, step into eight styled holiday sets, and leave with portraits worth framing."
          primary={{ label: "Photos with Santa", href: "/santa#book", modal: "santa" }}
          secondary={{ label: "Portrait Studio", href: "/portrait-studio#book", modal: "studio" }}
          note="November 27 – December 20 · 77–79 Washington Street, Bloomfield"
        />
        <ExperiencePanels />
        <ThreeTaps />
        <EarlyBirdBand />
        <PlanYourVisit />
        <Faq items={HOME_FAQ} />
        <ClosingCta />
      </main>
      <SiteFooter />
    </>
  );
}
