import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AdventDates } from "@/components/advent-dates";
import { BookButton } from "@/components/booking/book-button";
import { MobileBookBar } from "@/components/mobile-book-bar";
import { Reveal } from "@/components/motion/reveal";
import { ScrollFx } from "@/components/motion/scroll-fx";
import { SplitReveal } from "@/components/motion/split-reveal";
import { Tilt } from "@/components/motion/tilt";
import { SantaFromPrice, SantaPriceStrip } from "@/components/santa-price-strip";
import { SectionHeading } from "@/components/section-heading";
import { CrossSell, Faq } from "@/components/sections";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BRAND, EVENT_DATES, SANTA_FAQ } from "@/lib/content";
import { IMAGE_ALT, IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Photos with Santa",
  description: "Two 4×6 prints and all digitals. 1 child $34.99, 2 kids $50, family up to 6 $75. Bloomfield, NJ.",
};

const VISIT = [
  { img: IMAGES.mailbox, alt: IMAGE_ALT.mailbox, pos: "50% 35%", title: "Book your date", body: `Choose one of ${EVENT_DATES.length} dates and pay in a tap.` },
  { img: IMAGES.santaStair, alt: IMAGE_ALT.santaMailbox, pos: "45% 40%", title: "Meet Santa", body: `Walk in ${BRAND.santaHours} and share your wish list.` },
  { img: IMAGES.santaSack, alt: IMAGE_ALT.santaSack, pos: "50% 30%", title: "Take the magic home", body: "Two prints in hand, every digital in your inbox." },
];

