import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/luxe/button";
import { BRAND } from "@/lib/content";
import { IMAGES } from "@/lib/images";

const SERIF = { fontFamily: '"Playfair Display", Georgia, serif' } as const;

const STRIP: [string, string, string][] = [
  ["Per child", "$34.99", "one sitting"],
  ["Prints", "Two", "4×6, yours to keep"],
  ["Digitals", "All", "every image"],
];

/**
 * The Santa hero from the luxury branch: a light, airy opener. The photograph
 * sits to the right and dissolves into the ivory page, with the headline, the
 * price strip and the two buttons on the left.
 */
export function SantaHero() {
  return (
    <section aria-label="Photos with Santa" className="relative isolate overflow-hidden bg-soft text-onyx">
      <div aria-hidden className="absolute inset-x-0 top-0 -z-20 h-[54svh] [mask-image:linear-gradient(180deg,#000_55%,transparent_100%)] lg:inset-y-0 lg:left-auto lg:right-0 lg:h-auto lg:w-[60%] lg:[mask-image:linear-gradient(90deg,transparent_0%,#000_34%)]">
        <Image src={IMAGES.santaStair} alt="" fill priority quality={60} sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover object-[50%_30%]" />
      </div>
      <span
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(250,247,242,1)_0%,rgba(250,247,242,0.96)_40%,rgba(250,247,242,0.25)_50%,rgba(250,247,242,0)_62%)] max-lg:hidden"
      />

      <div className="mx-auto flex max-w-[1240px] flex-col items-start px-6 pb-[clamp(72px,10vw,128px)] pt-[45svh] sm:px-10 lg:min-h-[calc(100svh-76px)] lg:justify-center lg:px-16 lg:pt-[clamp(40px,7vw,96px)]">
        <div className="flex max-w-[540px] flex-col items-start gap-6">
          <Link href="/" className="eyebrow link-grow animate-rise text-crimson">
            ← The Holiday Experience
          </Link>

          <h1 className="m-0 flex animate-rise flex-col leading-[0.98] [animation-delay:.08s]">
            <span className="font-script text-[clamp(44px,5.4vw,72px)] font-normal leading-none text-evergreen">Photos with</span>
            <span className="text-[clamp(76px,10.5vw,152px)] font-bold tracking-[-0.02em]" style={SERIF}>
              Santa
            </span>
          </h1>

          <p className="m-0 max-w-[40ch] animate-rise text-[clamp(20px,2.1vw,26px)] italic leading-snug text-bark [animation-delay:.2s]" style={SERIF}>
            Create magical memories that last a lifetime: two 4×6 prints and every digital image, on 8 magical dates.
          </p>

          <dl className="m-0 grid w-full max-w-[520px] animate-rise grid-cols-3 border border-line2 bg-ivory/80 [animation-delay:.3s]">
            {STRIP.map(([label, value, note], i) => (
              <div key={label} className={`flex flex-col gap-1 px-3 py-3.5 sm:px-5 sm:py-4 ${i < STRIP.length - 1 ? "border-r border-line2" : ""}`}>
                <dt className="font-caps text-[10px] uppercase tracking-[0.18em] text-crimson sm:text-[11px]">{label}</dt>
                <dd className="m-0 flex flex-col gap-0.5">
                  <span className="text-[24px] font-bold leading-none tabular-nums sm:text-[32px]" style={SERIF}>
                    {value}
                  </span>
                  <span className="text-[11px] leading-snug text-muted sm:text-[13px]">{note}</span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="flex w-full max-w-[520px] animate-rise flex-wrap gap-3 [animation-delay:.4s]">
            <Button href="#book" modal="santa" className="min-w-[210px] flex-[1_1_220px]">
              Choose your date
            </Button>
            <Button href="#book" variant="outline" className="flex-[1_1_170px]">
              See the dates
            </Button>
          </div>

          <p className="m-0 animate-rise text-[14px] text-muted [animation-delay:.5s]">
            Santa is here {BRAND.santaHours}. No time slot needed, walk in any time on your date.
          </p>
        </div>
      </div>
    </section>
  );
}
