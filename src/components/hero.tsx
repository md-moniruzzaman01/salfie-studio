import { BookButton } from "@/components/booking/book-button";
import { CartoonScene } from "@/components/motion/cartoon-scene";
import { ScrollFx } from "@/components/motion/scroll-fx";
import { SplitReveal } from "@/components/motion/split-reveal";
import { BRAND } from "@/lib/content";

const FACTS: [string, string][] = [
  ["Season", BRAND.season],
  ["Santa", BRAND.santaHours],
  ["Location", "77–79 Washington St"],
];

/**
 * Editorial hero: a serif headline that rises line by line, a restrained
 * fact row, and the claymorphic Santa set — props at different depths that
 * tilt with the pointer and tip back into the page as you scroll on.
 */
export function Hero() {
  return (
    <ScrollFx as="section" aria-label="The Holiday Experience" className="overflow-hidden bg-cream">
      <div className="mx-auto grid max-w-[1360px] items-center gap-x-16 gap-y-8 px-6 pb-[clamp(56px,9vh,100px)] pt-[clamp(24px,5vh,56px)] sm:px-10 lg:min-h-[calc(100svh-80px)] lg:grid-cols-2 lg:px-16">
        {/* ── Content ───────────────────────────────── */}
        <div className="order-2 flex min-w-0 flex-col items-start gap-6 lg:order-1">
          <span className="eyebrow animate-rise text-crimson">
            {BRAND.season} · Bloomfield, NJ
          </span>
          <SplitReveal as="h1" immediate delay={0.1} className="m-0 flex flex-col font-display leading-[0.95] text-ink">
            <span className="text-[clamp(24px,2.8vw,34px)] font-normal italic text-crimson">The Holiday</span>
            <span className="text-[clamp(54px,6.8vw,104px)] font-bold tracking-[-0.02em]">Experience</span>
          </SplitReveal>
          <p className="m-0 animate-rise font-display text-[clamp(21px,2.1vw,28px)] italic leading-tight text-ink [animation-delay:.25s]">
            Two experiences. One magical season.
          </p>
          <p className="m-0 max-w-[40ch] animate-rise font-body text-[clamp(20px,2.2vw,25px)] leading-snug text-bark [animation-delay:.32s]">
            Meet Santa, step into eight styled holiday sets, and leave with portraits worth framing — all under one roof in Bloomfield.
          </p>
          <div className="flex animate-rise flex-wrap items-center gap-3 pt-1 [animation-delay:.4s]">
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
          <dl className="m-0 mt-2 flex animate-rise flex-wrap gap-x-10 gap-y-4 border-t border-line pt-6 [animation-delay:.5s]">
            {FACTS.map(([k, v]) => (
              <div key={k} className="flex flex-col gap-1">
                <dt className="eyebrow text-crimson">{k}</dt>
                <dd className="m-0 text-[15px] font-semibold text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ── Imagery ───────────────────────────────── */}
        <div className="order-1 w-full min-w-0 animate-rise [animation-delay:.18s] lg:order-2">
          <div data-depth>
            <CartoonScene className="h-[360px] w-full max-w-[560px] sm:h-[440px] lg:h-[clamp(480px,42vw,600px)]" />
          </div>
        </div>
      </div>
    </ScrollFx>
  );
}
