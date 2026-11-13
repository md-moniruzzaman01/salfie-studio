import type { Metadata } from "next";
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/500-italic.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/400-italic.css";
import "@fontsource/playfair-display/700-italic.css";
import { CrossSell, EarlyBirdBand, Faq } from "@/components/luxe/home-sections";
import { FamilyPackage } from "@/components/luxe/family-package";
import { MobileBookBar } from "@/components/luxe/booking-modal";
import { LightHero } from "@/components/luxe/light-hero";
import { SetsGallery } from "@/components/luxe/sets-gallery";
import { StudioHow } from "@/components/luxe/studio-how";
import { StudioPrice, StudioPriceNote } from "@/components/luxe/studio-price";
import { StudioBooking } from "@/components/luxe/studio-booking";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PRICES } from "@/lib/booking";
import { STUDIO_FAQ } from "@/lib/copy";
import { IMAGES } from "@/lib/images";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd, pageMetadata, studioServiceJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Holiday Selfie & Portrait Studio · Bloomfield, NJ",
  socialTitle: "Holiday Portrait Studio · Bloomfield, NJ",
  description:
    `Family of ${PRICES.selfieFamily.minGuests}+? $${PRICES.selfieFamily.each} each. Eight holiday photo sets in Bloomfield, NJ, one hour, your own phone. Pro portraits $200. Daily 11 AM – 7 PM.`,
  socialDescription: "Eight holiday sets. One magical hour. Book a session in Bloomfield, NJ.",
  path: "/portrait-studio",
  image: { url: "/og-portrait-studio.jpg", alt: "The holiday Portrait Studio at The Selfie Studio Experience in Bloomfield, NJ" },
});

export default function PortraitStudioPage() {
  return (
    <div className="luxe-serif">
      <JsonLd data={studioServiceJsonLd()} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Portrait Studio", path: "/portrait-studio" }])} />
      <SiteHeader bookHref="#book" bookModal="studio" />
      <main>
        <LightHero
          image={IMAGES.snowSofaTrio}
          alt="Three guests in holiday sweaters on a cream sofa in the snow-covered selfie studio set in Bloomfield, NJ"
          position="50% 24%"
          label="Holiday Portrait Studio · Bloomfield, NJ"
          quiet
          script="Eight holiday sets."
          title={<>One magical<br />hour.</>}
          lead="Shoot it yourself, bring your own photographer, or book ours for holiday family photos and portraits. Hourly sessions from 11 AM to 7 PM."
          primary={{ label: "Book a session", href: "#book", modal: "studio" }}
          secondary={{ label: "See the sets", href: "#sets" }}
          strip={[
            ["From", <StudioPrice key="p" />, <StudioPriceNote key="n" />],
            [`Family of ${PRICES.selfieFamily.minGuests}+`, `$${PRICES.selfieFamily.each}`, "each · the whole family, one hour"],
            ["Daily", "11–7", "Nov 27 – Dec 20"],
          ]}
        />
        <SetsGallery />
        <StudioHow />
        <EarlyBirdBand />
        <FamilyPackage />
        <StudioBooking />
        <Faq items={STUDIO_FAQ} />
        <CrossSell to="santa" />
      </main>
      <SiteFooter />
      <div aria-hidden className="h-[84px] bg-sand md:hidden" />
      <MobileBookBar kind="studio" price={<>from <StudioPrice /></>} note="8 sets · 1 hour" label="Book a session" />
    </div>
  );
}
