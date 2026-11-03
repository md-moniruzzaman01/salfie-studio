"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BookLauncher } from "@/components/luxe/booking-modal";
import { BookingBar, DateChip, DateRow, Stepper, StepTitle, Ticket } from "@/components/luxe/booking-ui";
import { CheckoutError, Confirmation, ContactFields, useCheckout, useScrollOnStage, useSectionInView } from "@/components/luxe/booking-flow";
import { SectionHeading, Script } from "@/components/luxe/home-sections";
import { LIMITS, dateParts, santaQuote, type Booking } from "@/lib/booking";
import { getAvailability } from "@/lib/api";
import { EVENT_DATES } from "@/lib/content";
import type { DayAvailability } from "@/lib/types";

/**
 * Three taps to checkout: tap a date, Continue, Pay. The sticky bar keeps the
 * choice and the live total on screen the whole time.
 */
export function SantaBooking({ mode = "section" }: { mode?: "section" | "modal" }) {
  const modal = mode === "modal";
  const ref = useRef<HTMLElement>(null);
  const inView = useSectionInView(ref);
  const flow = useCheckout();

  const [stage, setStage] = useState<"choose" | "review">("choose");
  useScrollOnStage(ref, stage);
  const [availability, setAvailability] = useState<DayAvailability[] | null>(null);
  const [date, setDate] = useState<string>();
  const [children, setChildren] = useState(1);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    let live = true;
    getAvailability("santa").then((a) => live && setAvailability(a)).catch(() => live && setAvailability(null));
    return () => {
      live = false;
    };
  }, []);

  const isOpen = (iso: string) => !availability || availability.some((a) => a.date === iso && a.available);
  const quote = useMemo(() => santaQuote(children), [children]);
  const label = date ? `${dateParts(date).label} · 11 AM – 7 PM` : "Select a date";

  const build = (customer: Booking["customer"]): Booking => ({ experience: "santa", date: date!, children, notes: notes.trim() || undefined, customer, quote });

  const onBar = () => {
    if (stage === "choose") {
      setStage("review");
    } else void flow.submit(build);
  };

  const body = (
    flow.result ? (
          <Confirmation result={flow.result} summary={`${dateParts(date!).label}, with Santa.`} />
        ) : stage === "choose" ? (
          <div className="flex flex-col gap-14">
            <div className="flex flex-col gap-6">
              <StepTitle n={1} title="Pick a date" hint="Eight Santa days this season." />
              <DateRow label="Santa dates" showLegend={EVENT_DATES.some((d) => !isOpen(d.iso))}>
                {EVENT_DATES.map((d) => (
                  <DateChip key={d.iso} iso={d.iso} selected={date === d.iso} disabled={!isOpen(d.iso)} onSelect={setDate} />
                ))}
              </DateRow>
            </div>

            <div className="flex flex-col gap-6">
              <StepTitle n={2} title="How many children?" hint="$34.99 per child. The whole family is welcome in the photo." />
              <Stepper label="Children" value={children} min={1} max={LIMITS.santaMaxChildren} onChange={setChildren} />
            </div>

            <div className="flex flex-col gap-4">
              <StepTitle n={3} title="Anything we should know?" hint="Optional. Names, a first Christmas, a wish list." />
              <label className="sr-only" htmlFor="santa-notes">
                Notes
              </label>
              <textarea id="santa-notes" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={300} rows={3} className="w-full resize-none border border-line2 bg-ivory p-4 text-[17px] text-onyx placeholder:text-muted/60 focus:border-onyx" placeholder="Optional notes" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            <Ticket
              title="Photos with Santa"
              rows={[
                ["Date", dateParts(date!).label],
                ["Arrive", "Any time, 11 AM – 7 PM"],
                ["Children", String(children)],
                ["Includes", "Two 4×6 prints + all digitals"],
                ...(notes.trim() ? ([["Notes", notes.trim()]] as [string, string][]) : []),
              ]}
              quote={quote}
            />
            <div className="flex flex-col gap-6">
              <StepTitle n={4} title="Your details" hint="Your confirmation goes to this email." />
              <ContactFields flow={flow} />
              <CheckoutError message={flow.error} />
            </div>
          </div>
        )
  );
  const bar = flow.result ? null : (
        <BookingBar
          placement={modal ? "sticky" : "fixed"}
          visible={modal || inView || stage === "review"}
          label={label}
          total={date ? quote.total : null}
          cta={stage === "choose" ? "Continue" : "Pay with Square"}
          disabled={stage === "choose" ? !date : false}
          busy={flow.busy}
          onClick={onBar}
          onBack={stage === "review" ? () => setStage("choose") : undefined}
        />
      );

  const heading = (
    <div className="lg:sticky lg:top-28 lg:self-start">
      <SectionHeading eyebrow="Book your visit" lines={["Choose your", <Script key="s">date.</Script>]} />
      <p className="mt-6 max-w-[34ch] text-[17px] leading-relaxed text-muted">No time slot needed. Arrive any time between 11 AM and 7 PM on your day, and bring the whole family.</p>
    </div>
  );

  // Inside the phone sheet: one column, a bar pinned to the sheet's bottom.
  if (modal) {
    return (
      <div ref={ref as React.RefObject<HTMLDivElement>} className="flex flex-1 flex-col">
        <div className="flex flex-col gap-10 px-6 pb-8 pt-8">
          <p className="m-0 text-[16px] leading-relaxed text-muted">No time slot needed. Arrive any time between 11 AM and 7 PM on your day, and bring the whole family.</p>
          {body}
        </div>
        {bar}
      </div>
    );
  }

  return (
    <div id="book" className="scroll-mt-16">
      <div className="md:hidden">
        <BookLauncher kind="santa" eyebrow="Book your visit" title="Choose your date." body="Pick a day, add your children and pay with Square. It takes about a minute." cta="Choose your date" />
      </div>
      <section ref={ref} aria-label="Book Photos with Santa" className="hidden bg-soft px-6 pb-[clamp(120px,16vw,200px)] pt-[clamp(80px,12vw,176px)] sm:px-10 md:block lg:px-16">
        <div className="mx-auto grid w-full max-w-[1360px] gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          {heading}
          {body}
        </div>
        {bar}
      </section>
    </div>
  );
}
