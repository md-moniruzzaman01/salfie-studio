"use client";

import { clsx } from "clsx";
import Link from "next/link";
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/luxe/button";
import { CountUp, EASE, Fade, MaskLines, ParallaxImage, PillReveal } from "@/components/luxe/motion";
import { StripeMask } from "@/components/luxe/stripe";
import { BRAND } from "@/lib/content";
import { HOME_STEPS, VISIT } from "@/lib/copy";
import { IMAGES } from "@/lib/images";
import { daysLeftInEarlyBird } from "@/lib/pricing";
import { useSelfiePrice } from "@/lib/use-selfie-pricing";
import { useNow } from "@/lib/use-now";

const SECTION = "px-6 py-[clamp(80px,12vw,176px)] sm:px-10 lg:px-16";
const WRAP = "mx-auto w-full max-w-[1360px]";

// ── Section heading: caps eyebrow, masked headline, one script accent ───────

export function SectionHeading({ eyebrow, lines, tone = "light", className }: { eyebrow: string; lines: ReactNode[]; tone?: "light" | "dark"; className?: string }) {
  return (
    <div className={clsx("flex flex-col gap-5", className)}>
      <p className={clsx("eyebrow m-0", tone === "dark" ? "text-gold" : "text-crimson")}>{eyebrow}</p>
      <MaskLines as="h2" lines={lines} className="m-0 max-w-[18ch] text-[clamp(34px,6vw,76px)] font-extrabold leading-[1.02] tracking-[-0.025em]" />
    </div>
  );
}

/** The script accent word. Evergreen reads on light and dark; use once per heading. */
export function Script({ children }: { children: ReactNode }) {
  return <span className="font-script text-[1.12em] font-normal normal-case leading-[0.9] tracking-normal text-evergreen">{children}</span>;
}

// ── Two experiences ─────────────────────────────────────────────────────────

function SantaFrom() {
  return <CountUp to={34.99} decimals={2} prefix="$" />;
}

/** The studio's per-person price, as the backend will charge it today. */
function StudioFrom() {
  const { unit } = useSelfiePrice();
  return <CountUp to={unit} decimals={2} prefix="$" />;
}

