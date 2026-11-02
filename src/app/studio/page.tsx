import type { Metadata } from "next";
import Link from "next/link";
import { BackdropShowcase } from "@/components/backdrop-showcase";
import { BookButton } from "@/components/booking/book-button";
import { MobileBookBar } from "@/components/mobile-book-bar";
import { ClayCamera } from "@/components/motion/clay-camera";
import { ClayStar } from "@/components/motion/clay-shapes";
import { FloatingHero } from "@/components/motion/floating-hero";
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

export default function StudioPage() {
  return (
    <>
      <SiteHeader current="/studio" bookPreset="selfie" bookLabel="Book studio" />
      <main>
        {/* ── Hero ───────────────────────────────── */}
        <ScrollFx as="section" className="overflow-hidden bg-cream">
          <div className="mx-auto grid max-w-[1360px] items-center gap-x-16 gap-y-8 px-6 pb-[clamp(56px,9vh,100px)] pt-[clamp(24px,5vh,56px)] sm:px-10 lg:min-h-[calc(100svh-80px)] lg:grid-cols-2 lg:px-16">
            <div className="order-2 flex flex-col items-start gap-6 lg:order-1">
              <Link href="/" className="eyebrow link-grow animate-rise text-crimson">
                ← The Holiday Experience
              </Link>
              <SplitReveal as="h1" immediate delay={0.1} className="m-0 flex flex-col leading-[0.95]">
                <span className="font-display text-[clamp(21px,2.6vw,30px)] font-normal italic text-crimson">The Holiday</span>
                <span className="font-display text-[clamp(48px,7.6vw,104px)] font-bold tracking-[-0.01em] text-ink">Portrait Studio</span>
              </SplitReveal>
              <p className="max-w-[34ch] animate-rise font-body text-[clamp(20px,2.3vw,27px)] leading-snug text-bark [animation-delay:.3s]">
                Eight beautiful backdrops, endless possibilities. Shoot it yourself, bring your own photographer, or book ours.
              </p>
              <div className="flex animate-rise flex-wrap items-center gap-3 pt-1 [animation-delay:.4s]">
                <BookButton preset="selfie" className="group inline-flex min-h-14 items-center justify-center gap-2.5 bg-ink px-7 text-[13px] font-bold uppercase tracking-[0.14em] text-cream transition-colors hover:bg-crimson">
                  Pick a time
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </BookButton>
                <a
                  href="#packages"
                  className="inline-flex min-h-14 items-center justify-center border border-ink px-7 text-[13px] font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-cream"
                >
                  See packages
                </a>
              </div>
              <dl className="mt-2 flex animate-rise flex-wrap gap-x-10 gap-y-4 border-t border-line pt-6 [animation-delay:.5s]">
                {FACTS.map(([k, v]) => (
                  <div key={k} className="flex flex-col gap-1">
                    <dt className="eyebrow text-crimson">{k}</dt>
                    <dd className="m-0 text-[15px] font-semibold text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="order-1 animate-rise [animation-delay:.18s] lg:order-2">
              <div data-depth>
                <FloatingHero
                  tone="light"
                  className="h-[380px] w-full sm:h-[480px] lg:h-[clamp(520px,44vw,620px)]"
                  primary={{ src: IMAGES.familyStudioPortrait, alt: IMAGE_ALT.familyStudioPortrait, caption: "The whole crew", position: "50% 30%", variant: "print", rotate: 3 }}
                  cards={[
                    { src: IMAGES.door, alt: IMAGE_ALT.door, caption: "The golden doorway", rotate: 8, z: -80, style: { top: "-1%", right: "1%", width: "34%" } },
                    { src: IMAGES.carousel, alt: IMAGE_ALT.carousel, caption: "The carousel", rotate: -9, z: 150, style: { bottom: "1%", left: "1%", width: "31%" } },
                  ]}
                >
                  <div data-float data-z={220} className="absolute bottom-[6%] right-[5%] w-[22%]">
                    <ClayCamera className="w-full rotate-[-10deg]" />
                  </div>
                  <ClayStar style={{ left: "10%", top: "6%", width: "8%", height: "8%" }} z={-120} />
                </FloatingHero>
              </div>
            </div>
          </div>
        </ScrollFx>

        {/* ── The eight sets ─────────────────────── */}
        <BackdropShowcase />

        {/* ── Packages ───────────────────────────── */}
        <ScrollFx as="section" id="packages" className="grain scroll-mt-20 bg-velvet px-6 py-[clamp(80px,12vw,150px)] text-cream sm:px-10 lg:px-16">
          <div className="relative mx-auto flex max-w-[1180px] flex-col gap-12">
            <SectionHeading script="Step in. Strike a pose." title="Choose your session" tone="light" align="center" />
            <div className="grid gap-6 md:grid-cols-3">
              {PACKAGES.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.08} className="h-full">
                  <Tilt glare className="h-full" innerClassName={`flex h-full flex-col gap-4 border p-8 ${p.primary ? "border-gold bg-white/[0.05]" : "border-cream/15"}`}>
                    <div className="flex flex-col gap-1.5">
                      <span className="eyebrow text-gold">{p.sub}</span>
                      <span className="font-display text-[24px] font-bold leading-tight md:min-h-[2.5em]">{p.title}</span>
                    </div>
                    <span data-pop data-count={p.price} data-decimals={p.decimals ?? 0} data-prefix="$" className="font-display text-[clamp(44px,5.4vw,60px)] font-bold leading-none tabular-nums">
                      {`$${p.decimals ? p.price.toFixed(p.decimals) : p.price}`}
                    </span>
                    <span className="text-[12px] uppercase tracking-[0.16em] text-gold">{p.unit}</span>
                    <span aria-hidden className="h-px w-full bg-cream/15" />
                    <p className="m-0 text-[15px] leading-relaxed text-parchment/85">{p.body}</p>
                    <BookButton
                      preset={p.id}
                      className={`mt-auto min-h-[54px] w-full text-[13px] font-bold uppercase tracking-[0.14em] text-velvet transition-colors ${p.primary ? "bg-gold hover:bg-cream" : "bg-cream hover:bg-gold"}`}
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
