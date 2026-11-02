import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { BookButton } from "@/components/booking/book-button";
import { ClayCamera } from "@/components/motion/clay-camera";
import { ClayGiftBox, ClayOrnament, ClayStar } from "@/components/motion/clay-shapes";
import { Reveal } from "@/components/motion/reveal";
import { ScrollFx } from "@/components/motion/scroll-fx";
import { SplitReveal } from "@/components/motion/split-reveal";
import { Tilt } from "@/components/motion/tilt";
import { VelocityMarquee } from "@/components/motion/velocity-marquee";
import { EarlyBirdNote, SantaFromPrice } from "@/components/santa-price-strip";
import { SectionHeading } from "@/components/section-heading";
import { BRAND } from "@/lib/content";
import { IMAGES } from "@/lib/images";

export { Faq } from "@/components/faq";
export { GalleryStrip as Gallery } from "@/components/gallery-strip";
export { HowItWorks } from "@/components/how-it-works";

const arrow = (
  <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1">
    →
  </span>
);

const SECTION = "px-6 py-[clamp(72px,10vw,120px)] sm:px-10 lg:px-16";

/** Two full-bleed sets that wipe open on arrival; the hovered one grows (desktop). */
export function ExperiencePanels() {
  const panels = [
    {
      href: "/santa",
      image: IMAGES.santaSack,
      position: "60% 30%",
      overlay: "from-velvet/0 via-velvet/55 to-velvet/95",
      eyebrow: "Part 01 · 8 dates · 11 AM – 7 PM",
      title: "Photos with Santa",
      body: "Create magical memories that last a lifetime. Two 4×6 prints and all digitals.",
      price: <SantaFromPrice />,
    },
    {
      href: "/studio",
      image: IMAGES.carousel,
      position: "50% 40%",
      overlay: "from-ink/0 via-ink/55 to-ink/95",
      eyebrow: "Part 02 · 8 backdrops · 1 hour",
      title: "The Portrait Studio",
      body: "Eight beautiful backdrops, endless possibilities. Shoot it yourself, bring a photographer, or book ours.",
      price: "From $24.99 / person",
    },
  ];
  return (
    <ScrollFx as="section" id="experiences" aria-label="Choose your experience" className="grain bg-velvet">
      <div className="flex flex-col items-center gap-2 px-6 pb-[clamp(32px,5vw,56px)] pt-[clamp(56px,8vw,96px)] text-center">
        <span className="eyebrow text-gold">Choose your experience</span>
        <SplitReveal className="m-0 max-w-[16ch] font-display text-[clamp(28px,4.4vw,52px)] font-bold leading-[1.05] text-cream">
          Two ways to make it magical
        </SplitReveal>
      </div>
      <div className="grid grid-cols-2 lg:flex lg:flex-wrap">
        {panels.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            data-clip
            className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden p-4 text-cream transition-[flex-grow] duration-700 ease-[cubic-bezier(.2,.8,.2,1)] sm:p-6 lg:aspect-auto lg:min-h-[600px] lg:flex-[1_1_480px] lg:p-[clamp(32px,5vw,56px)] lg:hover:flex-grow-[1.35]"
          >
            <span data-parallax="0.18" className="absolute inset-x-0 -inset-y-[12%]">
              <Image
                src={p.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 60vw, 50vw"
                className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.06]"
                style={{ objectPosition: p.position }}
              />
            </span>
            <span aria-hidden className={`absolute inset-0 bg-gradient-to-b ${p.overlay}`} />
            <span className="relative flex flex-col gap-1.5 transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] sm:gap-3 lg:group-hover:-translate-y-2">
              <span className="eyebrow hidden text-gold [text-shadow:0_1px_8px_rgba(0,0,0,0.6)] sm:block">{p.eyebrow}</span>
              <span className="font-display text-[20px] font-bold leading-[1.05] sm:text-[28px] lg:text-[clamp(34px,4.6vw,64px)] lg:leading-[1.02]">{p.title}</span>
              <span className="hidden max-w-[440px] text-[16px] leading-relaxed text-parchment sm:block">{p.body}</span>
              <span className="mt-1 flex items-center justify-between gap-2 border-t border-cream/25 pt-3 sm:mt-2 sm:pt-5">
                <span className="font-display text-sm sm:text-xl">{p.price}</span>
                <span className="hidden items-center gap-2 text-[13px] font-bold uppercase tracking-[0.14em] text-gold sm:inline-flex">See more {arrow}</span>
              </span>
            </span>
          </Link>
        ))}
      </div>
    </ScrollFx>
  );
}

