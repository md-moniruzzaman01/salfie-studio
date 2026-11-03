import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PhotographerApplication } from "@/components/photographers/photographer-application";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  BRAND,
  PHOTOGRAPHER_BOOKING_START,
  PHOTOGRAPHER_HIGHLIGHTS,
  PHOTOGRAPHER_HOURS,
  PHOTOGRAPHER_INCLUDES,
  PHOTOGRAPHER_TERMS,
} from "@/lib/content";
import { IMAGES } from "@/lib/images";

export const metadata: Metadata = {
  title: "Professional Photographer Studio Access",
  description:
    "Exclusive holiday studio access for approved professional photographers at The Selfie Studio Experience in Bloomfield, NJ. $75 per hour, 60-minute sessions. Apply to join the Photographer Partner Program.",
  alternates: { canonical: "/photographers" },
  openGraph: {
    title: "Professional Photographer Studio Access · $75 per hour",
    description: "Exclusive holiday studio access for approved photographers. Apply to join the Photographer Partner Program.",
    type: "website",
  },
};

const CARD = "border border-line bg-white shadow-[0_30px_80px_-50px_rgba(13,6,6,0.45)]";
const BTN_PRIMARY =
  "inline-flex min-h-[56px] items-center justify-center bg-crimson px-8 text-[13px] font-bold uppercase tracking-[0.14em] text-cream transition-colors hover:bg-signal";
const SECTION = "px-4 py-[clamp(56px,9vw,120px)] sm:px-10 lg:px-16";

