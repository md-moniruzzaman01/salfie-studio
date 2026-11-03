import type { Metadata } from "next";
import Link from "next/link";
import { BackdropShowcase } from "@/components/backdrop-showcase";
import { BookButton } from "@/components/booking/book-button";
import { MobileBookBar } from "@/components/mobile-book-bar";
import { Reveal } from "@/components/motion/reveal";
import { ScrollFx } from "@/components/motion/scroll-fx";
import { SplitReveal } from "@/components/motion/split-reveal";
import { Tilt } from "@/components/motion/tilt";
import { SectionHeading } from "@/components/section-heading";
import { CrossSell, Faq } from "@/components/sections";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { STUDIO_FAQ } from "@/lib/content";
import { IMAGE_ALT, IMAGES } from "@/lib/images";
import Image, { type StaticImageData } from "next/image";
import type { ExperienceId } from "@/lib/types";

export const metadata: Metadata = {
  title: "The Holiday Portrait Experience",
  description: "8 beautiful backdrops. Selfie Studio Access $44.99 per person, Professional Photos $200, Bring Your Own Photographer $100. Bloomfield, NJ.",
};

const PACKAGES: { id: ExperienceId; title: string; sub: string; price: number; decimals?: number; unit: string; body: string; cta: string; primary?: boolean }[] = [
  {
    id: "selfie",
    title: "Selfie Studio Access",
    sub: "Take your own photos",
    price: 44.99,
    decimals: 2,
    unit: "Per person · 1 hour access",
    body: "Use any of our 8 backdrops. Take unlimited photos with your phone. Fun for individuals, couples, families and friends.",
    cta: "Book Selfie Studio",
    primary: true,
  },
  {
    id: "pro",
    title: "Professional Photos",
    sub: "By our photographer",
    price: 200,
    unit: "All digital photos",
    body: "Professional photographer, high-quality edited images, all digital photos sent to you. Perfect for individuals, couples, families and groups.",
    cta: "Book professional photos",
  },
  {
    id: "byo",
    title: "Bring Your Own Photographer",
    sub: "Private session",
    price: 100,
    unit: "For 1 hour",
    body: "Use any of our 8 backdrops with private session time. Perfect for your personal photographer. Create your vision, your way.",
    cta: "Book a private hour",
  },
];

const FACTS: [string, string][] = [
  ["Backdrops", "8 sets"],
  ["Session", "1 hour"],
  ["From", "$44.99 / person"],
];

/** A framed, matted print hung on the wall, with a small placard beneath. */
function WallPrint({ src, alt, label, ratio, position, priority }: { src: StaticImageData; alt: string; label: string; ratio: string; position: string; priority?: boolean }) {
  return (
    <figure className="m-0 flex flex-col gap-2.5">
      <div className="border border-ink bg-porcelain p-2 shadow-[0_22px_40px_-24px_rgba(13,6,6,0.55)] sm:p-3">
        <div className={`relative w-full overflow-hidden bg-line ${ratio}`}>
          <Image src={src} alt={alt} fill priority={priority} sizes="(min-width: 1024px) 26vw, 44vw" className="object-cover" style={{ objectPosition: position }} />
        </div>
      </div>
      <figcaption className="px-1 font-display text-[13px] italic text-muted sm:text-[14px]">{label}</figcaption>
    </figure>
  );
}

