import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { Button } from "@/components/luxe/button";
import type { ModalKind } from "@/components/luxe/booking-modal-context";

const SERIF = { fontFamily: '"Playfair Display", Georgia, serif' } as const;

interface LightHeroProps {
  image: StaticImageData;
  alt: string;
  /** CSS object-position of the photograph, e.g. "50% 20%". */
  position: string;
  label: string;
  /** The green script line above the title. */
  script: string;
  /** The large serif title. Use a line break to split it. */
  title: ReactNode;
  lead: string;
  primary: { label: string; href: string; modal?: ModalKind };
  secondary?: { label: string; href: string; modal?: ModalKind };
  note?: string;
}

/**
 * The shared light opener, in the spirit of the Santa hero: the photograph sits
 * to the right and dissolves into the ivory page, with the headline, a short
 * lead and two buttons on the left. Home and the Portrait Studio use it so
 * every page opens in the same light.
 */
export function LightHero({ image, alt, position, label, script, title, lead, primary, secondary, note }: LightHeroProps) {
  return (
    <section aria-label={label} className="relative isolate overflow-hidden bg-soft text-onyx">
      <div aria-hidden className="absolute inset-x-0 top-0 -z-20 h-[54svh] [mask-image:linear-gradient(180deg,#000_55%,transparent_100%)] lg:inset-y-0 lg:left-auto lg:right-0 lg:h-auto lg:w-[62%] lg:[mask-image:linear-gradient(90deg,transparent_0%,#000_36%)]">
        <Image src={image} alt={alt} fill priority quality={60} sizes="(min-width: 1024px) 62vw, 100vw" className="object-cover" style={{ objectPosition: position }} />
      </div>
      <span
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(250,247,242,1)_0%,rgba(250,247,242,0.96)_40%,rgba(250,247,242,0.25)_50%,rgba(250,247,242,0)_62%)] max-lg:hidden"
      />

      <div className="mx-auto flex max-w-[1240px] flex-col items-start px-6 pb-[clamp(72px,10vw,128px)] pt-[45svh] sm:px-10 lg:min-h-[calc(100svh-76px)] lg:justify-center lg:px-16 lg:pt-[clamp(88px,9vw,120px)]">
        <div className="flex max-w-[600px] flex-col items-start gap-6">
          <p className="eyebrow m-0 animate-rise text-crimson">{label}</p>

          <h1 className="m-0 flex animate-rise flex-col leading-[0.98] [animation-delay:.08s]">
            <span className="font-script text-[clamp(44px,5.4vw,72px)] font-normal leading-none text-evergreen">{script}</span>
            <span className="text-[clamp(56px,7.2vw,108px)] font-bold tracking-[-0.02em]" style={SERIF}>
              {title}
            </span>
          </h1>

          <p className="m-0 max-w-[40ch] animate-rise text-[clamp(20px,2.1vw,26px)] italic leading-snug text-bark [animation-delay:.2s]" style={SERIF}>
            {lead}
          </p>

          <div className="flex w-full max-w-[520px] animate-rise flex-wrap gap-3 [animation-delay:.3s]">
            <Button href={primary.href} modal={primary.modal} className="min-w-[210px] flex-[1_1_220px]">
              {primary.label}
            </Button>
            {secondary ? (
              <Button href={secondary.href} modal={secondary.modal} variant="outline" className="flex-[1_1_190px]">
                {secondary.label}
              </Button>
            ) : null}
          </div>

          {note ? <p className="m-0 animate-rise text-[14px] text-muted [animation-delay:.4s]">{note}</p> : null}
        </div>
      </div>
    </section>
  );
}
