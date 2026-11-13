"use client";

import { clsx } from "clsx";
import { useState } from "react";
import { Button } from "@/components/luxe/button";
import { Script, SectionHeading } from "@/components/luxe/home-sections";
import { Fade, ParallaxImage } from "@/components/luxe/motion";
import { LIMITS, PRICES, selfieQuote } from "@/lib/booking";
import { IMAGES } from "@/lib/images";
import { useSelfiePrice } from "@/lib/use-selfie-pricing";

const money = (n: number) => `$${n.toFixed(2)}`;

const WHY: [string, string][] = [
  ["One hour, shared", "The sets, the lights and the hour are the same whether two of you come or six. The more of you in the frame, the less each ticket costs."],
  ["The photo worth framing", "The whole family together is the picture everyone keeps. We would rather fill the sets with families than count heads."],
  ["Little ones are free", "Children aged 3 and under come at no charge, so a family of five with a toddler is only four tickets."],
];

/**
 * Marketing section for the family package: why four or more guests is
 * cheaper, and a live "what will we pay" picker that uses the same quote
 * function as checkout, so the number here is the number they are charged.
 */
export function FamilyPackage() {
  const { ready, early, unit, regular } = useSelfiePrice();
  const [guests, setGuests] = useState<number>(PRICES.selfieFamily.minGuests);
  const min = PRICES.selfieFamily.minGuests;
  const { each } = PRICES.selfieFamily;

  const quote = selfieQuote(guests, early, { unit, regular });
  const regularTotal = Math.round(guests * regular * 100) / 100;
  const unlocked = guests >= min;
  const perPerson = quote.total / guests;
  const counts = Array.from({ length: LIMITS.selfieMaxGuests - 1 }, (_, i) => i + 2);

  return (
    <section id="family" aria-label="Family package" className="overflow-hidden border-y border-onyx bg-ivory px-6 py-[clamp(72px,10vw,150px)] sm:px-10 lg:px-16">
      <div className="mx-auto grid w-full max-w-[1360px] gap-[clamp(40px,6vw,88px)] lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-6">
            <SectionHeading eyebrow="Family package" lines={["Bring everyone.", <Script key="s">Pay less each.</Script>]} />
            <p className="m-0 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="font-heavy text-[clamp(64px,11vw,132px)] leading-[0.9] text-onyx">{money(each)}</span>
              <span className="text-[clamp(18px,2vw,24px)] font-bold text-bark">each, for {min} or more guests</span>
            </p>
            <p className="m-0 max-w-[46ch] text-[18px] leading-relaxed text-muted">
              Book {min} or more tickets for the same hour and every ticket drops to {money(each)}, down from {money(regular)}. Applied automatically at checkout. No code needed.
            </p>
          </div>

          <ul className="m-0 flex list-none flex-col border-t border-onyx p-0">
            {WHY.map(([title, body]) => (
              <li key={title} className="grid gap-1 border-b border-line2 py-5 sm:grid-cols-[13rem_1fr] sm:gap-8">
                <h3 className="m-0 text-[18px] font-extrabold text-onyx">{title}</h3>
                <p className="m-0 text-[16px] leading-relaxed text-muted">{body}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          <Fade y={24}>
            <div className="relative aspect-[5/4] w-full overflow-hidden">
              <ParallaxImage src={IMAGES.stairPinkFamily} alt="A family posing together on a garland-lined staircase in the holiday studio" sizes="(min-width: 1024px) 44vw, 92vw" position="50% 35%" className="h-full w-full" />
              <span className="absolute left-4 top-4 bg-crimson px-3.5 py-2 text-[12px] font-bold uppercase tracking-[0.16em] text-ivory">Family package</span>
            </div>
          </Fade>

          <div className="border border-onyx bg-soft p-6 sm:p-8">
            <p className="eyebrow m-0 text-crimson">What will we pay?</p>
            <div role="radiogroup" aria-label="Number of guests" className="mt-4 flex flex-wrap gap-2">
              {counts.map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={guests === n}
                  onClick={() => setGuests(n)}
                  className={clsx(
                    "grid size-12 place-items-center border font-heavy text-[20px] tabular-nums transition-colors duration-300",
                    guests === n ? "border-crimson bg-crimson text-ivory" : "border-line2 bg-ivory hover:border-onyx",
                  )}
                >
                  {n}
                </button>
              ))}
              <span className="self-center pl-2 text-[15px] text-muted">guests</span>
            </div>

            <div aria-live="polite" className={clsx("mt-6 flex flex-col gap-2", ready ? undefined : "opacity-0")}>
              {unlocked ? (
                <>
                  <p className="m-0 flex items-baseline gap-3">
                    <span className="font-heavy text-[clamp(40px,5vw,56px)] leading-none tabular-nums text-onyx">{money(quote.total)}</span>
                    <span className="text-[18px] text-muted line-through tabular-nums">{money(regularTotal)}</span>
                  </p>
                  <p className="m-0 text-[17px] font-bold text-crimson">
                    You save {money(regularTotal - quote.total)} · {money(perPerson)} per person
                  </p>
                </>
              ) : (
                <>
                  <p className="m-0 font-heavy text-[clamp(40px,5vw,56px)] leading-none tabular-nums text-onyx">{money(quote.total)}</p>
                  <p className="m-0 text-[17px] text-bark">
                    Add <strong>{min - guests} more {min - guests === 1 ? "guest" : "guests"}</strong> and every ticket is {money(each)}.
                  </p>
                </>
              )}
            </div>

            <div className="mt-6">
              <Button href="/portrait-studio#book" modal="studio" className="w-full sm:w-auto">
                Book for the family
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