export function Marquee() {
  return <VelocityMarquee items={["Step in.", "Strike a pose.", "Make it yours.", "Good photos, better memories."]} />;
}

function PriceRow({ name, note, price, count, decimals = 0, last }: { name: ReactNode; note?: ReactNode; price: string; count: number; decimals?: number; last?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between gap-4 py-4 ${last ? "" : "border-b border-cream/15"}`}>
      <span>
        <span className="block font-display text-[20px] leading-tight">{name}</span>
        {typeof note === "string" ? <span className="mt-0.5 block text-[14px] leading-snug text-parchment/85">{note}</span> : note}
      </span>
      <span data-count={count} data-decimals={decimals} data-prefix="$" className="whitespace-nowrap font-display text-[26px] font-bold tabular-nums">
        {price}
      </span>
    </div>
  );
}

/** Two price cards that lean toward the pointer, each with its clay mascot hovering off the corner. */
export function Pricing() {
  return (
    <ScrollFx as="section" id="pricing" className={`grain scroll-mt-20 overflow-hidden bg-velvet text-cream ${SECTION}`}>
      <div className="relative mx-auto flex max-w-[1180px] flex-col gap-12">
        <SectionHeading script="Make it magical" title="Prices" tone="light" align="center" />
        <div className="grid gap-8 md:grid-cols-2">
          <Reveal className="h-full">
            <Tilt glare className="h-full" innerClassName="flex flex-col gap-1 border border-cream/15 bg-white/[0.03] p-8 sm:p-10">
              <div aria-hidden data-pop className="pointer-events-none absolute -right-5 -top-8 w-[72px] sm:w-[84px]">
                <ClayOrnament style={{ position: "relative", width: "100%" }} rotate={12} floating={false} />
              </div>
              <div className="eyebrow mb-3 text-gold">Photos with Santa · 2 prints &amp; all digitals</div>
              <PriceRow name="1 sitting · 1 child" note={<EarlyBirdNote className="mt-0.5 block text-[14px] leading-snug text-parchment/85" />} price="$39.99" count={39.99} decimals={2} />
              <PriceRow name="2 kids" price="$50" count={50} />
              <PriceRow
                name={
                  <>
                    Family <span className="font-body text-[18px]">(up to 6 people)</span>
                  </>
                }
                price="$75"
                count={75}
                last
              />
              <BookButton preset="santa" className="mt-6 min-h-[54px] bg-gold text-[13px] font-bold uppercase tracking-[0.14em] text-velvet transition-colors hover:bg-cream">
                Book Photos with Santa
              </BookButton>
            </Tilt>
          </Reveal>
          <Reveal delay={0.08} className="h-full">
            <Tilt glare className="h-full" innerClassName="flex flex-col gap-1 border border-cream/15 bg-white/[0.03] p-8 sm:p-10">
              <div aria-hidden data-pop className="pointer-events-none absolute -right-6 -top-10 w-[96px] rotate-[10deg] sm:w-[112px]">
                <ClayCamera className="w-full" />
              </div>
              <div className="eyebrow mb-3 text-gold">The Portrait Studio · 8 backdrops</div>
              <PriceRow name="Selfie Studio Access" note="Per person · 1 hour · unlimited phone photos" price="$24.99" count={24.99} decimals={2} />
              <PriceRow name="Professional Photos" note="By our photographer · all digital photos" price="$200" count={200} />
              <PriceRow name="Bring Your Own Photographer" note="Private session · 1 hour" price="$100" count={100} last />
              <BookButton preset="selfie" className="mt-6 min-h-[54px] bg-cream text-[13px] font-bold uppercase tracking-[0.14em] text-velvet transition-colors hover:bg-gold">
                Book the Portrait Studio
              </BookButton>
            </Tilt>
          </Reveal>
        </div>
      </div>
    </ScrollFx>
  );
}

export function Reviews() {
  return (
    <ScrollFx as="section" className={SECTION}>
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10">
        <SectionHeading script="Kind words" title="What they're saying" />
        <div className="flex flex-wrap gap-6">
          <Reveal className="flex-[1_1_260px]">
            <Tilt className="h-full" innerClassName="flex h-full flex-col items-center justify-center gap-4 border border-line bg-sand px-8 py-12 text-center">
              <div className="text-xl tracking-[8px] text-crimson">★★★★★</div>
              <div data-count={5} data-decimals={1} data-pop className="font-display text-[clamp(56px,8vw,84px)] font-bold leading-none text-crimson tabular-nums">
                5.0
              </div>
              <div className="eyebrow text-muted">Early reviews</div>
            </Tilt>
          </Reveal>
          <Reveal delay={0.08} className="flex flex-[2_1_360px] flex-col justify-center gap-4 border border-line bg-porcelain p-6 sm:p-10">
            <span className="eyebrow text-crimson">Share your experience</span>
            <div className="font-display text-[clamp(24px,3vw,36px)] font-bold leading-tight">Did we make your holiday magical?</div>
            <p className="max-w-[48ch] text-[16px] leading-relaxed text-muted">
              We&apos;d love to hear your story — and so would the families discovering us for the first time. Tag us on Instagram or leave us a review.
            </p>
            <a
              href={BRAND.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="group mt-1 inline-flex min-h-[52px] w-full items-center justify-center gap-3 border border-ink px-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-cream sm:w-fit sm:px-6 sm:text-[13px] sm:tracking-[0.16em]"
            >
              {BRAND.instagram} {arrow}
            </a>
          </Reveal>
        </div>
      </div>
    </ScrollFx>
  );
}

/** The finale opens like a camera iris, with the clay cast drifting in the frame. */
export function ClosingCta() {
  return (
    <ScrollFx as="section" className="relative overflow-hidden bg-cream text-center text-cream">
      <div data-aperture className="relative overflow-hidden bg-velvet">
        <span data-parallax="0.25" className="absolute inset-x-0 -inset-y-[15%]">
          <Image src={IMAGES.door} alt="" fill sizes="100vw" className="object-cover" style={{ objectPosition: "50% 45%" }} />
        </span>
        <span aria-hidden className="absolute inset-0 bg-velvet/85" />
        <div data-parallax="-0.6" className="absolute left-[7%] top-[14%] hidden w-[clamp(52px,6vw,80px)] sm:block">
          <div className="animate-float" style={{ "--float-rotate": "-8deg" } as CSSProperties}>
            <ClayOrnament style={{ position: "relative", width: "100%" }} floating={false} />
          </div>
        </div>
        <div data-parallax="-0.9" className="absolute right-[9%] top-[16%] hidden aspect-square w-[clamp(40px,5vw,64px)] sm:block">
          <div className="size-full animate-float [animation-delay:-2s]" style={{ "--float-rotate": "10deg" } as CSSProperties}>
            <ClayStar style={{ position: "relative", width: "100%", height: "100%" }} floating={false} />
          </div>
        </div>
        <div data-parallax="-0.4" className="absolute bottom-[10%] left-[12%] hidden w-[clamp(70px,8vw,110px)] lg:block">
          <ClayGiftBox
            box="var(--color-gold)"
            boxLight="#f3dca0"
            boxDark="#8f6f2e"
            ribbon="#fefaf9"
            ribbonLight="#ffffff"
            ribbonDark="#d9bdbb"
            rotate={-12}
            floating={false}
            style={{ position: "relative", width: "100%" }}
          />
        </div>
        <div data-parallax="-0.7" className="absolute bottom-[12%] right-[10%] hidden w-[clamp(90px,10vw,140px)] lg:block">
          <ClayCamera className="w-full rotate-[-8deg]" />
        </div>
        <div className="relative mx-auto flex max-w-[960px] flex-col items-center gap-5 px-6 py-[clamp(96px,15vw,170px)]">
          <span className="eyebrow text-gold">Weekends fill fast</span>
          <SplitReveal className="m-0 flex flex-col font-display text-[clamp(34px,5.6vw,76px)] font-bold leading-[1.04]">
            <span>
              Step in. <span className="whitespace-nowrap">Strike a pose.</span>
            </span>
            <em className="italic text-gold">Make it yours.</em>
          </SplitReveal>
          <p className="m-0 max-w-[40ch] text-[17px] text-parchment">Reserve your spot for the 2026 holiday season before the dates are gone.</p>
          <div className="mt-2 flex w-full flex-wrap justify-center gap-3">
            <BookButton preset="santa" className="min-h-14 max-w-[300px] flex-[1_1_240px] bg-gold text-[13px] font-bold uppercase tracking-[0.14em] text-velvet transition-colors hover:bg-cream">
              Book Photos with Santa
            </BookButton>
            <BookButton
              preset="selfie"
              className="min-h-14 max-w-[300px] flex-[1_1_240px] border border-cream/70 text-[13px] font-bold uppercase tracking-[0.14em] transition-colors hover:bg-cream hover:text-velvet"
            >
              Book the Portrait Studio
            </BookButton>
          </div>
        </div>
      </div>
    </ScrollFx>
  );
}

export function CrossSell({ to }: { to: "santa" | "studio" }) {
  const santa = to === "santa";
  return (
    <ScrollFx as="section" className="px-6 py-[clamp(48px,7vw,80px)] sm:px-10 lg:px-16">
      <Reveal className="mx-auto max-w-[1180px]">
        <Tilt max={4} glare>
          <Link href={santa ? "/santa" : "/studio"} className={`group flex flex-wrap overflow-hidden text-cream ${santa ? "bg-crimson" : "bg-ink"}`}>
            <div className="relative min-h-[280px] flex-[1_1_320px] overflow-hidden">
              <span data-parallax="0.2" className="absolute inset-x-0 -inset-y-[14%]">
                <Image
                  src={santa ? IMAGES.santaMailbox : IMAGES.carousel}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ objectPosition: santa ? "55% 30%" : "50% 50%" }}
                />
              </span>
            </div>
            <div className="flex flex-[1_1_360px] flex-col justify-center gap-3 px-6 py-8 sm:px-10 sm:py-12">
              <span className="eyebrow text-gold">Make it a double</span>
              <div className="font-display text-[clamp(28px,3.4vw,40px)] font-bold leading-tight">{santa ? "Photos with Santa" : "The Portrait Studio"}</div>
              <div className="text-[16px] text-parchment">
                {santa ? (
                  <>
                    2 4×6 prints &amp; all digitals · <SantaFromPrice />
                  </>
                ) : (
                  "8 beautiful backdrops · 1 hour · from $24.99 per person"
                )}
              </div>
              <span className="mt-2 inline-flex min-h-12 items-center gap-2 self-start bg-cream px-6 text-[13px] font-bold uppercase tracking-[0.14em] text-ink">
                {santa ? "Meet Santa" : "See the studio"} {arrow}
              </span>
            </div>
          </Link>
        </Tilt>
      </Reveal>
    </ScrollFx>
  );
}
