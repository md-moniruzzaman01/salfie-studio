import type { Metadata } from "next";
import { Fragment } from "react";
import { SantaBooking } from "@/components/luxe/santa-booking";
import { CrossSell, Faq, Script } from "@/components/luxe/home-sections";
import { Fade, MaskLines, ParallaxImage, PillReveal } from "@/components/luxe/motion";
import { MobileBookBar } from "@/components/luxe/booking-modal";
import { SantaHero } from "@/components/luxe/santa-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SANTA_FAQ } from "@/lib/copy";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Photos with Santa",
  description: "Two 4×6 prints and all digital images for $34.99 per child. No time slot: arrive any time 11 AM to 7 PM on eight dates, November 27 to December 20, in Bloomfield, NJ.",
  alternates: { canonical: "/santa" },
  openGraph: {
    title: "Photos with Santa · The Selfie Studio Experience",
    description: "A visit they'll talk about all year. Two 4×6 prints and all digitals, $34.99 per child.",
    url: "/santa",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Photos with Santa in Bloomfield, NJ" }],
  },
};

const INCLUDED = [
  ["Two 4×6 prints", "Yours to take home."],
  ["Every digital image", "All of your photos, delivered to your inbox."],
  ["No time slot", "Arrive any time between 11 AM and 7 PM on your date."],
  ["The whole family", "Parents, grandparents and siblings are all welcome in the photo."],
];

export default function SantaPage() {
  return (
    <>
      <SiteHeader bookHref="#book" bookModal="santa" />
      <main>
        <SantaHero />

        <section aria-label="What is included" className="bg-ivory px-6 py-[clamp(80px,12vw,176px)] sm:px-10 lg:px-16">
          <div className="mx-auto grid w-full max-w-[1360px] items-center gap-14 lg:grid-cols-2 lg:gap-24">
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-5">
                <p className="eyebrow m-0 text-crimson">What is included</p>
                <MaskLines as="h2" className="m-0 max-w-[14ch] text-[clamp(34px,6vw,76px)] font-extrabold leading-[1.02] tracking-[-0.025em]" lines={["Two prints.", <Fragment key="d">Every <Script>digital.</Script></Fragment>]} />
              </div>
              <ul className="m-0 flex list-none flex-col p-0">
                {INCLUDED.map(([title, body], i) => (
                  <li key={title} className="border-t border-line2 py-5 last:border-b">
                    <Fade delay={i * 0.06} y={16}>
                      <div className="grid gap-1 sm:grid-cols-[13rem_1fr] sm:gap-6">
                        <h3 className="m-0 text-[19px] font-extrabold">{title}</h3>
                        <p className="m-0 text-[17px] leading-relaxed text-muted">{body}</p>
                      </div>
                    </Fade>
                  </li>
                ))}
              </ul>
            </div>
            <PillReveal cover="#ffffff" className="aspect-[4/5] w-full">
              <ParallaxImage src={IMAGES.gingerbread} alt="A father and son in emerald suits and red bow ties in front of a gingerbread house" sizes="(min-width: 1024px) 46vw, 92vw" position="50% 30%" className="h-full w-full" />
              <span aria-hidden className="pointer-events-none absolute inset-3 border border-ivory/55" />
            </PillReveal>
          </div>
        </section>

        <SantaBooking />
        <Faq items={SANTA_FAQ} />
        <CrossSell to="studio" />
      </main>
      <SiteFooter />
      <div aria-hidden className="h-[84px] bg-sand md:hidden" />
      <MobileBookBar kind="santa" price="$34.99" note="per child · 2 prints + digitals" label="Book Santa" />
    </>
  );
}