export default function StudioPage() {
  return (
    <>
      <SiteHeader current="/studio" bookPreset="selfie" bookLabel="Book studio" />
      <main>
        {/* ── Hero: a portrait gallery wall ──────── */}
        <ScrollFx as="section" className="bg-cream text-ink">
          <div className="mx-auto grid max-w-[1360px] items-center gap-x-16 gap-y-12 px-6 pb-[clamp(56px,8vw,104px)] pt-[clamp(36px,6vw,72px)] sm:px-10 lg:min-h-[calc(100svh-80px)] lg:grid-cols-[0.9fr_1.1fr] lg:px-16">
            <div className="order-2 flex flex-col items-start gap-6 lg:order-1">
              <Link href="/" className="eyebrow link-grow animate-rise text-crimson">
                ← The Holiday Experience
              </Link>
              <SplitReveal as="h1" immediate delay={0.1} className="m-0 flex flex-col leading-[0.94]">
                <span className="font-script text-[clamp(40px,4.6vw,66px)] font-normal leading-none text-leaf">The Holiday</span>
                <span className="font-display text-[clamp(52px,7.4vw,112px)] font-bold tracking-[-0.025em] text-ink">Portrait Studio</span>
              </SplitReveal>
              <p className="m-0 max-w-[36ch] animate-rise font-body text-[clamp(21px,2.1vw,27px)] italic leading-snug text-bark [animation-delay:.3s]">
                Eight beautiful backdrops, endless possibilities. Shoot it yourself, bring your own photographer, or book ours.
              </p>
              <div className="flex animate-rise flex-wrap items-center gap-3 pt-1 [animation-delay:.4s]">
                <BookButton preset="selfie" className="inline-flex min-h-14 items-center justify-center bg-crimson px-8 text-[13px] font-bold uppercase tracking-[0.14em] text-cream transition-colors hover:bg-signal">
                  Pick a time
                </BookButton>
                <a
                  href="#packages"
                  className="inline-flex min-h-14 items-center justify-center border border-ink px-8 text-[13px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-cream"
                >
                  See packages
                </a>
              </div>
              <dl className="m-0 mt-3 grid w-full max-w-[520px] animate-rise grid-cols-3 border-y border-line2 [animation-delay:.5s]">
                {FACTS.map(([k, v], i) => (
                  <div key={k} className={`flex flex-col gap-1 py-4 ${i > 0 ? "border-l border-line2 pl-4 sm:pl-6" : ""}`}>
                    <dt className="eyebrow text-crimson">{k}</dt>
                    <dd className="m-0 font-display text-[clamp(16px,1.6vw,21px)] text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* The wall: matted, framed prints at honest proportions */}
            <div className="order-1 animate-rise bg-sand p-4 [animation-delay:.18s] sm:p-8 lg:order-2 lg:p-10">
              <div className="grid grid-cols-2 items-start gap-4 sm:gap-6">
                <div className="flex flex-col gap-4 sm:gap-6">
                  <WallPrint src={IMAGES.coupleNoir} alt="A couple in black tie before the black and gold holiday set" label="Noir & Gold" ratio="aspect-[3/4]" position="50% 30%" priority />
                  <WallPrint src={IMAGES.bakeryFamily} alt={IMAGE_ALT.familyStudioPortrait} label="The Holiday Bakery" ratio="aspect-square" position="50% 40%" />
                </div>
                <div className="flex flex-col gap-4 pt-8 sm:gap-6 sm:pt-14">
                  <WallPrint src={IMAGES.whiteArch} alt={IMAGE_ALT.door} label="The Winter Arch" ratio="aspect-[4/5]" position="50% 35%" />
                  <WallPrint src={IMAGES.gingerbread} alt={IMAGE_ALT.santaSack} label="The Gingerbread House" ratio="aspect-[4/5]" position="50% 30%" />
                </div>
              </div>
            </div>
          </div>
        </ScrollFx>

        {/* ── The eight sets ─────────────────────── */}
        <BackdropShowcase />

        {/* ── Packages ───────────────────────────── */}
        <ScrollFx as="section" id="packages" className="scroll-mt-20 bg-sand px-6 py-[clamp(80px,12vw,150px)] sm:px-10 lg:px-16">
          <div className="relative mx-auto flex max-w-[1180px] flex-col gap-12">
            <SectionHeading script="Step in. Strike a pose." title="Choose your session" align="center" />
            <div className="grid gap-6 md:grid-cols-3">
              {PACKAGES.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.08} className="h-full">
                  <Tilt glare className="h-full" innerClassName={`flex h-full flex-col gap-4 border p-8 ${p.primary ? "border-crimson bg-porcelain shadow-[0_30px_60px_-34px_rgba(168,16,26,0.45)]" : "border-line bg-porcelain"}`}>
                    <div className="flex flex-col gap-1.5">
                      <span className="eyebrow text-crimson">{p.sub}</span>
                      <span className="font-display text-[24px] font-bold leading-tight md:min-h-[2.5em]">{p.title}</span>
                    </div>
                    <span data-pop data-count={p.price} data-decimals={p.decimals ?? 0} data-prefix="$" className="font-display text-[clamp(44px,5.4vw,60px)] font-bold leading-none tabular-nums">
                      {`$${p.decimals ? p.price.toFixed(p.decimals) : p.price}`}
                    </span>
                    <span className="text-[12px] uppercase tracking-[0.16em] text-crimson">{p.unit}</span>
                    <span aria-hidden className="h-px w-full bg-line" />
                    <p className="m-0 text-[15px] leading-relaxed text-muted">{p.body}</p>
                    <BookButton
                      preset={p.id}
                      className={`mt-auto min-h-[54px] w-full text-[13px] font-bold uppercase tracking-[0.14em] transition-colors ${p.primary ? "bg-crimson text-cream hover:bg-signal" : "border border-crimson text-crimson hover:bg-crimson hover:text-cream"}`}
                    >
                      {p.cta}
                    </BookButton>
                  </Tilt>
                </Reveal>
              ))}
            </div>
          </div>
        </ScrollFx>

        <Faq items={STUDIO_FAQ} title="Studio FAQ" />
        <CrossSell to="santa" />
      </main>
      <SiteFooter />
      <MobileBookBar variant="single" preset="selfie" price="From $44.99" note="8 backdrops · 1 hour" label="Pick a time" />
    </>
  );
}
