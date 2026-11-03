import Image from "next/image";
import { BookButton } from "@/components/booking/book-button";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { IMAGES } from "@/lib/images";

const STEPS = [
  {
    title: "Pick your experience",
    body: "Santa on one of eight dates, the studio any day from November 27, or both.",
    img: IMAGES.santaStair,
    alt: "Santa with a mother and daughter in red on a candy-red carpeted staircase",
    pos: "45% 38%",
  },
  {
    title: "Reserve in a tap",
    body: "Apple Pay, Google Pay or card, secured by Square. Your date is saved the moment you pay.",
    img: IMAGES.whiteArch,
    alt: "A woman in a faux-fur jacket reaching up through a white winter floral arch",
    pos: "50% 33%",
  },
  {
    title: "Step in and strike a pose",
    body: "We handle the magic. You take the memories home.",
    img: IMAGES.bakeryFamily,
    alt: "A family baking a strawberry cake together in the holiday bakery set",
    pos: "50% 40%",
  },
];

/**
 * "Booked in three taps": three framed photographs on a single ruled line,
 * each step marked with a large red numeral. The middle plate sits lower,
 * echoing the staggered hero above.
 */
export function HowItWorks() {
  return (
    <section aria-label="How it works" className="bg-cream px-6 py-[clamp(72px,10vw,128px)] sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-[clamp(40px,6vw,72px)]">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <SectionHeading script="How it works" title="Booked in three taps" />
          <p className="m-0 max-w-[36ch] font-body text-[clamp(20px,1.8vw,24px)] italic leading-snug text-bark">
            From first tap to the set in about a minute, with nothing to print and nothing to bring.
          </p>
        </div>

        <ol className="m-0 grid list-none gap-x-8 gap-y-14 p-0 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.1} className={i === 1 ? "md:mt-14" : ""}>
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <span className="font-display text-[clamp(44px,5vw,64px)] font-bold italic leading-none text-crimson">{i + 1}</span>
                  <span aria-hidden className="h-px flex-1 bg-line2" />
                </div>
                <div className="relative aspect-[4/5] overflow-hidden bg-sand shadow-[0_26px_50px_-32px_rgba(13,6,6,0.5)]">
                  <Image src={s.img} alt={s.alt} fill sizes="(min-width: 768px) 30vw, 90vw" className="object-cover" style={{ objectPosition: s.pos }} />
                  <span aria-hidden className="absolute inset-3 border border-cream/60" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="m-0 font-display text-[clamp(22px,2.2vw,28px)] font-bold leading-tight text-ink">{s.title}</h3>
                  <p className="m-0 max-w-[34ch] text-[16px] leading-relaxed text-muted">{s.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>

        <div className="flex flex-col items-start justify-between gap-6 border-y border-line2 py-8 sm:flex-row sm:items-center">
          <p className="m-0 font-display text-[clamp(20px,2.2vw,28px)] italic text-ink">Weekends fill fast. Choose your day.</p>
          <BookButton className="inline-flex min-h-14 items-center justify-center whitespace-nowrap bg-crimson px-8 text-[13px] font-bold uppercase tracking-[0.14em] text-cream transition-colors hover:bg-signal">
            Reserve your visit
          </BookButton>
        </div>
      </div>
    </section>
  );
}