export function ExperiencePanels() {
  const panels = [
    {
      href: "/santa",
      eyebrow: "Photos with Santa",
      title: "A visit they'll talk about all year.",
      body: "Two 4×6 prints and every digital image. Eight dates, arrive any time between 11 AM and 7 PM.",
      image: IMAGES.santaStair,
      alt: "A laughing little girl and her mother in black beside a flocked white Christmas tree",
      position: "45% 38%",
      price: (
        <>
          from <SantaFrom /> per child
        </>
      ),
    },
    {
      href: "/portrait-studio",
      eyebrow: "Portrait Studio",
      title: "Eight holiday sets. One magical hour.",
      body: "Shoot it yourself, bring your photographer, or book ours. Hourly sessions, every day from November 27.",
      image: IMAGES.snowSofaTrio,
      alt: "Three guests in holiday sweaters on a cream sofa in a snow-covered set",
      position: "50% 30%",
      price: (
        <>
          from <StudioFrom /> per person
        </>
      ),
    },
  ];

  return (
    <section id="experiences" aria-label="Choose your experience" className={clsx("scroll-mt-20 bg-soft", SECTION)}>
      <div className={clsx(WRAP, "flex flex-col gap-[clamp(48px,7vw,96px)]")}>
        <SectionHeading eyebrow="Two experiences" lines={["Choose how you", <><Script>celebrate.</Script></>]} />
        <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:gap-x-14">
          {panels.map((p, i) => (
            <Fade key={p.href} delay={i * 0.12} y={32}>
              <Link href={p.href} className="group flex flex-col gap-7">
                <PillReveal cover="#faf7f2" delay={i * 0.12} className="aspect-[4/5] w-full">
                  <ParallaxImage src={p.image} alt={p.alt} sizes="(min-width: 768px) 46vw, 92vw" position={p.position} className="h-full w-full" />
                  <span aria-hidden className="pointer-events-none absolute inset-3 border border-ivory/55 transition-[inset] duration-700 ease-out group-hover:inset-5" />
                </PillReveal>
                <div className="flex flex-col gap-3 border-t border-onyx pt-6">
                  <p className="eyebrow m-0 text-crimson">{p.eyebrow}</p>
                  <h3 className="m-0 max-w-[20ch] text-[clamp(26px,3vw,40px)] font-extrabold leading-[1.08] tracking-[-0.02em]">{p.title}</h3>
                  <p className="m-0 max-w-[46ch] text-[17px] leading-relaxed text-muted">{p.body}</p>
                  <p className="mt-2 flex items-center justify-between gap-4">
                    <span className="font-extrabold text-onyx">{p.price}</span>
                    <span className="link-grow eyebrow !tracking-[0.3em] text-onyx">Explore</span>
                  </p>
                </div>
              </Link>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Booked in three taps ────────────────────────────────────────────────────

/** A numbered stop on the track. It fills Holiday Red as it scrolls into the reading zone. */
function TapNode({ n }: { n: number }) {
  const reduce = useReducedMotion();
  const base = "absolute left-0 top-0 grid size-14 place-items-center rounded-full border font-heavy text-[22px] leading-none";
  if (reduce) return <span className={clsx(base, "border-crimson bg-crimson text-ivory")}>{n}</span>;
  return (
    <motion.span
      className={base}
      initial={{ backgroundColor: "rgba(241,236,227,1)", color: "rgba(0,0,0,0.55)", borderColor: "rgba(0,0,0,0.3)" }}
      whileInView={{ backgroundColor: "#a50c14", color: "#ffffff", borderColor: "#a50c14" }}
      viewport={{ once: true, margin: "0px 0px -38% 0px" }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      {n}
    </motion.span>
  );
}

/** Small, decorative previews of what each tap actually looks like. */
function StepPreview({ i }: { i: number }) {
  if (i === 0) {
    return (
      <div aria-hidden className="mt-6 flex flex-wrap gap-2">
        <span className="border border-crimson bg-ivory px-3.5 py-2.5 text-[14px] font-bold text-crimson">Photos with Santa</span>
        <span className="border border-onyx/25 bg-ivory/60 px-3.5 py-2.5 text-[14px] text-muted">Portrait Studio</span>
      </div>
    );
  }
  if (i === 1) {
    const chips: [string, string, string, boolean][] = [["Nov", "27", "Fri", false], ["Nov", "28", "Sat", true], ["Dec", "5", "Sat", false]];
    return (
      <div aria-hidden className="mt-6 flex gap-2">
        {chips.map(([m, d, w, on]) => (
          <span key={d} className={clsx("flex h-[76px] w-[62px] flex-col items-center justify-center border", on ? "border-crimson bg-crimson text-ivory" : "border-onyx/25 bg-ivory text-bark")}>
            <span className="font-caps text-[10px] uppercase tracking-[0.2em]">{m}</span>
            <span className="font-heavy text-[24px] leading-none">{d}</span>
            <span className="font-caps text-[10px] uppercase tracking-[0.2em]">{w}</span>
          </span>
        ))}
      </div>
    );
  }
  return (
    <div aria-hidden className="mt-6 flex flex-col items-start gap-3">
      <span className="bg-crimson px-5 py-3 text-[12px] font-bold uppercase tracking-[0.16em] text-ivory">Confirm your Reservation</span>
      <span className="flex items-center gap-2 text-[14px] text-muted">
        <svg viewBox="0 0 20 20" className="size-4 text-crimson" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 10.5l4 4 8-9" />
        </svg>
        Confirmation sent by email
      </span>
    </div>
  );
}

export function ThreeTaps() {
  const list = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: list, offset: ["start 72%", "end 62%"] });
  const grow = reduce ? undefined : { scaleX: scrollYProgress };
  const growY = reduce ? undefined : { scaleY: scrollYProgress };

  return (
    <section aria-label="How it works" className="bg-sand">
      <StripeMask height={12} />
      <div className={clsx("px-6 py-[clamp(80px,12vw,160px)] sm:px-10 lg:px-16")}>
        <div className={clsx(WRAP, "flex flex-col gap-[clamp(56px,8vw,104px)]")}>
          <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
            <SectionHeading eyebrow="How it works" lines={["Booked in", <><Script>three taps.</Script></>]} />
            <p className="m-0 max-w-[34ch] text-[18px] leading-relaxed text-muted">From the first tap to the set in about a minute. Nothing to print and nothing to bring.</p>
          </div>

          <ol ref={list} className="relative m-0 grid list-none gap-14 p-0 md:grid-cols-3 md:gap-10">
            {/* The track: horizontal from md up, vertical on phones. Red fills as you read. */}
            <li aria-hidden className="pointer-events-none absolute left-7 top-7 hidden h-px w-[calc(66.667%+26.67px)] bg-onyx/15 md:block">
              <motion.span className="block h-full w-full origin-left bg-crimson" style={grow} />
            </li>
            <li aria-hidden className="pointer-events-none absolute bottom-6 left-[27px] top-7 w-px bg-onyx/15 md:hidden">
              <motion.span className="block h-full w-full origin-top bg-crimson" style={growY} />
            </li>

            {HOME_STEPS.map((step, i) => (
              <li key={step.title} className="relative pl-[88px] md:pl-0 md:pt-[96px]">
                <TapNode n={i + 1} />
                <Fade delay={i * 0.1} y={18}>
                  <h3 className="m-0 text-[clamp(22px,2.2vw,28px)] font-extrabold leading-tight tracking-[-0.01em]">{step.title}</h3>
                  <p className="m-0 mt-3 max-w-[32ch] text-[17px] leading-relaxed text-muted">{step.body}</p>
                  <StepPreview i={i} />
                </Fade>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

// ── Early bird (only while the offer is live) ───────────────────────────────

export function EarlyBirdBand() {
  const now = useNow();
  const { ready, early, unit, regular, endLabel } = useSelfiePrice();
  if (now === null || !ready || !early) return null;
  const left = daysLeftInEarlyBird(now);
  return (
    <section aria-label="Early bird offer" className="border-y border-onyx bg-soft px-6 py-[clamp(48px,7vw,88px)] sm:px-10 lg:px-16">
      <div className={clsx(WRAP, "flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between")}>
        <div className="flex items-baseline gap-5">
          <span className="font-heavy text-[clamp(56px,10vw,120px)] leading-[0.9] text-onyx">${unit.toFixed(2)}</span>
          <span className="font-script text-[clamp(30px,5vw,52px)] leading-none text-crimson">early bird</span>
        </div>
        <p className="m-0 max-w-[40ch] text-[18px] leading-relaxed text-bark">
          Selfie Studio Access, per person, when you book through {endLabel}. Regularly ${regular.toFixed(2)}.
          {left > 0 ? <span className="mt-1 block text-[15px] text-muted">{left} {left === 1 ? "day" : "days"} left.</span> : null}
        </p>
        <Button href="/portrait-studio#book" modal="studio">Book the studio</Button>
      </div>
    </section>
  );
}

// ── Plan your visit ─────────────────────────────────────────────────────────

/** Mounts the map only when it is near the viewport, so Google's scripts never block the first load. */
function LazyMap() {
  const box = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setNear(true), io.disconnect()), { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={box} className="relative aspect-[4/5] w-full overflow-hidden border border-line2 bg-sand sm:aspect-[5/4] lg:aspect-[4/5]">
      {near ? (
        <iframe
          title="Map: The Selfie Studio Experience, 77–79 Washington Street, Bloomfield, NJ"
          src={`https://www.google.com/maps?q=${encodeURIComponent(VISIT.mapQuery)}&output=embed`}
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full grayscale transition-[filter] duration-700 hover:grayscale-0"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <span className="eyebrow !tracking-[0.3em] text-muted">77–79 Washington Street</span>
        </div>
      )}
    </div>
  );
}

export function PlanYourVisit() {
  return (
    <section id="visit" aria-label="Plan your visit" className={clsx("scroll-mt-20 bg-ivory", SECTION)}>
      <div className={clsx(WRAP, "grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20")}>
        <div className="flex flex-col gap-10">
          <SectionHeading eyebrow="Plan your visit" lines={["Come and", <><Script>see us.</Script></>]} />
          <dl className="m-0 flex flex-col">
            {[
              ["Address", <>{VISIT.address}<br /><a className="link-grow text-crimson" href={`https://maps.google.com/?q=${encodeURIComponent(VISIT.mapQuery)}`} target="_blank" rel="noreferrer">Get directions</a></>],
              ["Season", BRAND.season],
              ["Hours", <>{VISIT.santa}<br />{VISIT.studio}</>],
              ["Call", <a key="tel" className="link-grow" href={`tel:${BRAND.phone.replace(/-/g, "")}`}>{BRAND.phone}</a>],
              ["Follow", <a key="ig" className="link-grow" href={BRAND.instagramUrl} target="_blank" rel="noreferrer">{BRAND.instagram}</a>],
            ].map(([k, v], i) => (
              <div key={i} className="grid gap-1 border-t border-line2 py-5 sm:grid-cols-[8.5rem_1fr] sm:gap-6">
                <dt className="eyebrow !tracking-[0.3em] text-muted">{k}</dt>
                <dd className="m-0 text-[17px] leading-relaxed text-bark">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <Fade y={28}>
          <LazyMap />
        </Fade>
      </div>
    </section>
  );
}

// ── FAQ ─────────────────────────────────────────────────────────────────────

export function Faq({ items, title = "Good to know", id = "faq" }: { items: { q: string; a: string }[]; title?: string; id?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  return (
    <section id={id} aria-label="Frequently asked questions" className={clsx("scroll-mt-20 bg-soft", SECTION)}>
      <div className={clsx(WRAP, "grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24")}>
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading eyebrow="Questions" lines={[title === "Good to know" ? <>Good to <Script>know.</Script></> : title]} />
        </div>
        <div className="border-b border-onyx">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="border-t border-onyx">
                <h3 className="m-0">
                  <button
                    type="button"
                    id={`${base}-q${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`${base}-a${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex min-h-[72px] w-full items-center justify-between gap-6 py-5 text-left"
                  >
                    <span className={clsx("text-[clamp(18px,1.8vw,22px)] font-bold leading-snug tracking-[-0.01em] transition-colors duration-500", isOpen ? "text-crimson" : "text-onyx group-hover:text-crimson")}>{item.q}</span>
                    <span aria-hidden className="relative size-5 shrink-0 text-onyx">
                      <span className="absolute left-0 top-1/2 h-px w-full bg-current" />
                      <span className={clsx("absolute left-1/2 top-0 h-full w-px bg-current transition-transform duration-500", isOpen && "scale-y-0")} />
                    </span>
                  </button>
                </h3>
                <div id={`${base}-a${i}`} role="region" aria-labelledby={`${base}-q${i}`} className={clsx("grid transition-[grid-template-rows,opacity] duration-500 ease-out", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")} inert={!isOpen}>
                  <div className="overflow-hidden">
                    <p className="m-0 max-w-[58ch] pb-8 pr-10 text-[17px] leading-relaxed text-muted">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Closing call to action ──────────────────────────────────────────────────

/**
 * The finale opens like a camera iris: as the section arrives, the dark scene
 * widens from a small circle at its centre while the photograph drifts behind.
 * Under reduced motion it is simply shown open.
 */
export function ClosingCta() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 15%"] });
  const radius = useTransform(scrollYProgress, [0, 1], [9, 78]);
  const clipPath = useMotionTemplate`circle(${radius}% at 50% 50%)`;

  return (
    <section ref={ref} aria-label="Book your visit" className="relative overflow-hidden bg-soft">
      <motion.div style={reduce ? undefined : { clipPath }} className="on-dark relative isolate overflow-hidden bg-onyx text-center text-ivory">
        <div className="absolute inset-0 -z-20 opacity-70">
          <ParallaxImage src={IMAGES.winterTree} alt="" sizes="100vw" position="50% 38%" strength={9} className="h-full w-full" />
        </div>
        <span aria-hidden className="absolute inset-0 -z-10 bg-onyx/60" />
        <div className="mx-auto flex max-w-[960px] flex-col items-center gap-8 px-6 py-[clamp(96px,16vw,220px)]">
          <p className="eyebrow m-0 text-gold">{BRAND.season}</p>
          <MaskLines
            as="h2"
            className="m-0 font-heavy text-[clamp(38px,9.4vw,112px)] uppercase leading-[0.98] tracking-[-0.015em] text-ivory"
            lines={["Step in.", "Strike a pose.", <span key="s" className="font-script text-[1.1em] normal-case leading-[0.95] tracking-normal text-evergreen [text-shadow:0_0_24px_rgba(0,0,0,0.5)]">Make it yours.</span>]}
          />
          <div className="flex w-full flex-col justify-center gap-3 sm:flex-row">
            <Button href="/santa#book" modal="santa" tone="dark">
              Book Photos with Santa
            </Button>
            <Button href="/portrait-studio#book" modal="studio" tone="dark" variant="outline">
              Book the Portrait Studio
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ── Cross-sell between the two experience pages ─────────────────────────────

export function CrossSell({ to }: { to: "santa" | "studio" }) {
  const santa = to === "santa";
  return (
    <section aria-label="Another experience" className="bg-ivory px-6 py-[clamp(72px,10vw,144px)] sm:px-10 lg:px-16">
      <div className={clsx(WRAP, "grid items-center gap-10 lg:grid-cols-2 lg:gap-20")}>
        <PillReveal cover="#ffffff" className="aspect-[5/4] w-full">
          <ParallaxImage
            src={santa ? IMAGES.santaReading : IMAGES.snowSofaTrio}
            alt={santa ? "Santa in a red velvet suit reading the Naughty and Nice Book" : "Three guests in holiday sweaters on a cream sofa in a snow-covered set"}
            sizes="(min-width: 1024px) 46vw, 92vw"
            position="50% 30%"
            className="h-full w-full"
          />
        </PillReveal>
        <div className="flex flex-col items-start gap-6">
          <p className="eyebrow m-0 text-crimson">Make it a double</p>
          <MaskLines as="h2" className="m-0 max-w-[16ch] text-[clamp(32px,4.6vw,60px)] font-extrabold leading-[1.04] tracking-[-0.025em]" lines={santa ? ["Add a visit with", <Script key="s">Santa.</Script>] : ["Add an hour in", <>the <Script key="s">studio.</Script></>]} />
          <p className="m-0 max-w-[42ch] text-[17px] leading-relaxed text-muted">
            {santa ? "Two 4×6 prints and every digital image, $34.99 per child. No time slot needed." : "Eight holiday sets and one magical hour, with sessions from 11 AM to 7 PM."}
          </p>
          <Button href={santa ? "/santa" : "/portrait-studio"}>{santa ? "Meet Santa" : "See the studio"}</Button>
        </div>
      </div>
    </section>
  );
}
