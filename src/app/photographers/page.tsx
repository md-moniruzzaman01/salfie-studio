import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PhotographerApplication } from "@/components/photographers/photographer-application";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  BRAND,
  PHOTOGRAPHER_BOOKING_START,
  PHOTOGRAPHER_FAQ,
  PHOTOGRAPHER_HIGHLIGHTS,
  PHOTOGRAPHER_HOURS,
  PHOTOGRAPHER_INCLUDES,
  PHOTOGRAPHER_TERMS,
} from "@/lib/content";
import { IMAGES } from "@/lib/images";
import { JsonLd } from "@/components/json-ld";
import { SETS } from "@/lib/copy";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, photographerServiceJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Holiday Studio Rental for Photographers · Bloomfield, NJ",
  socialTitle: "Professional Photographer Studio Access · $75 per hour",
  description:
    "Rent our holiday photography sets in Bloomfield, NJ for your own client sessions: $75 per hour for approved photographers. Apply to our Partner Program.",
  socialDescription: "Beautifully styled holiday sets in Bloomfield, NJ for your client sessions. Apply to join the Photographer Partner Program.",
  path: "/photographers",
  image: { url: "/og-photographers.jpg", alt: "Holiday photography studio sets for professional photographers in Bloomfield, NJ" },
});

const CARD = "border border-line bg-white shadow-[0_30px_80px_-50px_rgba(13,6,6,0.45)]";
const BTN_PRIMARY =
  "inline-flex min-h-[56px] items-center justify-center bg-crimson px-8 text-[13px] font-bold uppercase tracking-[0.14em] text-cream transition-colors hover:bg-signal";
const SECTION = "px-4 py-[clamp(56px,9vw,120px)] sm:px-10 lg:px-16";

