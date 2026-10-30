import Image from "next/image";
import { BookButton } from "@/components/booking/book-button";
import { BRAND } from "@/lib/content";
import { IMAGE_ALT, IMAGES } from "@/lib/images";

const FACTS: [string, string][] = [
  ["Season", BRAND.season],
  ["Santa", BRAND.santaHours],
  ["Location", "77–79 Washington St"],
];

/**
 * Editorial hero: a plain-set serif headline with one italic accent word,
 * a restrained fact row, and a real-photo grid — no script font, gold
 * framing or looping motion.
 */
export function Hero() {
  return (
    <section aria-label="The Holiday Experience" className="bg-cream">
      <div className="mx-auto flex max-w-[1360px] flex-wrap items-center gap-9 px-6 pb-[clamp(56px,10vh,110px)] pt-[clamp(32px,6vh,72px)] sm:px-10 lg:flex-nowrap lg:gap-[72px] lg:px-16">
        {/* ── Content ───────────────────────────────── */}
        <div className="order-2 flex min-w-0 flex-[1_1_480px] flex-col items-start gap-6 lg:order-1">
          <span className="eyebrow animate-rise text-crimson">
            {BRAND.season} · Bloomfield, NJ
          </span>
          <h1 className="m-0 animate-rise font-display text-[clamp(44px,6.8vw,96px)] font-normal leading-[0.98] tracking-[-0.01em] text-ink [animation-delay:.08s]">
            The <em className="text-crimson font-medium italic">Holiday</em> Experience
          </h1>
          <p className="animate-rise font-display text-[clamp(21px,2.1vw,28px)] italic leading-tight text-ink [animation-delay:.14s]">
            Two experiences. One magical season.
          </p>
          <p className="max-w-[48ch] animate-rise font-body text-[clamp(19px,1.6vw,22px)] leading-snug text-bark [animation-delay:.2s]">
            Meet Santa, step into eight styled holiday sets, and leave with portraits worth framing — all under one
            roof in Bloomfield.
          </p>
          <div className="flex animate-rise flex-wrap items-center gap-3 pt-1 [animation-delay:.28s]">
            <BookButton className="group inline-flex min-h-14 items-center justify-center gap-2.5 bg-ink px-7 text-[13px] font-bold uppercase tracking-[0.14em] text-cream transition-colors hover:bg-crimson">
              Reserve your visit
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </BookButton>
            <a
              href="#experiences"
              className="inline-flex min-h-14 items-center justify-center border border-ink px-7 text-[13px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-cream"
            >
              See both experiences
            </a>
          </div>
          <dl className="mt-2 flex animate-rise flex-wrap gap-x-10 gap-y-4 border-t border-line pt-6 [animation-delay:.36s]">
            {FACTS.map(([k, v]) => (
              <div key={k} className="flex flex-col gap-1">
                <dt className="eyebrow text-crimson">{k}</dt>
                <dd className="m-0 text-[15px] font-semibold text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ── Imagery ───────────────────────────────── */}
        <div className="order-1 grid h-[280px] w-full min-w-0 flex-[1_1_440px] animate-rise grid-cols-2 grid-rows-2 gap-2 [animation-delay:.18s] sm:h-[340px] sm:gap-3 lg:order-2 lg:h-[clamp(420px,42vw,560px)] lg:w-auto">
          <div className="relative row-span-2 min-h-0 overflow-hidden border border-line">
            <Image
              src={IMAGES.door}
              alt={IMAGE_ALT.door}
              fill
              sizes="(min-width:1024px) 28vw, 50vw"
              priority
              className="object-cover"
              style={{ objectPosition: "50% 38%" }}
            />
          </div>
          <div className="relative min-h-0 overflow-hidden border border-line">
            <Image
              src={IMAGES.santaSack}
              alt={IMAGE_ALT.santaSack}
              fill
              sizes="(min-width:1024px) 20vw, 50vw"
              className="object-cover"
              style={{ objectPosition: "60% 25%" }}
            />
          </div>
          <div className="flex min-h-0 flex-col justify-between bg-velvet p-4 text-cream lg:p-6">
            <span aria-hidden className="text-lg text-gold">
              ✦
            </span>
            <p className="m-0 font-display text-[clamp(18px,1.8vw,24px)] leading-tight">
              Eight sets and Santa, <em className="text-parchment">one roof.</em>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
