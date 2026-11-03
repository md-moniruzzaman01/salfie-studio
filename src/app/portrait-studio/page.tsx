import type { Metadata } from "next";
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/400-italic.css";
import { CrossSell, EarlyBirdBand, Faq } from "@/components/luxe/home-sections";
import { MobileBookBar } from "@/components/luxe/booking-modal";
import { LightHero } from "@/components/luxe/light-hero";
import { SetsGallery } from "@/components/luxe/sets-gallery";
import { StudioBooking } from "@/components/luxe/studio-booking";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { STUDIO_FAQ } from "@/lib/copy";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Portrait Studio",
  description: "Eight holiday sets, one magical hour. Selfie Studio Access, Professional Portrait Sessions ($200) or bring your own photographer ($100). Hourly, 11 AM to 6 PM, Bloomfield, NJ.",
  alternates: { canonical: "/portrait-studio" },
  openGraph: {
    title: "Portrait Studio · The Selfie Studio Experience",
    description: "Eight holiday sets. One magical hour. Book a session in Bloomfield, NJ.",
    url: "/portrait-studio",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "The Portrait Studio in Bloomfield, NJ" }],
  },
};

export default function PortraitStudioPage() {
  return (
    <>
      <SiteHeader bookHref="#book" bookModal="studio" />
      <main>
        <LightHero
          image={IMAGES.snowSofaTrio}
          alt="Three guests in holiday sweaters on a cream sofa in a snow-covered set"
          position="50% 24%"
          label="Portrait Studio"
          script="Eight holiday sets."
          title={<>One magical<br />hour.</>}
          lead="Shoot it yourself, bring your own photographer, or book ours. Hourly sessions from 11 AM to 6 PM."
          primary={{ label: "Book a session", href: "#book", modal: "studio" }}
          secondary={{ label: "See the sets", href: "#sets" }}
          note="Every day · Nov 27 – Dec 20"
        />
        <SetsGallery />
        <EarlyBirdBand />
        <StudioBooking />
        <Faq items={STUDIO_FAQ} />
        <CrossSell to="santa" />
      </main>
      <SiteFooter />
      <div aria-hidden className="h-[84px] bg-sand md:hidden" />
      <MobileBookBar kind="studio" price="from $44.99" note="8 sets · 1 hour" label="Book a session" />
    </>
  );
}