export default function PhotographersPage() {
  return (
    <>
      <JsonLd data={photographerServiceJsonLd()} />
      <JsonLd data={breadcrumbJsonLd([{ name: "For photographers", path: "/photographers" }])} />
      <JsonLd data={faqJsonLd(PHOTOGRAPHER_FAQ)} />
      <SiteHeader current="/photographers" />
      <main id="main" className="classic">
        {/* ── 1. Hero ──────────────────────────────── */}
        <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-cream text-ink">
          <span aria-hidden className="absolute inset-y-0 right-0 -z-10 hidden w-[46%] bg-sand lg:block" />
          <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-12 px-6 pb-[clamp(48px,6vw,80px)] pt-[clamp(32px,5vw,64px)] sm:px-10 lg:min-h-[min(calc(100svh-80px),780px)] lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:px-16">
            <div className="animate-rise">
              <p className="m-0 flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.2em] text-crimson">
                <span aria-hidden className="h-px w-10 bg-crimson" />
                Photographer Partner Program
              </p>
              <h1 id="hero-title" className="m-0 mt-5 font-display text-[clamp(38px,4.8vw,60px)] font-bold leading-[1.04] [text-wrap:balance]">
                Professional Photographer Studio Access
              </h1>
              <p className="m-0 mt-4 font-body text-[clamp(21px,2.2vw,26px)] italic leading-snug text-bark">
                Beautifully styled holiday sets for approved photographers and their clients.
              </p>

              <p className="m-0 mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-display text-[clamp(40px,4.4vw,52px)] font-bold leading-none text-crimson">$75</span>
                <span className="text-[17px] font-medium text-ink">per hour</span>
                <span className="w-full text-[15px] text-muted">60-minute sessions · approved partners only</span>
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href="#apply" className={`${BTN_PRIMARY} sm:shrink-0 sm:whitespace-nowrap`}>
                  Apply to Become a Partner
                </a>
                <Link
                  href="/photographers/book"
                  className="inline-flex min-h-[56px] items-center justify-center border border-crimson px-8 text-center text-[13px] font-bold uppercase leading-snug tracking-[0.14em] text-crimson transition-colors hover:bg-crimson hover:text-cream sm:shrink-0 sm:whitespace-nowrap"
                >
                  Already Approved? Book Now
                </Link>
              </div>

              <dl className="m-0 mt-8 grid max-w-[520px] grid-cols-3 gap-4 border-t border-line pt-6">
                {[
                  ["8", "styled holiday sets"],
                  ["60", "minutes per session"],
                  ["2", "photographers max per hour"],
                ].map(([figure, label]) => (
                  <div key={label}>
                    <dt className="font-display text-[34px] font-bold leading-none text-ink">{figure}</dt>
                    <dd className="m-0 mt-1.5 text-[13px] leading-snug text-muted">{label}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative mx-auto w-full max-w-[560px] animate-rise [animation-delay:.12s] lg:max-w-none">
              <div className="relative aspect-[1/1] w-full overflow-hidden border border-line bg-line shadow-[0_40px_90px_-45px_rgba(13,6,6,0.6)] max-lg:aspect-[5/4]">
                <Image
                  src={IMAGES.door}
                  alt="Woman in a faux-fur jacket under a white winter floral arch at The Selfie Studio Experience in Bloomfield, NJ"
                  fill
                  priority
                  fetchPriority="high"
                  quality={70}
                  sizes="(min-width: 1024px) 46vw, 92vw"
                  className="object-cover"
                  style={{ objectPosition: "50% 30%" }}
                />
                <span aria-hidden className="stripes-red absolute inset-x-0 top-0 h-2" />
              </div>
              <div className="absolute -bottom-6 -left-4 hidden w-[34%] overflow-hidden border-4 border-cream bg-line shadow-[0_24px_60px_-30px_rgba(13,6,6,0.7)] sm:block lg:-left-10">
                <div className="relative aspect-[4/5]">
                  <Image
                    src={IMAGES.nutcrackerStair}
                    alt="Nutcracker beside a red velvet staircase on a glamorous holiday set in Bloomfield, NJ"
                    fill
                    quality={60}
                    sizes="(min-width: 1024px) 16vw, 30vw"
                    className="object-cover"
                    style={{ objectPosition: "50% 36%" }}
                  />
                </div>
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
                  Our Holiday Selfie Studio gives professional photographers access to our beautifully designed holiday photography sets at a special partner rate.
                </p>
                <p className="m-0 mt-5 max-w-[60ch] text-[16px] leading-relaxed text-muted">
                  Our Photographer Partner Program is designed for photographers looking to utilize our holiday studio on a consistent basis to host client photography
                  sessions throughout the holiday season.
                </p>
              </div>
              <div className="relative aspect-[4/5] overflow-hidden border border-line bg-line p-0 shadow-[0_40px_90px_-50px_rgba(13,6,6,0.6)] sm:aspect-[5/4] lg:aspect-[4/5]">
                <Image src={IMAGES.coupleSnow} alt="A couple seated together on a cream sofa in the snow-covered holiday set, available to partner photographers at The Selfie Studio Experience in Bloomfield, NJ" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" style={{ objectPosition: "58% 40%" }} />
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

        {/* ── 2b. The sets ─────────────────────────── */}
        <section aria-labelledby="sets-title" className={`${SECTION} bg-white`}>
          <div className="mx-auto max-w-[1180px]">
            <div className="max-w-[640px]">
              <h2 id="sets-title" className="m-0 font-display text-[clamp(30px,4vw,46px)] font-bold leading-[1.08] text-ink [text-wrap:balance]">
                Eight Styled Sets Ready for Your Clients
              </h2>
              <p className="m-0 mt-5 font-body text-[21px] leading-[1.45] text-bark">
                From snowy winter whites to a gingerbread house, a bakery kitchen and a black and gold tree, every set is dressed and waiting when your session begins.
              </p>
            </div>
            <ul className="m-0 mt-10 grid list-none grid-cols-2 gap-3 p-0 sm:gap-4 lg:grid-cols-4">
              {SETS.filter((s) => s.image).map((s, i) => (
                <li key={s.num} className={`relative overflow-hidden border border-line bg-line ${i === 0 ? "col-span-2 aspect-[8/5] lg:aspect-auto" : "aspect-[4/5]"}`}>
                  <Image
                    src={s.image!}
                    alt={s.alt ?? s.name}
                    fill
                    quality={60}
                    sizes={i === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                    className="object-cover"
                    style={{ objectPosition: s.position }}
                  />
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
                  The $75 rate is only for approved professional photographers and is separate from our regular holiday packages.
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
                We would love to work with you! Complete our Photographer Partner Application to request access to our partner studio rental rate.
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

        {/* ── 5b. Photographer FAQ ─────────────────── */}
        <section id="faq" aria-labelledby="faq-title" className={`${SECTION} scroll-mt-20`}>
          <div className="mx-auto grid max-w-[1080px] grid-cols-1 gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <h2 id="faq-title" className="m-0 font-display text-[clamp(30px,4vw,46px)] font-bold leading-[1.08] text-ink [text-wrap:balance]">
                Photographer Questions
              </h2>
              <p className="m-0 mt-5 font-body text-[21px] leading-[1.45] text-bark">
                Approval, booking and what to expect on the day.
              </p>
            </div>
            <div className="border-b border-line">
              {PHOTOGRAPHER_FAQ.map((item) => (
                <details key={item.q} className="group border-t border-line">
                  <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-6 py-4 text-left font-display text-[19px] font-bold leading-snug text-ink transition-colors hover:text-crimson [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span aria-hidden className="relative size-4 shrink-0 text-crimson">
                      <span className="absolute left-0 top-1/2 h-px w-full bg-current" />
                      <span className="absolute left-1/2 top-0 h-full w-px bg-current transition-transform group-open:scale-y-0" />
                    </span>
                  </summary>
                  <p className="m-0 max-w-[62ch] pb-6 text-[16px] leading-relaxed text-bark">{item.a}</p>
                </details>
              ))}
            </div>
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
                  Photos with Santa
                </Link>{" "}
                or{" "}
                <Link href="/portrait-studio" className="font-semibold text-crimson underline underline-offset-4 hover:text-ink">
                  Holiday Portrait Studio
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
          <Image src={IMAGES.nutcrackerStair} alt="Nutcracker beside a red velvet staircase on a glamorous holiday set in Bloomfield, NJ" fill sizes="100vw" className="-z-20 object-cover opacity-10" />
          <div className="mx-auto max-w-[640px]">
            <h2 id="final-title" className="m-0 font-display text-[clamp(34px,4.6vw,54px)] font-bold leading-[1.08] [text-wrap:balance]">
              Ready to Create Something Beautiful?
            </h2>
            <p className="m-0 mt-5 font-body text-[22px] leading-[1.45] text-bark">
              Join our Photographer Partner Program and bring your clients into our holiday photography studio this season.
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
