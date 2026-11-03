import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { BookButton } from "@/components/booking/book-button";
import { ScrollFx } from "@/components/motion/scroll-fx";
import { SplitReveal } from "@/components/motion/split-reveal";
import { BRAND } from "@/lib/content";
import { IMAGES } from "@/lib/images";

const FACTS: [string, string][] = [
  ["Season", BRAND.season],
  ["Santa", BRAND.santaHours],
  ["Find us", "77–79 Washington St"],
];

interface PlateProps {
  href: string;
  src: StaticImageData;
  alt: string;
  title: string;
  detail: string;
  position: string;
  className: string;
  priority?: boolean;
}

/** One tall photograph with a hairline keyline inset, linking to its experience. */
function Plate({ href, src, alt, title, detail, position, className, priority }: PlateProps) {
  return (
    <Link href={href} className={`group relative block overflow-hidden bg-sand ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 34vw, 33vw"
        className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.04]"
        style={{ objectPosition: position }}
      />
      <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
      <span aria-hidden className="absolute inset-2 border border-cream/55 sm:inset-3" />
      <span className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-4 sm:p-6">
        <span className="font-display text-[clamp(14px,1.7vw,24px)] font-bold leading-tight text-cream">{title}</span>
        <span className="hidden text-[13px] tracking-[0.03em] text-parchment sm:block">{detail}</span>
      </span>
    </Link>
  );
}

/**
 * A lookbook opening: a masthead and invitation above a full-width triptych
 * of the season's sets, then a quiet line of the practical facts.
 */
export function Hero() {
  return (
    <ScrollFx as="section" aria-label="The Holiday Experience" className="bg-cream text-ink">
      <div className="mx-auto max-w-[1360px] px-6 pb-[clamp(40px,6vw,72px)] pt-[clamp(36px,6vw,72px)] sm:px-10 lg:px-16">
        {/* ── Masthead + invitation ─────────────────── */}
        <div className="grid items-end gap-x-16 gap-y-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col gap-3">
            <span className="eyebrow animate-rise text-crimson">Holiday Edition · Bloomfield, NJ</span>
            <SplitReveal as="h1" immediate delay={0.1} className="m-0 flex flex-col font-display leading-[0.92]">
              <span className="font-script text-[clamp(40px,5vw,72px)] font-normal leading-none text-leaf">The Holiday</span>
              <span className="text-[clamp(60px,10.5vw,168px)] font-bold tracking-[-0.03em]">Experience</span>
            </SplitReveal>
          </div>
          <div className="flex animate-rise flex-col items-start gap-6 pb-2 [animation-delay:.3s]">
            <p className="m-0 max-w-[34ch] font-body text-[clamp(21px,1.9vw,26px)] italic leading-snug text-bark">
              Meet Santa, step into eight styled holiday sets, and leave with portraits worth framing.
            </p>
            <div className="flex flex-wrap gap-3">
              <BookButton className="inline-flex min-h-14 items-center justify-center whitespace-nowrap bg-crimson px-8 text-[13px] font-bold uppercase tracking-[0.14em] text-cream transition-colors hover:bg-signal">
                Reserve your visit
              </BookButton>
              <a
                href="#experiences"
                className="inline-flex min-h-14 items-center justify-center border border-ink px-8 text-[13px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-cream"
              >
                See both
              </a>
            </div>
          </div>
        </div>

        {/* ── Triptych ──────────────────────────────── */}
        <div className="mt-[clamp(28px,4vw,48px)] grid animate-rise grid-cols-3 items-end gap-2 [animation-delay:.2s] sm:gap-4">
          <Plate
            href="/santa"
            src={IMAGES.santaStair}
            alt="Santa with a mother and daughter in red on a candy-red carpeted staircase"
            title="Photos with Santa"
            detail="Eight dates · from $34.99"
            position="45% 38%"
            className="h-[clamp(240px,34vw,470px)]"
            priority
          />
          <Plate
            href="/studio"
            src={IMAGES.nutcrackerStair}
            alt="A woman in black beside a nutcracker on a red velvet staircase"
            title="The Portrait Studio"
            detail="Eight sets · from $44.99"
            position="50% 36%"
            className="h-[clamp(290px,41vw,570px)]"
            priority
          />
          <Plate
            href="/studio"
            src={IMAGES.whiteArch}
            alt="A woman in a faux-fur jacket reaching up through a white winter floral arch"
            title="The Winter Arch"
            detail="One of the eight sets"
            position="50% 33%"
            className="h-[clamp(240px,34vw,470px)]"
          />
        </div>

        {/* ── The practical facts ───────────────────── */}
        <dl className="m-0 mt-[clamp(24px,3vw,36px)] grid grid-cols-1 border-y border-line2 sm:grid-cols-3">
          {FACTS.map(([k, v], i) => (
            <div key={k} className={`flex items-baseline justify-between gap-4 px-1 py-4 sm:flex-col sm:items-start sm:gap-1 sm:px-6 ${i > 0 ? "border-t border-line2 sm:border-l sm:border-t-0" : "sm:pl-0"}`}>
              <dt className="eyebrow text-crimson">{k}</dt>
              <dd className="m-0 font-display text-[clamp(18px,1.8vw,24px)] text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </ScrollFx>
  );
}
