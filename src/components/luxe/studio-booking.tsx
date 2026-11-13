"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useBookingModal } from "@/components/luxe/booking-modal-context";
import { BookingBar, DateChip, DateRow, SeasonCalendar, SessionCard, Stepper, StepTitle, TimeSlot, Ticket, WizardProgress } from "@/components/luxe/booking-ui";
import { CheckoutError, Confirmation, ContactFields, useCheckout, useScrollOnStage, useSectionInView } from "@/components/luxe/booking-flow";
import { SectionHeading, Script } from "@/components/luxe/home-sections";
import { CountUp } from "@/components/luxe/motion";
import { LIMITS, PRICES, dateParts, selfieQuote, sessionQuote, studioSeasonDates, type Booking, type SessionId } from "@/lib/booking";
import { getAvailability } from "@/lib/api";
import { DEFAULT_STUDIO_TIMES } from "@/lib/content";
import { formatTime } from "@/lib/pricing";
import type { DayAvailability } from "@/lib/types";
import { useSelfiePrice, type SelfiePrice } from "@/lib/use-selfie-pricing";

const SESSION_NAME: Record<SessionId, string> = {
  selfie: "Selfie Studio Access",
  pro: "Professional Portrait Session",
  byo: "Bring Your Own Photographer",
};

const wizardSteps = (session: SessionId) => ["Session", "Date & time", session === "selfie" ? "Your party" : "Notes", "Checkout"];
type WizardStep = 0 | 1 | 2 | 3;

/**
 * Desktop: one long page with a sticky bar (Continue, then Checkout).
 * Phone sheet: one screen per step with a progress bar, so nobody scrolls a
 * wall of options. Selfie Studio Access is pre-selected, and opening from a
 * price tier on the page skips the session step.
 */
