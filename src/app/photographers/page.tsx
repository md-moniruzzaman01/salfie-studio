import type { Metadata } from "next";
import Image from "next/image";
import { PhotographerBookingPanel } from "@/components/photographers/photographer-booking-panel";
import { ClayCamera } from "@/components/motion/clay-camera";
import { ClayStar } from "@/components/motion/clay-shapes";
import { FloatingHero } from "@/components/motion/floating-hero";
import { Reveal } from "@/components/motion/reveal";
import { ScrollFx } from "@/components/motion/scroll-fx";
import { SplitReveal } from "@/components/motion/split-reveal";
import { SectionHeading } from "@/components/section-heading";
import { Faq } from "@/components/sections";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PHOTOGRAPHER_FAQ, PHOTOGRAPHER_HOURS } from "@/lib/content";
import { IMAGE_ALT, IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Studio Access for Professional Photographers",
  description:
    "Reserve a private one-hour studio session at The Selfie Studio Experience for wedding portraits, party content, brand sessions and client shoots. $75 per hour, Bloomfield, NJ.",
};

const FEATURES = ["Wedding portraits", "Engagement sessions", "Birthday and party coverage", "Brand and lifestyle content"];

/** Two-up with the address on its own row on phones; three-up from sm. */
const FACT_CELL = ["border-r border-cream/25", "sm:border-r sm:border-cream/25", "col-span-2 border-t border-cream/25 sm:col-span-1 sm:border-t-0"];

const QUICK_FACTS = [
  { label: "Session", value: "$75", note: "1 private hour" },
  { label: "Capacity", value: "2 slots", note: "per hour" },
  { label: "Where", value: "Bloomfield", note: "75 Washington Street" },
];