export default function SantaPage() {
  return (
    <>
      <SiteHeader current="/santa" bookPreset="santa" bookLabel="Book Santa" />
      <main>
        {/* ── Hero ───────────────────────────────── */}
        <ScrollFx as="section" aria-label="Photos with Santa" className="relative isolate overflow-hidden bg-cream text-ink">
          <div aria-hidden className="absolute inset-y-0 right-0 -z-20 w-full lg:w-[60%] lg:[mask-image:linear-gradient(90deg,transparent_0%,#000_34%)]">
            <Image src={IMAGES.santaStair} alt="" fill priority sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover object-[50%_30%]" />
          </div>
          <span
            aria-hidden
            className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(247,242,234,1)_0%,rgba(247,242,234,0.96)_40%,rgba(247,242,234,0.25)_50%,rgba(247,242,234,0)_62%)] max-lg:bg-[linear-gradient(180deg,rgba(247,242,234,0.8)_0%,rgba(247,242,234,0.96)_60%)]"
          />
          <div className="mx-auto flex max-w-[1240px] flex-col items-start px-6 pb-[clamp(72px,10vw,128px)] pt-[clamp(40px,7vw,96px)] sm:px-10 lg:min-h-[calc(100svh-80px)] lg:justify-center lg:px-16">
            <div className="flex max-w-[540px] flex-col items-start gap-6">
              <Link href="/" className="eyebrow link-grow animate-rise text-crimson">
                ← The Holiday Experience
              </Link>
              <SplitReveal as="h1" immediate delay={0.1} className="m-0 flex flex-col font-display leading-[0.98]">
                <span className="font-script text-[clamp(34px,4vw,56px)] font-normal leading-none text-leaf">Photos with</span>
                <span className="text-[clamp(72px,10vw,144px)] font-bold tracking-[-0.02em]">Santa</span>
              </SplitReveal>
              <p className="m-0 max-w-[42ch] animate-rise font-body text-[clamp(22px,2.3vw,28px)] italic leading-snug text-bark [animation-delay:.3s]">
                Create magical memories that last a lifetime: two 4×6 prints and every digital image, on 8 magical dates.
              </p>
              <SantaPriceStrip className="w-full max-w-[520px] animate-rise [animation-delay:.4s]" />
              <div className="flex w-full max-w-[520px] animate-rise flex-wrap gap-3 [animation-delay:.5s]">
                <BookButton
                  preset="santa"
                  className="inline-flex min-h-14 flex-[1_1_240px] items-center justify-center bg-crimson px-7 text-[13px] font-bold uppercase tracking-[0.14em] text-cream transition-colors hover:bg-signal"
                >
                  Choose your date
                </BookButton>
                <a
                  href="#dates"
                  className="inline-flex min-h-14 flex-[1_1_180px] items-center justify-center border border-crimson px-7 text-[13px] font-bold uppercase tracking-[0.14em] text-crimson transition-colors hover:bg-crimson hover:text-cream"
                >
                  See the dates
                </a>
              </div>
              <p className="m-0 animate-rise text-[14px] text-muted [animation-delay:.6s]">
                Santa is here {BRAND.santaHours}. No time slot needed, walk in any time on your date.
              </p>
            </div>
          </div>
        </ScrollFx>

        {/* ── Dates ──────────────────────────────── */}
        <ScrollFx as="section" id="dates" className="scroll-mt-20 bg-cream px-5 py-[clamp(64px,9vw,112px)] sm:px-10 lg:px-16">
          <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
            <div className="flex flex-col gap-8">
              <SectionHeading script="Santa's calendar" title="Eight magical dates" />
              <AdventDates />
              <p className="m-0 text-[17px] text-muted">No time slot needed. Walk in any time between {BRAND.santaHours} on your date.</p>
            </div>
            <div className="flex flex-col gap-6">
              <Reveal>
                <Tilt innerClassName="flex flex-col gap-3 border border-line border-t-2 border-t-gold bg-white p-7">
                  <div className="eyebrow text-crimson">Every sitting includes</div>
                  <div className="font-display text-3xl font-bold leading-tight">2 4×6 prints &amp; all digitals</div>
                  <div className="flex flex-col border-t border-line">
                    {[
                      ["1 sitting · 1 child", "$34.99"],
                      ["2 kids", "$50"],
                      ["Family (up to 6 people)", "$75"],
                    ].map(([label, price], i, arr) => (
                      <div key={label} className={`flex justify-between gap-3 py-2.5 text-[18px] ${i < arr.length - 1 ? "border-b border-line" : ""}`}>
                        <span>{label}</span>
                        <b>{price}</b>
                      </div>
                    ))}
                  </div>
                </Tilt>
              </Reveal>
              <Reveal delay={0.08}>
                <Tilt glare innerClassName="stripes-red flex flex-col items-center justify-center gap-2.5 p-7 text-center text-cream">
                  <div className="eyebrow text-parchment">Photos with Santa</div>
                  <div data-pop data-count={34.99} data-decimals={2} data-prefix="$" className="font-display text-[56px] font-bold leading-none tabular-nums">
                    $34.99
                  </div>
                  <div className="text-lg">Per sitting · 1 child</div>
                  <BookButton preset="santa" className="mt-1.5 min-h-[54px] w-full bg-cream text-[13px] font-bold uppercase tracking-[0.14em] text-crimson transition-colors hover:bg-ink hover:text-cream">
                    Book Santa
                  </BookButton>
                </Tilt>
              </Reveal>
            </div>
          </div>
        </ScrollFx>

        {/* ── Your visit ─────────────────────────── */}
        <ScrollFx as="section" className="bg-sand px-5 py-[clamp(64px,9vw,112px)] sm:px-10 lg:px-16">
          <div className="mx-auto flex max-w-[1180px] flex-col gap-10">
            <SectionHeading script="Your visit" title="Step by step" />
            <ol className="m-0 grid list-none gap-6 p-0 md:grid-cols-3">
              {VISIT.map((s, i) => (
                <Reveal as="li" key={s.title} delay={i * 0.08} className="h-full">
                  <Tilt glare className="h-full" innerClassName="flex h-full flex-col overflow-hidden border border-line bg-porcelain">
                    <div data-clip className="relative aspect-[4/3] overflow-hidden">
                      <span data-parallax="0.12" className="absolute inset-x-0 -inset-y-[10%]">
                        <Image src={s.img} alt={s.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" style={{ objectPosition: s.pos }} />
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 px-6 pb-7 pt-5">
                      <div className="font-display text-[24px]">
                        <span className="text-crimson">{i + 1}.</span> {s.title}
                      </div>
                      <div className="text-[16px] text-muted">{s.body}</div>
                    </div>
                  </Tilt>
                </Reveal>
              ))}
            </ol>
          </div>
        </ScrollFx>

        <Faq items={SANTA_FAQ} title="Santa FAQ" />
        <CrossSell to="studio" />
      </main>
      <SiteFooter />
      <MobileBookBar variant="single" preset="santa" price={<SantaFromPrice />} note="2 prints + all digitals" label="Book Santa" />
    </>
  );
}
