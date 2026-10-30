import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookButton } from "@/components/booking/book-button";
import { EarlyBirdCountdown } from "@/components/early-bird-countdown";
import { MobileBookBar } from "@/components/mobile-book-bar";
import { SectionHeading } from "@/components/section-heading";
import { CrossSell, Faq } from "@/components/sections";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BRAND, EVENT_DATES, SANTA_FAQ } from "@/lib/content";
import { IMAGE_ALT, IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Photos with Santa",
  description: "Two 4×6 prints and all digitals. 1 child $39.99 ($34.99 early bird), 2 kids $50, family up to 6 $75. Bloomfield, NJ.",
};

const LONG_DATES = ["November 27", "November 28", "December 5", "December 6", "December 12", "December 13", "December 19", "December 20"];

export default function SantaPage() {
  return (
    <>
      <SiteHeader current="/santa" bookPreset="santa" bookLabel="Book Santa" />
      <main>
        <section className="relative flex flex-wrap overflow-hidden bg-velvet text-cream">
          <div className="relative z-10 flex min-w-0 flex-[1_1_520px] flex-col justify-center gap-5 px-5 py-[clamp(32px,5vw,72px)] sm:px-[clamp(20px,4vw,56px)]">
            <Link href="/" className="eyebrow link-grow self-start !text-[15px] !tracking-[0.22em] text-parchment">
              ← The Holiday Experience
            </Link>
            <div className="animate-rise font-display text-[20px] italic leading-none text-gold sm:text-[clamp(26px,3vw,36px)]">Create magical memories</div>
            <h1 className="m-0 flex animate-rise flex-col font-display font-bold leading-[0.9] [animation-delay:.08s]">
              <span className="text-[22px] tracking-[0.04em] sm:text-[clamp(26px,3vw,40px)] sm:tracking-[0.06em]">Photos with</span>
              <span className="text-[56px] tracking-[-0.01em] sm:text-[clamp(64px,9vw,128px)]">Santa</span>
            </h1>
            <p className="m-0 max-w-[480px] animate-rise text-[17px] text-parchment [animation-delay:.16s] sm:text-[21px]">
              That last a lifetime. Two 4×6 prints and every digital image, with Santa here {BRAND.santaHours} on 8 magical dates.
            </p>
            <div className="grid max-w-[520px] animate-rise grid-cols-3 border border-cream/25 [animation-delay:.24s]">
              <div className="border-r border-cream/25 px-2.5 py-2.5 sm:px-4 sm:py-3.5">
                <div className="eyebrow !text-[9px] !tracking-[0.12em] text-gold sm:!text-xs sm:!tracking-[0.2em]">Early bird</div>
                <div className="font-display text-[20px] font-bold leading-tight sm:text-[32px]">$34.99</div>
                <div className="text-[11px] leading-snug text-parchment sm:text-[15px]">until Oct 31 · reg. $39.99</div>
              </div>
              <div className="border-r border-cream/25 px-2.5 py-2.5 sm:px-4 sm:py-3.5">
                <div className="eyebrow !text-[9px] !tracking-[0.12em] text-gold sm:!text-xs sm:!tracking-[0.2em]">2 kids</div>
                <div className="font-display text-[20px] font-bold leading-tight sm:text-[32px]">$50</div>
              </div>
              <div className="px-2.5 py-2.5 sm:px-4 sm:py-3.5">
                <div className="eyebrow !text-[9px] !tracking-[0.12em] text-gold sm:!text-xs sm:!tracking-[0.2em]">Family</div>
                <div className="font-display text-[20px] font-bold leading-tight sm:text-[32px]">$75</div>
                <div className="text-[11px] leading-snug text-parchment sm:text-[15px]">up to 6</div>
              </div>
            </div>
            <div className="flex max-w-[520px] animate-rise flex-wrap gap-2.5 [animation-delay:.32s]">
              <BookButton preset="santa" className="group inline-flex min-h-[56px] flex-[1_1_240px] items-center justify-center gap-2 bg-gold text-lg font-bold text-velvet transition-colors hover:bg-cream">
                Choose your date
                <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </BookButton>
              <a href="#dates" className="inline-flex min-h-[56px] flex-[1_1_160px] items-center justify-center border border-cream/50 text-lg font-bold transition-colors hover:bg-cream hover:text-velvet">
                See the dates
              </a>
            </div>
          </div>
          <div className="relative flex min-h-[480px] min-w-0 flex-[1_1_520px]">
            <div className="relative flex-1 overflow-hidden">
              <Image src={IMAGES.santaMailbox} alt={IMAGE_ALT.santaMailbox} fill sizes="(min-width: 1040px) 25vw, 50vw" fetchPriority="high" className="object-cover" style={{ objectPosition: "55% 30%" }} />
            </div>
            <div className="relative flex-1 overflow-hidden border-l border-cream/20">
              <Image src={IMAGES.santaSack} alt={IMAGE_ALT.santaSack} fill sizes="(min-width: 1040px) 25vw, 50vw" className="object-cover" style={{ objectPosition: "60% 30%" }} />
            </div>
          </div>
        </section>

        <section id="dates" className="bg-cream px-5 py-[clamp(56px,8vw,96px)]">
          <div className="mx-auto flex max-w-[1180px] flex-wrap items-stretch gap-6">
            <div className="flex flex-[1_1_320px] flex-col gap-3 border border-line bg-white p-6">
              <div className="eyebrow text-crimson">Santa will be available</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 font-display text-[20px]">
                {LONG_DATES.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
              <div className="border-t border-line pt-2.5 font-display text-[26px] font-bold text-crimson">{BRAND.santaHours}</div>
              <div className="text-[17px] text-muted">No time slot needed. Walk in any time on your date.</div>
            </div>
            <div className="flex flex-[1_1_320px] flex-col gap-3 border border-line bg-white p-6">
              <div className="eyebrow text-crimson">Every sitting includes</div>
              <div className="font-display text-3xl font-bold leading-tight">2 4×6 prints &amp; all digitals</div>
              <div className="flex flex-col border-t border-line">
                {[
                  ["1 sitting · 1 child", "$39.99"],
                  ["2 kids", "$50"],
                  ["Family (up to 6 people)", "$75"],
                ].map(([label, price], i, arr) => (
                  <div key={label} className={`flex justify-between gap-3 py-2.5 text-[19px] ${i < arr.length - 1 ? "border-b border-line" : ""}`}>
                    <span>{label}</span>
                    <b>{price}</b>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-[1_1_260px] flex-col items-center justify-center gap-2.5 bg-crimson p-6 text-center text-cream">
              <div className="font-display text-[24px] font-bold uppercase tracking-wide">Early bird special</div>
              <div className="font-display text-[56px] font-bold leading-none">$34.99</div>
              <div className="text-lg">Purchased October 15th – 31st</div>
              <EarlyBirdCountdown className="text-[17px] text-parchment" />
              <BookButton preset="santa" className="mt-1.5 min-h-[54px] w-full bg-cream text-[17px] font-bold text-crimson transition-colors hover:bg-ink hover:text-cream">
                Lock in early bird
              </BookButton>
            </div>
          </div>
        </section>

        <section className="bg-cream px-5 pb-[clamp(56px,8vw,96px)]">
          <div className="mx-auto flex max-w-[1180px] flex-col gap-6">
            <SectionHeading script="Your visit" title="Step by step" />
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { img: IMAGES.mailbox, alt: IMAGE_ALT.mailbox, pos: "50% 50%", title: "Book your date", body: `Choose one of ${EVENT_DATES.length} dates and pay in a tap.` },
                { img: IMAGES.santaMailbox, alt: IMAGE_ALT.santaMailbox, pos: "60% 30%", title: "Meet Santa", body: `Walk in ${BRAND.santaHours} and share your wish list.` },
                { img: IMAGES.santaSack, alt: IMAGE_ALT.santaSack, pos: "60% 30%", title: "Take the magic home", body: "Two prints in hand, every digital in your inbox." },
              ].map((s, i) => (
                <div key={s.title} className="group overflow-hidden border border-line bg-white transition hover:-translate-y-1.5 hover:shadow-xl">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={s.img} alt={s.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-[1400ms] group-hover:scale-105" style={{ objectPosition: s.pos }} />
                  </div>
                  <div className="px-5 pb-5.5 pt-4.5">
                    <div className="font-display text-[23px]">
                      <span className="text-crimson">{i + 1}.</span> {s.title}
                    </div>
                    <div className="text-[17px] text-muted">{s.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Faq items={SANTA_FAQ} title="Santa FAQ" />
        <CrossSell to="studio" />
      </main>
      <SiteFooter />
      <MobileBookBar variant="single" preset="santa" price="From $34.99" note="2 prints + all digitals" label="Book Santa" />
    </>
  );
}
