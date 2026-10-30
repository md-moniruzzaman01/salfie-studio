"use client";

import Image, { type StaticImageData } from "next/image";
import { clsx } from "clsx";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ApiError, MOCK_MODE, createBooking, getAvailability } from "@/lib/api";
import { BRAND, EVENT_DATES, EXPERIENCES, SANTA_PACKAGES } from "@/lib/content";
import { IMAGES } from "@/lib/images";
import { formatMoney, formatTime, isEarlyBird, quote } from "@/lib/pricing";
import type { DayAvailability, ExperienceId, SantaPackageId } from "@/lib/types";
import { useNow } from "@/lib/use-now";

type Step = "experience" | "date" | "quantity" | "pay" | "done";

const OPTION_IMAGES: Record<ExperienceId, { src: StaticImageData; position: string }> = {
  santa: { src: IMAGES.santaSack, position: "60% 30%" },
  selfie: { src: IMAGES.carousel, position: "50% 50%" },
  pro: { src: IMAGES.door, position: "50% 40%" },
  byo: { src: IMAGES.carousel, position: "20% 30%" },
};

function stepsFor(experience?: ExperienceId): Step[] {
  if (!experience) return ["experience", "date", "quantity", "pay"];
  return EXPERIENCES[experience].hasQuantityStep
    ? ["experience", "date", "quantity", "pay"]
    : ["experience", "date", "pay"];
}

const TITLES: Record<Step, string> = {
  experience: "What would you like?",
  date: "Pick a date",
  quantity: "How many?",
  pay: "Review & pay",
  done: "All set",
};

interface BookingSheetProps {
  preset?: ExperienceId;
  onClose: () => void;
}