export default function PhotographersPage() {
  return (
    <>
      <SiteHeader current="/photographers" />
      <main>
        {/* ── Hero ───────────────────────────────── */}
        <ScrollFx as="section" aria-label="Studio access for photographers" className="grain relative overflow-hidden bg-velvet text-cream">
          <span
            aria-hidden
            className="pointer-events-none absolute -left-[15%] -top-[35%] aspect-square w-[70vw] max-w-[900px] rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(178,61,110,0.32) 0%, rgba(178,61,110,0) 68%)" }}
          />
          <div className="relative mx-auto grid max-w-[1360px] items-center gap-x-16 gap-y-8 px-6 pb-[clamp(56px,9vh,100px)] pt-[clamp(24px,5vh,56px)] sm:px-10 lg:min-h-[calc(100svh-80px)] lg:grid-cols-2 lg:px-16">
            <div className="order-2 flex flex-col items-start gap-6 lg:order-1">
              <p className="eyebrow m-0 flex animate-rise items-center gap-3 text-gold">
                <span aria-hidden className="h-px w-9 bg-gold" />
                Studio access for working creatives
              </p>
              <SplitReveal as="h1" immediate delay={0.1} className="m-0 flex flex-col font-display leading-[0.98]">
                <span className="text-[clamp(48px,6.6vw,96px)] font-bold">Your vision.</span>
                <span className="text-[clamp(38px,4.2vw,66px)] font-normal italic text-gold">Our floral setting.</span>
              </SplitReveal>
              <p className="m-0 max-w-[40ch] animate-rise font-body text-[clamp(20px,2.2vw,25px)] leading-snug text-parchment [animation-delay:.3s]">
                Reserve a private hour at Casa de Flora Bar for wedding portraits, party content, brand sessions, and client shoots in a space made to photograph beautifully.
              </p>
              <dl className="m-0 grid w-full max-w-[520px] animate-rise grid-cols-2 border border-cream/25 [animation-delay:.4s] sm:grid-cols-3">
                {QUICK_FACTS.map((fact, i) => (
                  <div key={fact.label} className={`flex flex-col gap-1 px-4 py-3.5 sm:px-5 sm:py-4 ${FACT_CELL[i]}`}>
                    <dt className="eyebrow !text-[10px] !tracking-[0.16em] text-gold sm:!text-[11px]">{fact.label}</dt>
                    <dd className="m-0 flex flex-col gap-0.5">
                      <span className="font-display text-[20px] font-bold leading-none sm:text-[clamp(22px,2vw,28px)]">{fact.value}</span>
                      <span className="text-[11px] leading-snug text-parchment/85 sm:text-[13px]">{fact.note}</span>
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="flex w-full max-w-[520px] animate-rise flex-wrap gap-3 [animation-delay:.5s]">
                <a
                  href="#book-studio"
                  className="group inline-flex min-h-14 flex-[1_1_300px] items-center justify-center gap-2.5 whitespace-nowrap bg-gold px-7 text-[13px] font-bold uppercase tracking-[0.14em] text-velvet transition-colors hover:bg-cream"
                >
                  View live availability
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </a>
                <a
                  href="#faq"
                  className="inline-flex min-h-14 flex-[1_1_160px] items-center justify-center whitespace-nowrap border border-cream/50 px-7 text-[13px] font-bold uppercase tracking-[0.14em] transition-colors hover:bg-cream hover:text-velvet"
                >
                  What&apos;s included
                </a>
              </div>
            </div>

            <div className="order-1 animate-rise [animation-delay:.18s] lg:order-2">
              <div data-depth>
                <FloatingHero
                  className="h-[380px] w-full sm:h-[480px] lg:h-[clamp(520px,44vw,620px)]"
                  primary={{ src: IMAGES.studioSoftboxGold, alt: IMAGE_ALT.studioSoftboxGold, caption: "Bring your own lighting", variant: "print", rotate: -3 }}
                  cards={[
                    { src: IMAGES.door, alt: IMAGE_ALT.door, caption: "The golden doorway", rotate: 8, z: -80, style: { top: "-1%", right: "1%", width: "34%" } },
                    { src: IMAGES.carousel, alt: IMAGE_ALT.carousel, caption: "The carousel", rotate: -9, z: 150, style: { bottom: "1%", left: "1%", width: "31%" } },
                  ]}
                >
                  <div data-float data-z={220} className="absolute bottom-[6%] right-[5%] w-[22%]">
                    <ClayCamera className="w-full rotate-[-10deg]" />
                  </div>
                  <ClayStar style={{ left: "10%", top: "6%", width: "8%", height: "8%" }} z={-120} />
                </FloatingHero>
              </div>
            </div>
          </div>
        </ScrollFx>

        {/* ── Booking ────────────────────────────── */}
        <section id="book-studio" className="scroll-mt-24 px-6 py-[clamp(72px,10vw,120px)] sm:px-10 lg:px-16">
          <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-start gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
            <aside className="lg:sticky lg:top-28">
              <SectionHeading script="Book the studio" title="Choose the hour that works for your shoot." />
              <p className="mt-5 max-w-md text-[16px] leading-relaxed text-muted">
                Select a live date and time, add your contact details, and continue to secure checkout. Availability updates as sessions are reserved.
              </p>

              <div className="mt-10 divide-y divide-line border-y border-line">
                {PHOTOGRAPHER_HOURS.map((row) => (
                  <div key={row.day} className="flex items-start justify-between gap-5 py-5 text-sm">
                    <p className="text-bark">{row.day}</p>
                    <p className="text-right text-muted">
                      {row.hours}
                      {row.sub ? <span className="block">{row.sub}</span> : null}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-8 text-[14px] leading-relaxed text-muted">
                Only two professional photographer slots are available per hour. Setup and breakdown must fit within the reserved 1-hour session.
              </p>
            </aside>

            <PhotographerBookingPanel />
          </div>
        </section>

        {/* ── Who it's for ───────────────────────── */}
        <section className="bg-white px-6 pb-24 pt-8 sm:px-10 lg:px-16 lg:pb-32">
          <div className="mx-auto max-w-[1180px]">
            <ScrollFx className="grid grid-cols-1 border border-line bg-sand shadow-[0_24px_70px_-48px_rgba(74,10,18,0.3)] lg:grid-cols-[0.96fr_1.04fr]">
              <div data-clip className="relative order-2 min-h-[380px] overflow-hidden lg:order-1 lg:min-h-[560px]">
                <span data-parallax="0.15" className="absolute inset-x-0 -inset-y-[12%]">
                  <Image src={IMAGES.carousel} alt={IMAGE_ALT.carousel} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
                </span>
                <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-velvet/15 to-transparent" />
              </div>
              <div className="order-1 flex items-center px-7 py-16 sm:px-12 lg:order-2 lg:px-16 lg:py-20">
                <div className="max-w-lg">
                  <span className="eyebrow text-crimson">Weddings, parties, portraits</span>
                  <SplitReveal className="mt-5 font-display text-[clamp(32px,4.2vw,46px)] font-bold leading-[1.08] text-ink">
                    A beautiful backdrop for the moments clients actually book you to capture.
                  </SplitReveal>
                  <p className="mt-6 text-[16px] leading-relaxed text-bark">
                    The studio gives wedding, party, and lifestyle photographers a polished floral setting without needing to build a full set from scratch. Bring your camera, lighting, and creative direction.
                  </p>
                  <ul className="mt-9 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                    {FEATURES.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-[15px] text-bark">
                        <span className="grid size-6 shrink-0 place-items-center rounded-full border border-crimson/50 bg-white text-crimson">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a href="#book-studio" className="group mt-10 inline-flex items-center gap-3 border-b border-crimson pb-2 text-[13px] font-bold uppercase tracking-[0.14em] text-crimson transition-colors hover:text-ink">
                    Find your hour
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </a>
                </div>
              </div>
            </ScrollFx>

            <Reveal className="mt-10 flex flex-col items-start justify-between gap-5 border-y border-line py-7 md:flex-row md:items-center">
              <p className="max-w-2xl font-display text-2xl leading-tight text-ink sm:text-3xl">
                Ready for a wedding gallery, party shoot, or client portrait session with less setup time?
              </p>
              <a
                href="#book-studio"
                className="inline-flex shrink-0 items-center gap-3 bg-ink px-7 py-4 text-[12px] font-bold uppercase tracking-[0.16em] text-cream transition-colors hover:bg-crimson"
              >
                Book a session →
              </a>
            </Reveal>
          </div>
        </section>

        <Faq items={PHOTOGRAPHER_FAQ} title="Photographer FAQ" id="faq" />
      </main>
      <SiteFooter />
    </>
  );
}