export default function PhotographersPage() {
  return (
    <>
      <SiteHeader current="/photographers" />
      <main className="classic">
        {/* ── 1. Hero ──────────────────────────────── */}
        <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-cream text-ink">
          <Image src={IMAGES.door} alt="" fill priority sizes="100vw" className="-z-20 object-cover object-[70%_center]" />
          <span
            aria-hidden
            className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(247,242,234,0.98)_0%,rgba(247,242,234,0.92)_42%,rgba(247,242,234,0.35)_75%,rgba(247,242,234,0)_100%)] max-lg:bg-[linear-gradient(180deg,rgba(247,242,234,0.8)_0%,rgba(247,242,234,0.96)_60%)]"
          />
          <div className="mx-auto flex max-w-[1240px] flex-col items-start px-6 pb-[clamp(72px,10vw,128px)] pt-[clamp(56px,9vw,112px)] sm:px-10 lg:min-h-[calc(100svh-80px)] lg:justify-center lg:px-16">
            <div className="max-w-[720px] animate-rise">
              <h1 id="hero-title" className="m-0 font-display text-[clamp(40px,5.6vw,72px)] font-bold leading-[1.04] [text-wrap:balance]">
                Professional Photographer Studio Access
              </h1>
              <p className="m-0 mt-5 font-body text-[clamp(22px,2.4vw,28px)] italic leading-snug text-bark">
                Exclusive Holiday Studio Access for Approved Photographers.
              </p>

              {/* <div className="mt-8 inline-flex items-baseline gap-3 border border-crimson/40 bg-porcelain/85 px-6 py-4 backdrop-blur-sm">
                <span className="font-display text-[clamp(44px,5vw,60px)] font-bold leading-none text-crimson">$75</span>
                <span className="text-[17px] font-medium text-ink">Per Hour</span>
              </div> */}

              <p className="m-0 mt-8 max-w-[52ch] text-[17px] leading-relaxed text-bark">
                Access our beautifully designed holiday photography sets and create unforgettable holiday portraits for your own clients.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href="#apply" className={`${BTN_PRIMARY} sm:shrink-0 sm:whitespace-nowrap`}>
                  Apply to Become a Partner
                </a>
                <Link
                  href="/photographers/book"
                  className="inline-flex min-h-[56px] items-center justify-center border border-crimson px-6 py-3 text-center text-[13px] font-bold uppercase leading-snug tracking-[0.14em] text-crimson transition-colors hover:bg-crimson hover:text-cream sm:shrink-0 sm:whitespace-nowrap sm:px-8"
                >
                  Already Approved? Book Your Session
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. About the program ─────────────────── */}
        <section aria-labelledby="about-title" className={SECTION}>
          <div className="mx-auto max-w-[1180px]">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
              <div>
                <h2 id="about-title" className="m-0 font-display text-[clamp(34px,4.4vw,52px)] font-bold leading-[1.08] text-ink [text-wrap:balance]">
                  A Studio Designed for Your Creativity
                </h2>
                <p className="m-0 mt-6 font-body text-[22px] leading-[1.45] text-bark">
                  Our Holiday Selfie Studio offers professional photographers exclusive access to our beautifully designed holiday photography sets at a special hourly rate.
                </p>
                <p className="m-0 mt-5 max-w-[60ch] text-[16px] leading-relaxed text-muted">
                  Our Photographer Partner Program is designed for photographers looking to utilize our holiday studio on a consistent basis to host client photography
                  sessions throughout the holiday season.
                </p>
              </div>
              <div className="relative aspect-[4/5] overflow-hidden border border-line bg-line p-0 shadow-[0_40px_90px_-50px_rgba(13,6,6,0.6)] sm:aspect-[5/4] lg:aspect-[4/5]">
                <Image src={IMAGES.coupleSnow} alt="A couple seated together on a cream sofa in a snow-covered set" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" style={{ objectPosition: "58% 40%" }} />
              </div>
            </div>

            <ul className="m-0 mt-16 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-5">
              {PHOTOGRAPHER_HIGHLIGHTS.map((h) => (
                <li key={h.title} className="border border-line border-t-2 border-t-crimson bg-white p-6">
                                    <h3 className="m-0 font-display text-[19px] leading-snug text-ink">{h.title}</h3>
                  <p className="m-0 mt-2 text-[14px] leading-relaxed text-muted">{h.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── 3. Pricing ───────────────────────────── */}
        <section aria-labelledby="pricing-title" className={`${SECTION} bg-sand`}>
          <div className="mx-auto grid max-w-[1080px] grid-cols-1 items-start gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <article className={`${CARD} overflow-hidden`}>
              <div className="stripes-red px-6 py-6 text-cream sm:px-10 sm:py-7">
                <p className="m-0 text-[14px] font-medium text-parchment">Approved photographers only</p>
                <h2 id="pricing-title" className="m-0 mt-2 font-display text-[clamp(26px,3vw,32px)] leading-tight">
                  Professional Photographer Studio Access
                </h2>
              </div>
              <div className="px-6 py-8 sm:px-10 sm:py-9">
                <p className="m-0 flex items-baseline gap-2">
                  <span className="font-display text-[64px] font-bold leading-none text-ink">$75</span>
                  <span className="text-[18px] text-muted">/ Hour</span>
                </p>
                <p className="m-0 mt-2 text-[16px] font-medium text-bark">60-Minute Studio Session</p>

                <ul className="m-0 mt-8 flex list-none flex-col gap-3.5 border-t border-line p-0 pt-8">
                  {PHOTOGRAPHER_INCLUDES.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[16px] text-bark">
                      <span aria-hidden className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-crimson text-[11px] font-bold text-cream">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <a href="#apply" className={`${BTN_PRIMARY} mt-9 w-full`}>
                  Apply for Photographer Access
                </a>
                <p className="m-0 mt-4 text-center text-[13px] leading-relaxed text-muted">
                  The $75 rate is exclusively for approved professional photographers and is separate from our regular holiday packages.
                </p>
              </div>
            </article>

            <aside aria-labelledby="hours-title" className="border border-line bg-porcelain p-6 text-ink sm:p-9">
              <h3 id="hours-title" className="m-0 font-display text-[24px] text-ink">
                Studio hours
              </h3>
              <p className="m-0 mt-1 text-[14px] text-crimson">{PHOTOGRAPHER_BOOKING_START}</p>
              <dl className="m-0 mt-6 divide-y divide-line border-y border-line">
                {PHOTOGRAPHER_HOURS.map((row) => (
                  <div key={row.day} className="flex flex-col gap-0.5 py-4 text-[14px] sm:flex-row sm:items-start sm:justify-between sm:gap-5">
                    <dt className="font-medium text-bark">{row.day}</dt>
                    <dd className="m-0 tabular-nums text-muted sm:text-right">
                      {row.hours}
                      {row.sub ? <span className="block">{row.sub}</span> : null}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="m-0 mt-5 text-[14px] leading-relaxed text-muted">Each session is 60 minutes, with a maximum of two photographers per hour.</p>
            </aside>
          </div>
        </section>

        {/* ── 4. Important information ─────────────── */}
        <section aria-labelledby="note-title" className={SECTION}>
          <div className={`${CARD} mx-auto max-w-[880px] border-l-4 border-l-crimson p-6 sm:p-12`}>
            <h2 id="note-title" className="m-0 font-display text-[clamp(28px,3.4vw,38px)] font-bold text-ink">
              Please Note
            </h2>
            <ul className="m-0 mt-7 flex list-none flex-col gap-4 p-0">
              {PHOTOGRAPHER_TERMS.map((term) => (
                <li key={term} className="relative pl-6 text-[16px] leading-relaxed text-bark">
                  <span aria-hidden className="absolute left-0 top-[0.65em] size-1.5 rotate-45 bg-crimson" />
                  {term}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── 5. Partner application ───────────────── */}
        <section id="apply" aria-labelledby="apply-title" className={`${SECTION} scroll-mt-20 bg-sand`}>
          <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div className="lg:sticky lg:top-28">
              <h2 id="apply-title" className="m-0 font-display text-[clamp(32px,4vw,48px)] font-bold leading-[1.08] text-ink [text-wrap:balance]">
                Not Yet an Approved Photographer?
              </h2>
              <p className="m-0 mt-5 font-body text-[21px] leading-[1.45] text-bark">
                We would love to work with you! Complete our Photographer Partner Application to request access to our exclusive studio rental rate.
              </p>
              <p className="m-0 mt-6 text-[14px] leading-relaxed text-muted">
                Questions? Email{" "}
                <a href={`mailto:${BRAND.email}`} className="font-semibold text-crimson underline underline-offset-4 hover:text-ink">
                  {BRAND.email}
                </a>
              </p>
            </div>
            <PhotographerApplication />
          </div>
        </section>

        {/* ── 6. Regular customers ─────────────────── */}
        <section aria-labelledby="regular-title" className={SECTION}>
          <div className="mx-auto flex max-w-[1080px] flex-col gap-8 border border-line border-l-4 border-l-crimson bg-white p-6 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-[560px]">
              <h2 id="regular-title" className="m-0 font-display text-[clamp(26px,3vw,34px)] font-bold leading-tight text-ink">
                Looking to Book a Personal or Family Holiday Photo Session?
              </h2>
              <p className="m-0 mt-4 text-[16px] leading-relaxed text-muted">
                Please select our regular{" "}
                <Link href="/santa" className="font-semibold text-crimson underline underline-offset-4 hover:text-ink">
                  Holiday Experience
                </Link>{" "}
                or{" "}
                <Link href="/studio" className="font-semibold text-crimson underline underline-offset-4 hover:text-ink">
                  Holiday Portrait
                </Link>{" "}
                booking option instead.
              </p>
            </div>
            <Link
              href="/#experiences"
              className="inline-flex min-h-[56px] shrink-0 items-center justify-center border border-ink px-8 text-[13px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-cream"
            >
              Book a Holiday Session
            </Link>
          </div>
        </section>

        {/* ── 7. Final CTA ─────────────────────────── */}
        <section aria-labelledby="final-title" className="relative isolate overflow-hidden bg-sand px-5 py-[clamp(72px,10vw,128px)] text-center text-ink sm:px-10">
          <Image src={IMAGES.nutcrackerStair} alt="" fill sizes="100vw" className="-z-20 object-cover opacity-10" />
          <div className="mx-auto max-w-[640px]">
            <h2 id="final-title" className="m-0 font-display text-[clamp(34px,4.6vw,54px)] font-bold leading-[1.08] [text-wrap:balance]">
              Ready to Create Something Beautiful?
            </h2>
            <p className="m-0 mt-5 font-body text-[22px] leading-[1.45] text-bark">
              Join our Photographer Partner Program and enjoy exclusive access to our holiday photography studio.
            </p>
            <a href="#apply" className={`${BTN_PRIMARY} mt-9`}>
              Apply for Photographer Access
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