export function StudioBooking({ mode = "section", initialSession }: { mode?: "section" | "modal"; initialSession?: SessionId }) {
  const modal = mode === "modal";
  const ref = useRef<HTMLElement>(null);
  const inView = useSectionInView(ref);
  const flow = useCheckout();
  const price = useSelfiePrice();
  const { early, unit, regular, endLabel } = price;

  const [stage, setStage] = useState<"choose" | "review">("choose");
  const [step, setStep] = useState<WizardStep>(initialSession ? 1 : 0);
  useScrollOnStage(ref, modal ? `w${step}` : stage);
  const [session, setSession] = useState<SessionId>(initialSession ?? "selfie");
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

  const quote = useMemo(() => sessionQuote(session, guests, early, { unit, regular }), [session, guests, early, unit, regular]);
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
    if (modal) {
      if (step < 3) setStep((step + 1) as WizardStep);
      else void flow.submit(build);
      return;
    }
    if (stage === "choose") setStage("review");
    else void flow.submit(build);
  };

  const rows: [string, string][] = [
    ["Session", SESSION_NAME[session]],
    ["Date", date ? dateParts(date).label : ""],
    ["Time", chosenTime ? `${formatTime(chosenTime)} · 1 hour` : ""],
    ...(session === "selfie" ? ([["Guests", `${guests}${freeGuests ? ` + ${freeGuests} free (3 and under)` : ""}`]] as [string, string][]) : []),
    ...(notes.trim() ? ([["Notes", notes.trim()]] as [string, string][]) : []),
  ];

  // Which parts show: everything at once on desktop, one step at a time on the phone.
  const showSession = !modal || step === 0;
  const showWhen = !modal || step === 1;
  const showParty = !modal || step === 2;
  const showReview = modal ? step === 3 : stage === "review";
  const num = (k: number) => (modal ? undefined : k);

  const sessionBlock = (
    <div className="flex flex-col gap-6">
      <StepTitle n={num(1)} title="Pick a session" />
      <div role="radiogroup" aria-label="Session" className={modal ? "grid gap-3" : "grid gap-4 md:grid-cols-3"}>
        <SessionCard
          compact={modal}
          selected={session === "selfie"}
          onSelect={() => setSession("selfie")}
          title="Selfie Studio Access"
          price={<CountUp to={unit} decimals={2} prefix="$" />}
          priceNote={early ? `per person · early bird through ${endLabel}, regularly $${regular.toFixed(2)}` : "per person · one hour"}
          body={`Use all eight sets with your own phone. Family package: ${PRICES.selfieFamily.minGuests} or more guests, $${PRICES.selfieFamily.each} each. Ages 3 and under free.`}
          badge={`Family of ${PRICES.selfieFamily.minGuests}+ · $${PRICES.selfieFamily.each} each`}
        />
        <SessionCard
          compact={modal}
          selected={session === "pro"}
          onSelect={() => setSession("pro")}
          title="Professional Portrait Session"
          price={<CountUp to={PRICES.professional} prefix="$" />}
          priceNote="per session · all digitals"
          body="Our photographer, edited images and every digital photo, for individuals, couples, families and groups."
        />
        <SessionCard
          compact={modal}
          selected={session === "byo"}
          onSelect={() => setSession("byo")}
          title="Bring Your Own Photographer"
          price={<CountUp to={PRICES.byoPhotographer} prefix="$" />}
          priceNote="for one private hour"
          body="A private hour with all eight sets for the photographer you already trust."
        />
      </div>
    </div>
  );

  const dateBlock = (
    <div className="flex flex-col gap-6">
      <StepTitle n={num(2)} title="Pick a date" hint="Open every day from November 27 to December 20." />
      {modal ? (
        <>
          <SeasonCalendar dates={seasonDates} selected={date} isOpen={dateOpen} onSelect={setDate} />
          {seasonDates.some((iso) => !dateOpen(iso)) ? <p className="m-0 text-[14px] text-muted">Crossed-out dates are fully booked or closed.</p> : null}
        </>
      ) : (
        <DateRow label="Studio dates" showLegend={seasonDates.some((iso) => !dateOpen(iso))}>
          {seasonDates.map((iso) => (
            <DateChip key={iso} iso={iso} selected={date === iso} disabled={!dateOpen(iso)} onSelect={setDate} />
          ))}
        </DateRow>
      )}
    </div>
  );

  const timeBlock = (
    <div className="flex flex-col gap-6">
      <StepTitle n={num(3)} title="Pick a time" hint={modal && date ? `${dateParts(date).label}. One-hour sessions, 11 AM to 7 PM.` : "One-hour sessions, 11 AM to 7 PM."} />
      {date ? (
        <div role="radiogroup" aria-label="Start time" className={modal ? "grid grid-cols-3 gap-2" : "grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-8"}>
          {DEFAULT_STUDIO_TIMES.map((t) => (
            <TimeSlot key={t} time={t} selected={chosenTime === t} disabled={!timeOpen(t)} onSelect={setTime} />
          ))}
        </div>
      ) : (
        <p className="m-0 border border-dashed border-line2 px-5 py-4 text-[16px] text-muted">Choose a date to see open times.</p>
      )}
    </div>
  );

  const guestsBlock =
    session === "selfie" ? (
      <div className="flex flex-col gap-6">
        <StepTitle n={num(4)} title="Who is coming?" hint={`Book ${PRICES.selfieFamily.minGuests} or more guests and every ticket is $${PRICES.selfieFamily.each}. Applied automatically.`} />
        <div className="max-w-[640px]">
          <Stepper label="Guests" hint="Paying guests" value={guests} min={1} max={LIMITS.selfieMaxGuests} onChange={setGuests} />
          <Stepper label="Aged 3 and under" hint="Free" value={freeGuests} min={0} max={LIMITS.selfieMaxFreeGuests} onChange={setFreeGuests} />
          <FamilyNudge guests={guests} unit={unit} regular={regular} early={early} />
        </div>
      </div>
    ) : null;

  const notesBlock = (
    <div className="flex max-w-[640px] flex-col gap-4">
      <StepTitle n={num(session === "selfie" ? 5 : 4)} title="Anything we should know?" hint="Optional. Outfit colors, a theme, a favorite set." />
      <label className="sr-only" htmlFor="studio-notes">
        Notes
      </label>
      <textarea id="studio-notes" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={300} rows={3} className="w-full resize-none border border-line2 bg-ivory p-4 text-[17px] text-onyx placeholder:text-muted/60 focus:border-onyx" placeholder="Optional notes" />
    </div>
  );

  const body = flow.result ? (
    <Confirmation result={flow.result} summary={`${SESSION_NAME[session]}, ${dateParts(date!).label} at ${formatTime(chosenTime!)}.`} />
  ) : showReview ? (
    <div className="grid max-w-[1000px] gap-10 lg:grid-cols-2 lg:gap-14">
      <Ticket title={SESSION_NAME[session]} rows={rows} quote={quote} />
      <div className="flex flex-col gap-6">
        <StepTitle n={modal ? undefined : session === "selfie" ? 6 : 5} title="Your details" hint="Your confirmation goes to this email." />
        <ContactFields flow={flow} />
        <CheckoutError message={flow.error} />
      </div>
    </div>
  ) : (
    <div className="flex flex-col gap-[clamp(40px,6vw,80px)]">
      {showSession ? sessionBlock : null}
      {showWhen ? dateBlock : null}
      {showWhen ? timeBlock : null}
      {showParty ? guestsBlock : null}
      {showParty ? notesBlock : null}
    </div>
  );

  const barCta = modal ? (step === 2 ? "Review" : step === 3 ? "Checkout" : "Continue") : stage === "choose" ? "Continue" : "Checkout";
  const barLabel = modal ? (step === 0 ? SESSION_NAME[session] : ready ? `${dateParts(date!).label} · ${formatTime(chosenTime!)}` : date ? "Pick a time" : "Pick a date") : label;
  const barTotal = modal && step === 0 ? quote.total : ready ? quote.total : null;
  const barDisabled = modal ? step === 1 && !ready : stage === "choose" ? !ready : false;
  const barBack = modal ? (step > 0 ? () => setStep((step - 1) as WizardStep) : undefined) : stage === "review" ? () => setStage("choose") : undefined;

  const bar = flow.result ? null : (
    <BookingBar
      placement={modal ? "sticky" : "fixed"}
      visible={modal || inView || stage === "review"}
      label={barLabel}
      total={barTotal}
      cta={barCta}
      disabled={barDisabled}
      busy={flow.busy}
      onClick={onBar}
      onBack={barBack}
    />
  );

  if (modal) {
    return (
      <div ref={ref as React.RefObject<HTMLDivElement>} className="flex flex-1 flex-col">
        <div className="flex flex-col gap-8 px-6 pb-8 pt-6">
          {!flow.result ? <WizardProgress steps={wizardSteps(session)} current={step} /> : null}
          {body}
        </div>
        {bar}
      </div>
    );
  }

  return (
    <div id="book" className="scroll-mt-16">
      <div className="md:hidden">
        <StudioLauncher price={price} />
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

/**
 * Under the guest stepper: tells a party of 3 that one more ticket is cheaper
 * per head, and confirms the family package once they have 4 or more.
 */
function FamilyNudge({ guests, unit, regular, early }: { guests: number; unit: number; regular: number; early: boolean }) {
  const { minGuests, each } = PRICES.selfieFamily;
  const now = selfieQuote(guests, early, { unit, regular });
  const box = "mt-2 border px-5 py-4 text-[16px] leading-snug";
  if (guests >= minGuests && now.savingsLabel === "Family package applied") {
    return (
      <p role="status" className={`${box} border-crimson bg-ivory text-onyx`}>
        <strong className="text-crimson">Family package unlocked.</strong> Every ticket is ${each.toFixed(2)}, saving ${now.savings.toFixed(2)} on this booking.
      </p>
    );
  }
  if (guests < minGuests) {
    const more = minGuests - guests;
    const withMore = selfieQuote(minGuests, early, { unit, regular });
    const extra = Math.round((withMore.total - now.total) * 100) / 100;
    return (
      <p role="status" className={`${box} border-dashed border-line2 bg-ivory/60 text-bark`}>
        Add <strong>{more} more {more === 1 ? "guest" : "guests"}</strong> and every ticket drops to ${each.toFixed(2)}.
        {extra > 0 ? ` That is only $${extra.toFixed(2)} more for ${more === 1 ? "one more person" : `${more} more people`}.` : ""}
      </p>
    );
  }
  return null;
}

// ── Phone: the three sessions as a price list that opens the sheet ──────────

/**
 * The phone stand-in for the long booking section. Instead of one vague card,
 * the three ways to book are listed with their prices; tapping one opens the
 * sheet already on the date step.
 */
function StudioLauncher({ price }: { price: SelfiePrice }) {
  const { open } = useBookingModal();
  const tiers: { id: SessionId; name: string; note: string; price: string }[] = [
    { id: "selfie", name: "Selfie Studio Access", note: `Per person · family of ${PRICES.selfieFamily.minGuests}+ pays $${PRICES.selfieFamily.each} each`, price: `$${price.unit.toFixed(2)}` },
    { id: "pro", name: "Professional Portrait Session", note: "Our photographer · all digitals", price: `$${PRICES.professional}` },
    { id: "byo", name: "Bring Your Own Photographer", note: "One private hour", price: `$${PRICES.byoPhotographer}` },
  ];
  return (
    <div className="bg-soft px-6 py-[72px]">
      <div className="flex flex-col gap-8">
        <SectionHeading eyebrow="Book your hour" lines={["Reserve", <Script key="s">your hour.</Script>]} />
        <ul className="m-0 flex list-none flex-col border-y border-onyx p-0">
          {tiers.map((t) => (
            <li key={t.id} className="border-b border-line2 last:border-b-0">
              <button type="button" onClick={() => open("studio", { session: t.id })} className="flex min-h-[88px] w-full items-center justify-between gap-4 py-5 text-left">
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="text-[18px] font-extrabold leading-tight text-onyx">{t.name}</span>
                  <span className="text-[14px] text-muted">{t.note}</span>
                </span>
                <span className="flex shrink-0 items-center gap-3">
                  <span className="font-heavy text-[24px] tabular-nums text-onyx">{t.price}</span>
                  <svg aria-hidden viewBox="0 0 24 24" className="size-5 text-crimson" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 12h16M14 6l6 6-6 6" />
                  </svg>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="m-0 text-[15px] text-muted">Open every day, November 27 to December 20, 11 AM to 7 PM. Pick a session, then a date and time. It takes about a minute.</p>
      </div>
    </div>
  );
}
