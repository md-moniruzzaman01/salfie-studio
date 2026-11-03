"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BookLauncher } from "@/components/luxe/booking-modal";
import { BookingBar, DateChip, DateRow, SessionCard, Stepper, StepTitle, TimeSlot, Ticket } from "@/components/luxe/booking-ui";
import { CheckoutError, Confirmation, ContactFields, useCheckout, useScrollOnStage, useSectionInView } from "@/components/luxe/booking-flow";
import { SectionHeading, Script } from "@/components/luxe/home-sections";
import { CountUp } from "@/components/luxe/motion";
import { LIMITS, PRICES, dateParts, isEarlyBirdAt, selfieUnitPrice, sessionQuote, studioSeasonDates, type Booking, type SessionId } from "@/lib/booking";
import { getAvailability } from "@/lib/api";
import { DEFAULT_STUDIO_TIMES } from "@/lib/content";
import { formatTime } from "@/lib/pricing";
import type { DayAvailability } from "@/lib/types";
import { useNow } from "@/lib/use-now";

const SESSION_NAME: Record<SessionId, string> = {
  selfie: "Selfie Studio Access",
  pro: "Professional Portrait Session",
  byo: "Bring Your Own Photographer",
};

/**
 * Selfie Studio Access is pre-selected, so a typical booking is four taps:
 * date, time, Continue, Pay.
 */