export function BookingSheet({ preset, onClose }: BookingSheetProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const now = useNow();
  const earlyBird = now !== null && isEarlyBird(now);

  const [experience, setExperience] = useState<ExperienceId | undefined>(preset);
  const [stepIndex, setStepIndex] = useState(preset ? 1 : 0);
  const [date, setDate] = useState<string>();
  const [time, setTime] = useState<string>();
  const [guests, setGuests] = useState(2);
  const [santaPackage, setSantaPackage] = useState<SantaPackageId>("one");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [availability, setAvailability] = useState<DayAvailability[] | null>(null);
  const [loadingAvailability, setLoadingAvailability] = useState(!!preset);
  const requestId = useRef(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const steps = stepsFor(experience);
  const step: Step = done ? "done" : steps[Math.min(stepIndex, steps.length - 1)];
  const exp = experience ? EXPERIENCES[experience] : undefined;
  const needsTime = !!exp?.timed;
  const q = quote({ experience, guests, santaPackage }, earlyBird);
  const emailOk = /.+@.+\..+/.test(email);
  const phoneOk = phone.trim().length >= 7;
  const detailsOk = name.trim().length > 1 && emailOk && phoneOk;
  const dayInfo = availability?.find((d) => d.date === date);

  // Close on Escape, lock page scroll, and return focus to the trigger.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [onClose]);

  /** Fetch availability; only the latest request may update state. */
  const fetchAvailability = useCallback((id: ExperienceId) => {
    const req = ++requestId.current;
    getAvailability(id)
      .then((days) => req === requestId.current && setAvailability(days))
      .catch((e: unknown) => req === requestId.current && setError(e instanceof ApiError ? e.message : "Couldn't load dates."))
      .finally(() => req === requestId.current && setLoadingAvailability(false));
  }, []);

  // When the panel opens with an experience already chosen, load its dates.
  useEffect(() => {
    if (preset) fetchAvailability(preset);
    const current = requestId;
    return () => {
      current.current += 1;
    };
  }, [preset, fetchAvailability]);

  const chooseExperience = (id: ExperienceId) => {
    setExperience(id);
    setDate(undefined);
    setTime(undefined);
    setError(null);
    setStepIndex(1);
    setAvailability(null);
    setLoadingAvailability(true);
    fetchAvailability(id);
  };

  const pay = async () => {
    if (!experience || !date) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await createBooking({
        experience,
        date,
        time: needsTime ? time : undefined,
        guests: experience === "selfie" ? guests : undefined,
        santaPackage: experience === "santa" ? santaPackage : undefined,
        customer: { name: name.trim(), email: email.trim(), phone: phone.trim() },
      });
      if (result.checkoutUrl) {
        window.location.assign(result.checkoutUrl);
        return;
      }
      setDone(true);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Payment didn't go through. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  let primaryLabel = "Continue";
  let canContinue = true;
  if (step === "date") {
    canContinue = !!date && (!needsTime || !!time);
    primaryLabel = !date ? "Pick a date" : needsTime && !time ? "Pick a time" : "Continue";
  }
  if (step === "pay") {
    canContinue = detailsOk && !submitting;
    primaryLabel = submitting ? "Processing…" : !name.trim() ? "Add your name" : !emailOk ? "Add your email" : !phoneOk ? "Add your phone number" : `Pay ${formatMoney(q.total)} by card`;
  }

  const onPrimary = () => {
    if (!canContinue) return;
    if (step === "pay") void pay();
    else setStepIndex((i) => i + 1);
  };

  const dateLabel = EVENT_DATES.find((d) => d.iso === date)?.label;
  const when = dateLabel ? `${dateLabel}${needsTime && time ? ` at ${formatTime(time)}` : " · walk in 11 AM – 7 PM"}` : "";
  const otherExperience: ExperienceId = experience === "santa" ? "selfie" : "santa";
  const currentIndex = steps.indexOf(step);

  return (
    <div className="fixed inset-0 z-50 text-[18px] leading-snug">
      <button type="button" aria-label="Close booking" onClick={onClose} className="absolute inset-0 h-full w-full animate-fade cursor-pointer bg-[rgb(20_10_10/0.62)]" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute bottom-0 right-0 flex max-h-[94%] w-full max-w-[480px] animate-sheet-up flex-col overflow-hidden rounded-t-3xl bg-cream shadow-[0_-20px_60px_rgba(0,0,0,0.35)] md:top-0 md:max-h-none md:animate-sheet-in md:rounded-none"
      >
        <div className="flex flex-col gap-2.5 border-b border-line px-4 pb-3.5 pt-2.5">
          <div aria-hidden className="h-[5px] w-11 self-center rounded-full bg-line md:hidden" />
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              aria-label="Back"
              onClick={() => !done && setStepIndex((i) => Math.max(0, i - 1))}
              className={clsx("size-11 rounded-full border border-line bg-white text-xl", (stepIndex === 0 || done) && "invisible")}
            >
              ←
            </button>
            <div className="flex-1 text-center leading-tight">
              <div className="eyebrow !text-xs text-crimson">{done ? "Confirmed" : `Step ${currentIndex + 1} of ${steps.length}`}</div>
              <h2 id={titleId} className="font-display text-[23px]">
                {step === "date" && needsTime ? "Pick a date & time" : step === "quantity" && experience === "santa" ? "Choose your sitting" : TITLES[step]}
              </h2>
            </div>
            <button ref={closeRef} type="button" aria-label="Close" onClick={onClose} className="size-11 rounded-full border border-line bg-white text-2xl">
              ×
            </button>
          </div>
          <div className="flex gap-1" aria-hidden>
            {steps.map((s, i) => (
              <div key={s} className={clsx("h-[3px] flex-1 rounded-full", done || i <= currentIndex ? "bg-crimson" : "bg-line")} />
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-5 pt-4">
          {error ? (
            <div role="alert" className="rounded-xl border border-crimson bg-white px-4 py-3 text-[17px] text-crimson">
              {error}
            </div>
          ) : null}

          {step === "experience" && (
            <div className="flex flex-col gap-2.5">
              {(Object.keys(EXPERIENCES) as ExperienceId[]).map((id) => {
                const e = EXPERIENCES[id];
                const selected = experience === id;
                const price = id === "santa" && earlyBird ? 34.99 : e.price;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => chooseExperience(id)}
                    className={clsx("flex min-h-[92px] items-center gap-3.5 rounded-2xl bg-white p-2.5 text-left", selected ? "border-2 border-crimson" : "border border-line")}
                  >
                    <Image src={OPTION_IMAGES[id].src} alt="" width={70} height={70} className="size-[70px] shrink-0 rounded-xl object-cover" style={{ objectPosition: OPTION_IMAGES[id].position }} />
                    <span className="flex min-w-0 flex-1 flex-col leading-tight">
                      <span className="font-display text-xl">{e.name}</span>
                      <span className="text-base text-muted">{e.description}</span>
                      {id === "santa" && earlyBird ? (
                        <span className="mt-1 self-start rounded-full bg-crimson px-2 py-0.5 text-xs font-bold tracking-wide text-cream">Early bird ends Oct 31</span>
                      ) : null}
                    </span>
                    <span className="shrink-0 pr-1 text-right leading-tight">
                      <span className="block font-display text-[21px] font-bold">{formatMoney(price)}</span>
                      <span className="block text-sm text-muted">{id === "santa" ? "from, per sitting" : e.unit}</span>
                    </span>
                  </button>
                );
              })}
              <p className="mt-1 text-center text-[15px] text-muted">
                {BRAND.season} · {BRAND.address}
              </p>
            </div>
          )}

          {step === "date" && (
            <div className="flex flex-col gap-3.5">
              <div className="grid grid-cols-4 gap-2" aria-busy={loadingAvailability}>
                {EVENT_DATES.map((d) => {
                  const info = availability?.find((a) => a.date === d.iso);
                  const unavailable = !!availability && !info?.available;
                  const selected = date === d.iso;
                  return (
                    <button
                      key={d.iso}
                      type="button"
                      aria-pressed={selected}
                      aria-label={`${d.label}${unavailable ? ", sold out" : ""}`}
                      disabled={unavailable || loadingAvailability}
                      onClick={() => {
                        setDate(d.iso);
                        setTime(undefined);
                      }}
                      className={clsx(
                        "flex min-h-[76px] flex-col items-center justify-center rounded-2xl border px-0.5 py-1.5 leading-none transition-colors",
                        selected ? "border-crimson bg-crimson text-cream" : "border-line bg-white",
                        (unavailable || loadingAvailability) && "cursor-not-allowed opacity-40",
                      )}
                    >
                      <span className="text-xs font-bold uppercase tracking-[0.14em]">{d.dow}</span>
                      <span className="font-display text-[26px]">{d.day}</span>
                      <span className="text-sm">{unavailable ? "Full" : d.month}</span>
                    </button>
                  );
                })}
              </div>

              {needsTime && date ? (
                <div className="flex flex-col gap-2">
                  <div className="font-display text-xl">
                    Start time <span className="font-body text-[15px] text-muted">Eastern Time</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {(dayInfo?.times ?? []).map((t) => (
                      <button
                        key={t}
                        type="button"
                        aria-pressed={time === t}
                        onClick={() => setTime(t)}
                        className={clsx("min-h-12 rounded-xl border text-base", time === t ? "border-crimson bg-crimson text-cream" : "border-line bg-white")}
                      >
                        {formatTime(t)}
                      </button>
                    ))}
                  </div>
                  {dayInfo && (dayInfo.times ?? []).length === 0 ? <p className="text-base text-muted">No times left on this date. Please choose another.</p> : null}
                </div>
              ) : null}

              {experience === "santa" ? (
                <p className="rounded-2xl bg-sand px-3.5 py-3 text-[17px]">Santa is here 11 AM – 7 PM. No time slot needed: walk in any time on your date.</p>
              ) : null}
            </div>
          )}

          {step === "quantity" && experience === "santa" && (
            <fieldset className="flex flex-col gap-2.5">
              <legend className="sr-only">Sitting size</legend>
              {SANTA_PACKAGES.map((p) => {
                const selected = santaPackage === p.id;
                const price = earlyBird && p.earlyBirdPrice ? p.earlyBirdPrice : p.price;
                return (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setSantaPackage(p.id)}
                    className={clsx("flex min-h-[76px] items-center gap-3.5 rounded-2xl bg-white px-4 py-3.5 text-left", selected ? "border-2 border-crimson" : "border border-line")}
                  >
                    <span aria-hidden className="flex size-[22px] shrink-0 items-center justify-center rounded-full border-2 border-crimson">
                      <span className={clsx("size-2.5 rounded-full", selected && "bg-crimson")} />
                    </span>
                    <span className="flex-1 leading-tight">
                      <span className="block font-display text-xl">{p.name}</span>
                      <span className="block text-[15px] text-muted">{p.id === "one" && earlyBird ? "Early bird price, Oct 15–31" : p.description}</span>
                    </span>
                    <span className="shrink-0 text-right leading-tight">
                      <span className="block font-display text-[22px] font-bold">{formatMoney(price)}</span>
                      {price !== p.price ? <span className="block text-sm text-muted line-through">{formatMoney(p.price)}</span> : null}
                    </span>
                  </button>
                );
              })}
              <p className="text-base text-muted">Every sitting includes two 4×6 prints and all digital images.</p>
            </fieldset>
          )}

          {step === "quantity" && experience === "selfie" && (
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-white py-3 pl-4 pr-3">
              <span className="leading-tight">
                <span className="block font-display text-xl">Guests</span>
                <span className="block text-[15px] text-muted">$24.99 each · 1 hour access</span>
              </span>
              <span className="flex items-center gap-1.5">
                <button type="button" aria-label="Fewer guests" onClick={() => setGuests((g) => Math.max(1, g - 1))} className="size-11 rounded-full border border-line bg-cream text-2xl">
                  −
                </button>
                <span aria-live="polite" className="min-w-8 text-center font-display text-2xl">
                  {guests}
                </span>
                <button type="button" aria-label="More guests" onClick={() => setGuests((g) => Math.min(12, g + 1))} className="size-11 rounded-full bg-crimson text-2xl text-cream">
                  +
                </button>
              </span>
            </div>
          )}

          {step === "pay" && exp && (
            <div className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1 rounded-2xl bg-velvet px-4 py-3.5 text-[17px] text-cream">
                <div className="font-display text-xl">{exp.name}</div>
                <div>{when}</div>
                <div>{q.summary}</div>
                {q.savings > 0 ? <div className="font-bold text-gold">Early bird saves you {formatMoney(q.savings)}</div> : null}
              </div>
              <label className="flex flex-col gap-1 text-base font-bold">
                Full name
                <input
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-[52px] rounded-xl border border-line bg-white px-3.5 text-base"
                />
              </label>
              <label className="flex flex-col gap-1 text-base font-bold">
                <span>
                  Email <span className="font-normal text-muted">for your confirmation</span>
                </span>
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-[52px] rounded-xl border border-line bg-white px-3.5 text-base"
                />
              </label>
              <label className="flex flex-col gap-1 text-base font-bold">
                Phone
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-[52px] rounded-xl border border-line bg-white px-3.5 text-base"
                />
              </label>
              <p className="text-[15px] text-muted">Card details are entered securely with Square on the next screen. By paying you agree to the Terms and Privacy Policy.</p>
              {MOCK_MODE ? <p className="rounded-lg bg-sand px-3 py-2 text-sm text-muted">Demo mode: no API configured, so no payment is taken.</p> : null}
            </div>
          )}

          {step === "done" && exp && (
            <div className="flex flex-col items-center gap-3 pt-1 text-center">
              <div aria-hidden className="flex size-[84px] animate-pop items-center justify-center rounded-full bg-crimson text-[40px] text-cream">
                ✓
              </div>
              <div className="font-display text-[36px] italic leading-none text-crimson">You&apos;re booked!</div>
              <p className="text-lg text-muted">{emailOk ? `Your confirmation is on its way to ${email}.` : "Your confirmation and receipt are on their way by email."}</p>
              <div className="flex w-full flex-col gap-1 rounded-2xl bg-velvet px-4 py-3.5 text-left text-[17px] text-cream">
                <div className="font-display text-xl">{exp.name}</div>
                <div>{when}</div>
                <div>
                  {q.summary} · Paid {formatMoney(q.total)}
                </div>
                <div>{BRAND.address}</div>
              </div>
              <div className="grid w-full grid-cols-2 gap-2">
                <a href={`https://maps.google.com/?q=${encodeURIComponent(BRAND.address)}`} target="_blank" rel="noreferrer" className="flex min-h-[50px] items-center justify-center rounded-xl border border-ink bg-white text-base font-bold">
                  Get directions
                </a>
                <a href={BRAND.instagramUrl} target="_blank" rel="noreferrer" className="flex min-h-[50px] items-center justify-center rounded-xl border border-ink bg-white text-base font-bold">
                  Follow on Instagram
                </a>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDone(false);
                  chooseExperience(otherExperience);
                }}
                className="flex min-h-[72px] w-full items-center gap-3 rounded-2xl bg-crimson p-2.5 text-left text-cream"
              >
                <Image src={OPTION_IMAGES[otherExperience].src} alt="" width={56} height={56} className="size-14 rounded-lg object-cover" />
                <span className="flex-1">
                  <span className="block font-display text-[19px]">{otherExperience === "selfie" ? "Add the Portrait Studio" : "Add Photos with Santa"}</span>
                  <span className="block text-[15px]">{otherExperience === "selfie" ? "8 backdrops · $24.99 per person" : "Same day · 2 prints + all digitals"}</span>
                </span>
                <span aria-hidden className="pr-1.5 text-2xl">
                  →
                </span>
              </button>
            </div>
          )}
        </div>

        {step !== "experience" && step !== "done" ? (
          <div className="flex items-center gap-3 border-t border-line bg-white px-4 pb-4 pt-3">
            <div className="min-w-0 leading-tight">
              <div className="eyebrow !text-xs !tracking-[0.2em] text-muted">Total</div>
              <div className="font-display text-[26px] font-bold">{formatMoney(q.total)}</div>
            </div>
            <button
              type="button"
              disabled={!canContinue}
              onClick={onPrimary}
              className="min-h-[54px] flex-1 rounded-2xl bg-crimson text-[17px] font-bold text-cream transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            >
              {primaryLabel}
            </button>
          </div>
        ) : null}
        {step === "done" ? (
          <div className="border-t border-line bg-white px-4 pb-4 pt-3">
            <button type="button" onClick={onClose} className="min-h-[54px] w-full rounded-2xl bg-ink text-[17px] font-bold text-cream">
              Done
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
