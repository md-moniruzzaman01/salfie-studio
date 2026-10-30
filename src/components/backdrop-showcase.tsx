import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { IMAGES } from "@/lib/images";

const FEATURED = [
  { num: "01", name: "The Golden Doorway", image: IMAGES.door, pos: "50% 42%" },
  { num: "02", name: "The Carousel", image: IMAGES.carousel, pos: "50% 48%" },
];

const UPCOMING = ["03", "04", "05", "06", "07", "08"];

/**
 * Editorial backdrop showcase: the two photographed sets featured large in
 * plain-bordered frames, and the remaining six listed as an intentional
 * "revealed in-studio" tease rather than empty slots.
 */
export function BackdropShowcase() {
  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-14 px-6 sm:px-10 lg:px-16">
      <div className="grid grid-cols-2 gap-3 sm:gap-6">
        {FEATURED.map((set, i) => (
          <Reveal key={set.num} delay={i * 0.08} className="group">
            <figure className="m-0 flex flex-col gap-2 sm:gap-4">
              <div className="relative aspect-[4/5] overflow-hidden border border-cream/20">
                <Image
                  src={set.image}
                  alt={`Set ${set.num}: ${set.name}`}
                  fill
                  sizes="(min-width:640px) 45vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-105"
                  style={{ objectPosition: set.pos }}
                />
              </div>
              <figcaption className="flex items-baseline gap-2 sm:gap-4">
                <span className="font-display text-[16px] italic leading-none text-crimson sm:text-[22px]">{set.num}</span>
                <span aria-hidden className="hidden h-px flex-1 translate-y-[-6px] bg-cream/15 sm:block" />
                <span className="font-display text-[15px] leading-tight text-cream sm:text-[clamp(20px,2.4vw,28px)]">{set.name}</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      <Reveal className="flex flex-col gap-8 border-t border-cream/15 pt-10 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3">
          <span className="eyebrow text-gold">Still to unveil</span>
          <p className="m-0 max-w-[42ch] font-body text-[clamp(20px,2.2vw,26px)] leading-snug text-parchment">
            Eight signature sets in all — the remaining six are revealed when you step inside. Each one worth framing.
          </p>
        </div>
        <ul className="m-0 flex list-none flex-wrap items-center gap-x-6 gap-y-3 p-0">
          {UPCOMING.map((n) => (
            <li key={n} className="flex items-center gap-6">
              <span className="font-display text-[clamp(24px,2.8vw,32px)] text-parchment/35">{n}</span>
              {n !== "08" ? <span aria-hidden className="size-1 rounded-full bg-cream/25" /> : null}
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
