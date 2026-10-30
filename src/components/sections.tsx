import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { BookButton } from "@/components/booking/book-button";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { BRAND } from "@/lib/content";
import { IMAGE_ALT, IMAGES } from "@/lib/images";

const arrow = (
  <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1">
    →
  </span>
);

const SECTION = "px-6 py-[clamp(72px,10vw,120px)] sm:px-10 lg:px-16";

/** Two full-bleed photo panels; the hovered one grows (desktop). */
export function ExperiencePanels() {
  const panels = [
    {
      href: "/santa",
      image: IMAGES.santaSack,
      position: "60% 30%",
      overlay: "from-velvet/0 via-velvet/40 to-velvet/95",
      eyebrow: "Part 01 · 8 dates · 11 AM – 7 PM",
      title: "Photos with Santa",
      body: "Create magical memories that last a lifetime. Two 4×6 prints and all digitals.",
      price: "From $34.99",
    },
    {
      href: "/studio",
      image: IMAGES.carousel,
      position: "50% 40%",
      overlay: "from-ink/0 via-ink/40 to-ink/90",
      eyebrow: "Part 02 · 8 backdrops · 1 hour",
      title: "The Portrait Studio",
      body: "Eight beautiful backdrops, endless possibilities. Shoot it yourself, bring a photographer, or book ours.",
      price: "From $24.99 / person",
    },
  ];
  return (
    <section id="experiences" aria-label="Choose your experience" className="bg-velvet">
      <Reveal className="flex flex-col items-center gap-2 px-6 pb-[clamp(32px,5vw,56px)] pt-[clamp(56px,8vw,96px)] text-center">
        <span className="eyebrow text-gold">Choose your experience</span>
        <h2 className="m-0 max-w-[16ch] font-display text-[clamp(28px,4.4vw,48px)] font-bold leading-[1.05] text-cream">
          Two ways to make it magical
        </h2>
      </Reveal>
      <div className="group/panels grid grid-cols-2 lg:flex lg:flex-wrap">
        {panels.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden p-4 text-cream transition-[flex-grow] duration-700 ease-[cubic-bezier(.2,.8,.2,1)] sm:p-6 lg:aspect-auto lg:min-h-[560px] lg:flex-[1_1_480px] lg:p-[clamp(32px,5vw,56px)] lg:hover:flex-grow-[1.35]"
          >
            <Image
              src={p.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 50vw"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-105"
              style={{ objectPosition: p.position }}
            />
            <span aria-hidden className={`absolute inset-0 bg-gradient-to-b ${p.overlay}`} />
            <span className="relative flex flex-col gap-1.5 sm:gap-3">
              <span className="eyebrow hidden text-gold sm:block">{p.eyebrow}</span>
              <span className="font-display text-[20px] font-bold leading-[1.05] sm:text-[28px] lg:text-[clamp(34px,4.6vw,64px)] lg:leading-[1.02]">
                {p.title}
              </span>
              <span className="hidden max-w-[440px] text-[16px] leading-relaxed text-parchment sm:block">{p.body}</span>
              <span className="mt-1 flex items-center justify-between gap-2 border-t border-cream/25 pt-3 sm:mt-2 sm:pt-5">
                <span className="font-display text-sm sm:text-xl">{p.price}</span>
                <span className="hidden items-center gap-2 text-[13px] font-bold uppercase tracking-[0.14em] text-gold sm:inline-flex">
                  See more {arrow}
                </span>
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

const MARQUEE = ["Step in.", "Strike a pose.", "Make it yours.", "Good photos, better memories."];

export function Marquee() {
  const items = [...MARQUEE, ...MARQUEE];
  return (
    <div aria-hidden className="overflow-hidden border-y border-line bg-crimson py-4 text-cream">
      <div className="flex w-max animate-marquee items-center whitespace-nowrap font-display text-[clamp(22px,3vw,32px)] italic">
        {items.map((t, i) => (
          <span key={i} className="flex items-center">
            <span className="px-7">{t}</span>
            <span className="text-gold not-italic">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Gallery() {
  const photos = [
    { src: IMAGES.door, alt: IMAGE_ALT.door, pos: "50% 50%" },
    { src: IMAGES.santaMailbox, alt: IMAGE_ALT.santaMailbox, pos: "60% 40%" },
    { src: IMAGES.carousel, alt: IMAGE_ALT.carousel, pos: "50% 50%" },
    { src: IMAGES.santaSack, alt: IMAGE_ALT.santaSack, pos: "60% 30%" },
    { src: IMAGES.mailbox, alt: IMAGE_ALT.mailbox, pos: "50% 50%" },
  ];
  return (
    <section className={SECTION}>
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading script="A moment, framed" title="Same people. New sets." />
          <a href={BRAND.instagramUrl} target="_blank" rel="noreferrer" className="link-grow text-[13px] font-semibold uppercase tracking-[0.16em] text-ink">
            {BRAND.instagram} →
          </a>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {photos.map((p, i) => (
            <Reveal key={p.alt} delay={i * 0.06} className="group relative aspect-[3/4] overflow-hidden border border-line">
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-105"
                style={{ objectPosition: p.pos }}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    { n: "01", title: "Pick your experience", body: "Santa, the studio, or both — on one of 8 dates." },
    { n: "02", title: "Reserve in a tap", body: "Apple Pay, Google Pay or card, secured by Square." },
    { n: "03", title: "Step in & strike a pose", body: "We handle the magic. You take the memories home." },
  ];
  return (
    <section className={`bg-sand ${SECTION}`}>
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10">
        <Reveal>
          <SectionHeading script="How it works" title="Booked in three taps" />
        </Reveal>
        <ol className="m-0 grid list-none gap-6 p-0 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 0.08} className="flex flex-col gap-4 border-t border-ink/70 pt-6">
              <span className="font-display text-[22px] italic leading-none text-crimson">{s.n}</span>
              <div className="flex flex-col gap-2">
                <span className="font-display text-[24px] leading-tight text-ink">{s.title}</span>
                <span className="text-[16px] leading-relaxed text-muted">{s.body}</span>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function PriceRow({ name, note, price, last }: { name: ReactNode; note?: string; price: string; last?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between gap-4 py-4 ${last ? "" : "border-b border-cream/15"}`}>
      <span>
        <span className="block font-display text-[20px] leading-tight">{name}</span>
        {note ? <span className="mt-0.5 block text-[14px] leading-snug text-parchment/85">{note}</span> : null}
      </span>
      <span className="whitespace-nowrap font-display text-[26px] font-bold">{price}</span>
    </div>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className={`bg-velvet text-cream ${SECTION}`}>
      <div className="mx-auto flex max-w-[1180px] flex-col gap-10">
        <Reveal>
          <SectionHeading script="Make it magical" title="Prices" tone="light" align="center" />
        </Reveal>
        <div className="flex flex-wrap gap-6">
          <Reveal className="flex flex-[1_1_340px] flex-col gap-1 border border-cream/15 p-8">
            <div className="eyebrow mb-3 text-gold">Photos with Santa · 2 prints &amp; all digitals</div>
            <PriceRow name="1 sitting · 1 child" note="Early bird $34.99 when purchased Oct 15–31" price="$39.99" />
            <PriceRow name="2 kids" price="$50" />
            <PriceRow
              name={
                <>
                  Family <span className="font-body text-[18px]">(up to 6 people)</span>
                </>
              }
              price="$75"
              last
            />
            <BookButton preset="santa" className="mt-6 min-h-[54px] bg-gold text-[13px] font-bold uppercase tracking-[0.14em] text-velvet transition-colors hover:bg-cream">
              Book Photos with Santa
            </BookButton>
          </Reveal>
          <Reveal delay={0.08} className="flex flex-[1_1_340px] flex-col gap-1 border border-cream/15 p-8">
            <div className="eyebrow mb-3 text-gold">The Portrait Studio · 8 backdrops</div>
            <PriceRow name="Selfie Studio Access" note="Per person · 1 hour · unlimited phone photos" price="$24.99" />
            <PriceRow name="Professional Photos" note="By our photographer · all digital photos" price="$200" />
            <PriceRow name="Bring Your Own Photographer" note="Private session · 1 hour" price="$100" last />
            <BookButton preset="selfie" className="mt-6 min-h-[54px] bg-cream text-[13px] font-bold uppercase tracking-[0.14em] text-velvet transition-colors hover:bg-gold">
              Book the Portrait Studio
            </BookButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Reviews() {
  return (
    <section className={SECTION}>
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10">
        <Reveal>
          <SectionHeading script="Kind words" title="What they're saying" />
        </Reveal>
        <Reveal className="flex flex-wrap gap-6">
          <div className="flex flex-[1_1_260px] flex-col items-center justify-center gap-4 border border-line bg-sand px-8 py-12 text-center">
            <div className="text-xl tracking-[8px] text-crimson">★★★★★</div>
            <div className="font-display text-[clamp(56px,8vw,84px)] font-bold leading-none text-crimson">5.0</div>
            <div className="eyebrow text-muted">Early reviews</div>
          </div>
          <div className="flex flex-[2_1_360px] flex-col justify-center gap-4 border border-line bg-porcelain p-6 sm:p-10">
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
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Faq({ items, title, id = "faq" }: { items: { q: string; a: string }[]; title: string; id?: string }) {
  return (
    <section id={id} className={`bg-sand ${SECTION}`}>
      <div className="mx-auto flex max-w-[860px] flex-col gap-8">
        <Reveal>
          <SectionHeading script="Good to know" title={title} />
        </Reveal>
        <Reveal className="flex flex-col border-t border-line2">
          {items.map((item, i) => (
            <details key={item.q} open={i === 0} className="group border-b border-line2">
              <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-4 py-5 [&::-webkit-details-marker]:hidden">
                <span className="font-display text-[21px] leading-tight">{item.q}</span>
                <span aria-hidden className="shrink-0 text-[24px] leading-none text-crimson transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="m-0 pb-6 pr-8 text-[16px] leading-relaxed text-bark">{item.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function ClosingCta() {
  return (
    <section className="relative overflow-hidden text-center text-cream">
      <Image src={IMAGES.door} alt="" fill sizes="100vw" className="object-cover" style={{ objectPosition: "50% 45%" }} />
      <span aria-hidden className="absolute inset-0 bg-velvet/88" />
      <Reveal className="relative mx-auto flex max-w-[760px] flex-col items-center gap-4 px-6 py-[clamp(80px,13vw,140px)]">
        <span className="eyebrow text-gold">Weekends fill fast</span>
        <h2 className="m-0 font-display text-[clamp(36px,7vw,72px)] font-bold leading-[1.02]">
          Step in. Strike a pose. <em className="italic text-gold">Make it yours.</em>
        </h2>
        <p className="m-0 max-w-[40ch] text-[17px] text-parchment">Reserve your spot for the 2026 holiday season before the dates are gone.</p>
        <div className="mt-2 flex w-full flex-wrap justify-center gap-3">
          <BookButton preset="santa" className="min-h-14 max-w-[300px] flex-[1_1_240px] bg-gold text-[13px] font-bold uppercase tracking-[0.14em] text-velvet transition-colors hover:bg-cream">
            Book Photos with Santa
          </BookButton>
          <BookButton preset="selfie" className="min-h-14 max-w-[300px] flex-[1_1_240px] border border-cream/70 text-[13px] font-bold uppercase tracking-[0.14em] transition-colors hover:bg-cream hover:text-velvet">
            Book the Portrait Studio
          </BookButton>
        </div>
      </Reveal>
    </section>
  );
}

export function CrossSell({ to }: { to: "santa" | "studio" }) {
  const santa = to === "santa";
  return (
    <section className="px-6 py-[clamp(48px,7vw,80px)] sm:px-10 lg:px-16">
      <Reveal>
        <Link
          href={santa ? "/santa" : "/studio"}
          className={`group mx-auto flex max-w-[1180px] flex-wrap overflow-hidden text-cream transition-transform duration-300 hover:-translate-y-1 ${santa ? "bg-crimson" : "bg-ink"}`}
        >
          <div className="relative min-h-[260px] flex-[1_1_320px] overflow-hidden">
            <Image
              src={santa ? IMAGES.santaMailbox : IMAGES.carousel}
              alt=""
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ objectPosition: santa ? "55% 30%" : "50% 50%" }}
            />
          </div>
          <div className="flex flex-[1_1_360px] flex-col justify-center gap-3 px-6 py-8 sm:px-8 sm:py-10">
            <span className="eyebrow text-gold">Make it a double</span>
            <div className="font-display text-[clamp(28px,3.4vw,38px)] font-bold leading-tight">
              {santa ? "Photos with Santa" : "The Portrait Studio"}
            </div>
            <div className="text-[16px] text-parchment">
              {santa ? "2 4×6 prints & all digitals · from $34.99 early bird" : "8 beautiful backdrops · 1 hour · from $24.99 per person"}
            </div>
            <span className="mt-2 inline-flex min-h-12 items-center gap-2 self-start px-6 text-[13px] font-bold uppercase tracking-[0.14em] bg-cream text-ink">
              {santa ? "Meet Santa" : "See the studio"} {arrow}
            </span>
          </div>
        </Link>
      </Reveal>
    </section>
  );
}
