import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BackdropShowcase } from "@/components/backdrop-showcase";
import { BookButton } from "@/components/booking/book-button";
import { MobileBookBar } from "@/components/mobile-book-bar";
import { Reveal } from "@/components/motion/reveal";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { SectionHeading } from "@/components/section-heading";
import { CrossSell, Faq } from "@/components/sections";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { STUDIO_FAQ } from "@/lib/content";
import { IMAGE_ALT, IMAGES } from "@/lib/images";
import type { ExperienceId } from "@/lib/types";

export const metadata: Metadata = {
  title: "The Holiday Portrait Experience",
  description: "8 beautiful backdrops. Selfie Studio Access $24.99 per person, Professional Photos $200, Bring Your Own Photographer $100. Bloomfield, NJ.",
};

const PACKAGES: { id: ExperienceId; title: string; sub: string; price: string; unit: string; body: string; cta: string; primary?: boolean }[] = [
  {
    id: "selfie",
    title: "Selfie Studio Access",
    sub: "Take your own photos",
    price: "$24.99",
    unit: "Per person · 1 hour access",
    body: "Use any of our 8 backdrops. Take unlimited photos with your phone. Fun for individuals, couples, families and friends.",
    cta: "Book Selfie Studio",
    primary: true,
  },
  {
    id: "pro",
    title: "Professional Photos",
    sub: "By our photographer",
    price: "$200",
    unit: "All digital photos",
    body: "Professional photographer, high-quality edited images, all digital photos sent to you. Perfect for individuals, couples, families and groups.",
    cta: "Book professional photos",
  },
  {
    id: "byo",
    title: "Bring Your Own Photographer",
    sub: "Private session",
    price: "$100",
    unit: "For 1 hour",
    body: "Use any of our 8 backdrops with private session time. Perfect for your personal photographer. Create your vision, your way.",
    cta: "Book a private hour",
  },
];

const FACTS: [string, string][] = [
  ["Backdrops", "8 sets"],
  ["Session", "1 hour"],
  ["From", "$24.99 / person"],
];

export default function StudioPage() {
  return (
    <>
      <ScrollProgress />
      <SiteHeader current="/studio" bookPreset="selfie" bookLabel="Book studio" />
      <main>
        {/* ── Hero ───────────────────────────────── */}
        <section className="bg-cream">
          <div className="mx-auto grid max-w-[1360px] items-center gap-x-16 gap-y-10 px-6 pb-[clamp(56px,10vh,100px)] pt-[clamp(20px,4vh,44px)] sm:px-10 lg:grid-cols-[1.02fr_0.98fr] lg:px-16">
            <div className="order-2 flex flex-col items-start gap-6 lg:order-1">
              <Link href="/" className="eyebrow link-grow animate-rise text-crimson">
                ← The Holiday Experience
              </Link>
              <h1 className="m-0 flex animate-rise flex-col leading-[0.92] [animation-delay:.08s]">
                <span className="font-display text-[clamp(21px,2.6vw,30px)] italic font-normal text-crimson">The Holiday</span>
                <span className="font-display text-[clamp(48px,7.6vw,104px)] font-bold tracking-[-0.01em] text-ink">Portrait Studio</span>
              </h1>
              <p className="max-w-[34ch] animate-rise font-body text-[clamp(20px,2.3vw,27px)] leading-snug text-bark [animation-delay:.16s]">
                Eight beautiful backdrops, endless possibilities. Shoot it yourself, bring your own photographer, or book ours.
              </p>
              <div className="flex animate-rise flex-wrap items-center gap-3 pt-1 [animation-delay:.24s]">
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
              <dl className="mt-2 flex animate-rise flex-wrap gap-x-10 gap-y-4 border-t border-line pt-6 [animation-delay:.32s]">
                {FACTS.map(([k, v]) => (
                  <div key={k} className="flex flex-col gap-1">
                    <dt className="eyebrow text-crimson">{k}</dt>
                    <dd className="m-0 text-[15px] font-semibold text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="order-1 grid animate-rise grid-cols-2 gap-3 [animation-delay:.18s] lg:order-2">
              <div className="relative aspect-[3/4] overflow-hidden border border-line">
                <Image src={IMAGES.door} alt={IMAGE_ALT.door} fill sizes="(min-width:1024px) 22vw, 45vw" fetchPriority="high" className="object-cover" />
              </div>
              <div className="relative aspect-[3/4] overflow-hidden border border-line">
                <Image src={IMAGES.carousel} alt={IMAGE_ALT.carousel} fill sizes="(min-width:1024px) 22vw, 45vw" className="object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Backdrops ──────────────────────────── */}
        <section className="bg-ink py-[clamp(72px,10vw,128px)] text-cream">
          <div className="flex flex-col gap-12">
            <Reveal className="mx-auto w-full max-w-[1280px] px-6 sm:px-10 lg:px-16">
              <SectionHeading script="Different backdrops." title="Same magic." tone="light" />
            </Reveal>
            <BackdropShowcase />
          </div>
        </section>

        {/* ── Packages ───────────────────────────── */}
        <section id="packages" className="bg-velvet px-6 py-[clamp(80px,12vw,150px)] text-cream sm:px-10 lg:px-16">
          <div className="mx-auto flex max-w-[1180px] flex-col gap-12">
            <Reveal className="flex flex-col items-center gap-2 text-center">
              <SectionHeading script="Step in. Strike a pose." title="Choose your session" tone="light" align="center" />
            </Reveal>
            <div className="grid gap-6 md:grid-cols-3">
              {PACKAGES.map((p, i) => (
                <Reveal
                  key={p.id}
                  delay={i * 0.08}
                  className={`flex flex-col gap-4 border p-8 ${p.primary ? "border-gold bg-white/[0.04]" : "border-cream/15"}`}
                >
                  <div className="flex flex-col gap-1.5">
                    <span className="eyebrow text-gold">{p.sub}</span>
                    <span className="font-display text-[24px] font-bold leading-tight">{p.title}</span>
                  </div>
                  <span className="font-display text-[clamp(44px,5.4vw,58px)] font-bold leading-none">{p.price}</span>
                  <span className="text-[12px] uppercase tracking-[0.16em] text-gold">{p.unit}</span>
                  <span aria-hidden className="h-px w-full bg-cream/15" />
                  <p className="m-0 text-[15px] leading-relaxed text-parchment/85">{p.body}</p>
                  <BookButton
                    preset={p.id}
                    className={`mt-auto min-h-[54px] w-full text-[13px] font-bold uppercase tracking-[0.14em] text-velvet transition-colors ${p.primary ? "bg-gold hover:bg-cream" : "bg-cream hover:bg-gold"}`}
                  >
                    {p.cta}
                  </BookButton>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <Faq items={STUDIO_FAQ} title="Studio FAQ" />
        <CrossSell to="santa" />
      </main>
      <SiteFooter />
      <MobileBookBar variant="single" preset="selfie" price="From $24.99" note="8 backdrops · 1 hour" label="Pick a time" />
    </>
  );
}