export function StudioBooking({ mode = "section" }: { mode?: "section" | "modal" }) {
  const modal = mode === "modal";
  const ref = useRef<HTMLElement>(null);
  const inView = useSectionInView(ref);
  const flow = useCheckout();
  const now = useNow();
  const early = isEarlyBirdAt(now);

  const [stage, setStage] = useState<"choose" | "review">("choose");
  useScrollOnStage(ref, stage);
  const [session, setSession] = useState<SessionId>("selfie");
  const [availability, setAvailability] = useState<DayAvailability[] | null>(null);
  const [date, setDate] = useState<string>();
  const [time, setTime] = useState<string>();
  const [guests, setGuests] = useState(2);
  const [freeGuests, setFreeGuests] = useState(0);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    let live = true;
    getAvailability(session).then((a) => live && setAvailability(a)).catch(() => live && setAvailability(null));
    return () => {
      live = false;
    };
  }, [session]);

  const seasonDates = useMemo(() => studioSeasonDates(), []);
  const day = availability?.find((a) => a.date === date);
  const dateOpen = (iso: string) => {
    if (!availability || availability.length === 0) return true;
    return availability.some((a) => a.date === iso && a.available);
  };
  const open = session === "selfie" ? day?.times : day?.privateTimes;
  const timeOpen = (t: string) => !open || open.includes(t);

  // A change of session or date can close the chosen time; never carry a closed slot forward.
  const chosenTime = time && timeOpen(time) ? time : undefined;

  const quote = useMemo(() => sessionQuote(session, guests, early), [session, guests, early]);
  const ready = !!date && !!chosenTime;
  const label = ready ? `${dateParts(date!).label} · ${formatTime(chosenTime!)}` : date ? `${dateParts(date).label} · pick a time` : "Choose date & time";

  const build = (customer: Booking["customer"]): Booking => ({
    experience: session,
    date: date!,
    time: chosenTime,
    guests: session === "selfie" ? guests : undefined,
    freeGuests: session === "selfie" && freeGuests > 0 ? freeGuests : undefined,
    notes: notes.trim() || undefined,
    customer,
    quote,
  });

  const onBar = () => {
    if (stage === "choose") {
      setStage("review");
    } else void flow.submit(build);
  };

  const rows: [string, string][] = [
    ["Session", SESSION_NAME[session]],
    ["Date", date ? dateParts(date).label : ""],
    ["Time", chosenTime ? `${formatTime(chosenTime)} · 1 hour` : ""],
    ...(session === "selfie" ? ([["Guests", `${guests}${freeGuests ? ` + ${freeGuests} free (3 and under)` : ""}`]] as [string, string][]) : []),
    ...(notes.trim() ? ([["Notes", notes.trim()]] as [string, string][]) : []),
  ];

  const body = (
    flow.result ? (
          <Confirmation result={flow.result} summary={`${SESSION_NAME[session]}, ${dateParts(date!).label} at ${formatTime(chosenTime!)}.`} />
        ) : stage === "choose" ? (
          <div className="flex flex-col gap-[clamp(48px,6vw,80px)]">
            <div className="flex flex-col gap-6">
              <StepTitle n={1} title="Pick a session" />
              <div role="radiogroup" aria-label="Session" className="grid gap-4 md:grid-cols-3">
                <SessionCard
                  selected={session === "selfie"}
                  onSelect={() => setSession("selfie")}
                  title="Selfie Studio Access"
                  price={<CountUp to={selfieUnitPrice(early)} decimals={2} prefix="$" />}
                  priceNote={early ? "per person · early bird, regularly $44.99" : "per person · one hour"}
                  body={`Use all eight sets with your own phone. Family four-pack $${PRICES.selfieBundle.price}, $${PRICES.selfieBundle.extra} for each extra guest. Ages 3 and under free.`}
                  badge="Take your own photos"
                />
                <SessionCard
                  selected={session === "pro"}
                  onSelect={() => setSession("pro")}
                  title="Professional Portrait Session"
                  price={<CountUp to={PRICES.professional} prefix="$" />}
                  priceNote="per session · all digitals"
                  body="Our photographer, edited images and every digital photo, for individuals, couples, families and groups."
                />
                <SessionCard
                  selected={session === "byo"}
                  onSelect={() => setSession("byo")}
                  title="Bring Your Own Photographer"
                  price={<CountUp to={PRICES.byoPhotographer} prefix="$" />}
                  priceNote="for one private hour"
                  body="A private hour with all eight sets for the photographer you already trust."
                />
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <StepTitle n={2} title="Pick a date" hint="Open every day from November 27 to December 20." />
              <DateRow label="Studio dates" showLegend={seasonDates.some((iso) => !dateOpen(iso))}>
                {seasonDates.map((iso) => (
                  <DateChip key={iso} iso={iso} selected={date === iso} disabled={!dateOpen(iso)} onSelect={setDate} />
                ))}
              </DateRow>
            </div>

            <div className="flex flex-col gap-6">
              <StepTitle n={3} title="Pick a time" hint="One-hour sessions, 11 AM to 6 PM." />
              {date ? (
                <div role="radiogroup" aria-label="Start time" className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-8">
                  {DEFAULT_STUDIO_TIMES.map((t) => (
                    <TimeSlot key={t} time={t} selected={chosenTime === t} disabled={!timeOpen(t)} onSelect={setTime} />
                  ))}
                </div>
              ) : (
                <p className="m-0 border border-dashed border-line2 px-5 py-4 text-[16px] text-muted">Choose a date to see open times.</p>
              )}
            </div>

            {session === "selfie" ? (
              <div className="flex flex-col gap-6">
                <StepTitle n={4} title="Who is coming?" hint="The family four-pack is applied automatically when it costs less." />
                <div className="max-w-[640px]">
                  <Stepper label="Guests" hint="Paying guests" value={guests} min={1} max={LIMITS.selfieMaxGuests} onChange={setGuests} />
                  <Stepper label="Aged 3 and under" hint="Free" value={freeGuests} min={0} max={LIMITS.selfieMaxFreeGuests} onChange={setFreeGuests} />
                </div>
              </div>
            ) : null}

            <div className="flex max-w-[640px] flex-col gap-4">
              <StepTitle n={session === "selfie" ? 5 : 4} title="Anything we should know?" hint="Optional. Outfit colors, a theme, a favorite set." />
              <label className="sr-only" htmlFor="studio-notes">
                Notes
              </label>
              <textarea id="studio-notes" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={300} rows={3} className="w-full resize-none border border-line2 bg-ivory p-4 text-[17px] text-onyx placeholder:text-muted/60 focus:border-onyx" placeholder="Optional notes" />
            </div>
          </div>
        ) : (
          <div className="grid max-w-[1000px] gap-10 lg:grid-cols-2 lg:gap-14">
            <Ticket title={SESSION_NAME[session]} rows={rows} quote={quote} />
            <div className="flex flex-col gap-6">
              <StepTitle n={session === "selfie" ? 6 : 5} title="Your details" hint="Your confirmation goes to this email." />
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
          total={ready ? quote.total : null}
          cta={stage === "choose" ? "Continue" : "Pay with Square"}
          disabled={stage === "choose" ? !ready : false}
          busy={flow.busy}
          onClick={onBar}
          onBack={stage === "review" ? () => setStage("choose") : undefined}
        />
      );

  if (modal) {
    return (
      <div ref={ref as React.RefObject<HTMLDivElement>} className="flex flex-1 flex-col">
        <div className="flex flex-col gap-10 px-6 pb-8 pt-8">{body}</div>
        {bar}
      </div>
    );
  }

  return (
    <div id="book" className="scroll-mt-16">
      <div className="md:hidden">
        <BookLauncher kind="studio" eyebrow="Book your hour" title="Choose your session." body="Pick a session, a date and an hourly slot, then pay with Square." cta="Pick a session" />
      </div>
      <section ref={ref} aria-label="Book the Portrait Studio" className="hidden bg-soft px-6 pb-[clamp(120px,16vw,200px)] pt-[clamp(80px,12vw,176px)] sm:px-10 md:block lg:px-16">
        <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-[clamp(48px,7vw,96px)]">
          <SectionHeading eyebrow="Book your hour" lines={["Choose your", <Script key="s">session.</Script>]} />
          {body}
        </div>
        {bar}
      </section>
    </div>
  );
}
