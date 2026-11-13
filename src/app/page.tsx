import type { Metadata } from "next";
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/400-italic.css";
import { ClosingCta, EarlyBirdBand, ExperiencePanels, Faq, PlanYourVisit, ThreeTaps } from "@/components/luxe/home-sections";
import { LightHero } from "@/components/luxe/light-hero";
import { StudioIntro } from "@/components/luxe/studio-intro";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { HOME_FAQ } from "@/lib/copy";
import { IMAGES } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Holiday Selfie Studio & Photos with Santa · Bloomfield, NJ",
  socialTitle: "The Holiday Experience · Bloomfield, NJ",
  description:
    "Photos with Santa and eight styled holiday photo sets in Bloomfield, NJ. Book a selfie studio hour or a professional portrait session, Nov 27 – Dec 20.",
  socialDescription: "Two experiences. One magical season. Photos with Santa and eight holiday sets in Bloomfield, NJ.",
  path: "/",
  image: { url: "/og-home.jpg", alt: "The Selfie Studio Experience, Holiday Edition, in Bloomfield, NJ" },
});

export default function HomePage() {
  return (
    <>
      <SiteHeader bookHref="#experiences" />
      <main>
        <LightHero
          image={IMAGES.santaReading}
          alt="Santa in a red velvet suit reading Santa's Naughty and Nice Book at The Selfie Studio Experience in Bloomfield, NJ"
          position="50% 30%"
          label="Holiday Photo Studio · Bloomfield, NJ"
          script="The Holiday"
          title="Experience"
          lead="Two experiences. One magical season. Meet Santa, step into eight styled holiday sets, and leave with portraits worth framing."
          primary={{ label: "Photos with Santa", href: "/santa#book", modal: "santa" }}
          secondary={{ label: "Portrait Studio", href: "/portrait-studio#book", modal: "studio" }}
          note="November 27 – December 20 · 77–79 Washington Street, Bloomfield"
        />
        <ExperiencePanels />
        <StudioIntro />
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
