"use client";

import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { ApiError, createPhotographerBooking, getPhotographerAvailability } from "@/lib/api";
import { formatTime } from "@/lib/pricing";
import type { PhotographerDay, PhotographerPackage } from "@/lib/types";

const DAYS_PER_PAGE = 6;

const usd = (cents: number) =>
  `$${(cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: cents % 100 ? 2 : 0,
  })}`;

function addMinutes(time: string, minutes: number) {
  const [hour = 0, minute = 0] = time.split(":").map(Number);
  const total = hour * 60 + minute + minutes;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function dateParts(date: string) {
  const value = new Date(`${date}T00:00:00Z`);
  const format = (options: Intl.DateTimeFormatOptions) => value.toLocaleDateString("en-US", { timeZone: "UTC", ...options });
  return {
    weekday: format({ weekday: "short" }),
    day: format({ day: "numeric" }),
    month: format({ month: "short" }),
    long: format({ weekday: "long", month: "long", day: "numeric" }),
  };
}

interface FormValues {
  name: string;
  email: string;
  phone: string;
  notes: string;
  terms: boolean;
}

const EMPTY_FORM: FormValues = { name: "", email: "", phone: "", notes: "", terms: false };

export function PhotographerBookingPanel() {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [days, setDays] = useState<PhotographerDay[]>([]);
  const [packageInfo, setPackageInfo] = useState<PhotographerPackage | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [page, setPage] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [form, setForm] = useState<FormValues>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getPhotographerAvailability()
      .then((availability) => {
        if (cancelled) return;
        const openDays = availability.days
          .map((day) => ({ ...day, slots: day.slots.filter((slot) => slot.remaining > 0) }))
          .filter((day) => day.slots.length > 0);
        setDays(openDays);
        setPackageInfo(availability.packages[0] ?? null);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const pageCount = Math.max(1, Math.ceil(days.length / DAYS_PER_PAGE));
  const safePage = Math.min(page, pageCount - 1);
  const visibleDays = days.slice(safePage * DAYS_PER_PAGE, (safePage + 1) * DAYS_PER_PAGE);
  const activeDay = days.find((day) => day.date === selectedDate) ?? days[0] ?? null;
  const activeSlot = activeDay?.slots.find((slot) => slot.startTime === selectedTime) ?? null;
  const duration = activeSlot?.durationMin ?? packageInfo?.durationMin ?? 60;

  const emailOk = /.+@.+\..+/.test(form.email);
  const phoneOk = form.phone.trim().length >= 7;

  const retry = () => {
    setStatus("loading");
    setReloadKey((v) => v + 1);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const errors: Partial<Record<keyof FormValues, string>> = {};
    if (form.name.trim().length < 2) errors.name = "Name is required";
    if (!emailOk) errors.email = "Enter a valid email";
    if (!phoneOk) errors.phone = "Enter a valid phone number";
    if (!form.terms) errors.terms = "Please accept the booking terms";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    if (!activeDay || !activeSlot || !packageInfo) {
      setSubmitError("Choose an available date and time to continue.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await createPhotographerBooking({
        date: activeDay.date,
        startTime: activeSlot.startTime,
        packageKey: packageInfo.key,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        notes: form.notes.trim() || undefined,
      });
      if (result.checkoutUrl) {
        window.location.assign(result.checkoutUrl);
        return;
      }
      setDone(true);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setSubmitError("That hour was just reserved. Please choose another available time.");
        setSelectedTime(null);
        retry();
      } else {
        setSubmitError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border border-line bg-white shadow-[0_26px_80px_-46px_rgba(74,10,18,0.3)]">
      <div className="flex items-center justify-between gap-6 border-b border-line bg-sand px-6 py-5 sm:px-8">
        <div>
          <p className="eyebrow !text-[10px] text-crimson">Live booking</p>
          <h3 className="mt-1 font-display text-2xl text-ink">Reserve your hour</h3>
        </div>
        <div className="text-right">
          <p className="font-display text-3xl leading-none text-ink">{packageInfo ? usd(packageInfo.priceCents) : "$75"}</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted">60 minutes</p>
        </div>
      </div>

      {status === "loading" ? (
        <div className="grid min-h-[480px] place-items-center px-8 text-center">
          <div>
            <div aria-hidden className="mx-auto size-7 animate-spin rounded-full border-2 border-crimson border-t-transparent" />
            <p className="mt-5 font-display text-xl text-ink">Checking the calendar</p>
            <p className="mt-2 text-sm text-muted">Loading the latest available hours…</p>
          </div>
        </div>
      ) : null}

      {status === "error" ? (
        <div className="grid min-h-[480px] place-items-center px-8 text-center">
          <div className="max-w-sm">
            <p className="font-display text-2xl text-ink">Live booking is temporarily unavailable</p>
            <p className="mt-3 text-sm leading-6 text-muted">We couldn&apos;t reach the studio calendar. No reservation has been made.</p>
            <button
              type="button"
              onClick={retry}
              className="mt-7 inline-flex min-h-12 items-center gap-2 bg-ink px-6 text-[12px] font-bold uppercase tracking-[0.16em] text-cream transition-colors hover:bg-crimson"
            >
              Try again →
            </button>
          </div>
        </div>
      ) : null}

      {status === "ready" && days.length === 0 ? (
        <div className="grid min-h-[480px] place-items-center px-8 text-center">
          <div className="max-w-sm">
            <p className="font-display text-2xl text-ink">No open hours right now</p>
            <p className="mt-3 text-sm leading-6 text-muted">New photographer sessions are added regularly. Please check back soon.</p>
          </div>
        </div>
      ) : null}

      {status === "ready" && days.length > 0 && !done ? (
        <form onSubmit={onSubmit} noValidate className="p-6 sm:p-8">
          <StepHeader number="01" title="Choose a date" />
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-muted">Showing live studio availability</p>
            <div className="flex gap-2">
              <PagerButton label="Previous dates" disabled={safePage === 0} onClick={() => setPage((v) => Math.max(0, v - 1))}>
                ‹
              </PagerButton>
              <PagerButton label="Next dates" disabled={safePage >= pageCount - 1} onClick={() => setPage((v) => Math.min(pageCount - 1, v + 1))}>
                ›
              </PagerButton>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {visibleDays.map((day) => {
              const part = dateParts(day.date);
              const active = day.date === activeDay?.date;
              return (
                <button
                  key={day.date}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setSelectedDate(day.date);
                    setSelectedTime(null);
                  }}
                  className={clsx(
                    "flex min-h-20 flex-col items-center justify-center border px-0.5 py-2 text-center leading-tight transition-colors",
                    active ? "border-crimson bg-crimson text-cream" : "border-line bg-white hover:border-crimson hover:bg-sand",
                  )}
                >
                  <span className={clsx("text-[10px] uppercase tracking-[0.14em]", active ? "text-cream/70" : "text-muted")}>{part.weekday}</span>
                  <span className="font-display text-2xl">{part.day}</span>
                  <span className={clsx("text-[10px] uppercase tracking-[0.14em]", active ? "text-cream/70" : "text-muted")}>{part.month}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-8">
            <StepHeader number="02" title="Choose an hour" />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {(activeDay?.slots ?? []).map((slot) => {
                const active = slot.startTime === activeSlot?.startTime;
                const slotDuration = slot.durationMin ?? packageInfo?.durationMin ?? 60;
                const end = slot.endTime ?? addMinutes(slot.startTime, slotDuration);
                return (
                  <button
                    key={slot.startTime}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSelectedTime(slot.startTime)}
                    className={clsx(
                      "min-h-16 border px-3 py-2.5 text-left transition-colors",
                      active ? "border-crimson bg-crimson text-cream" : "border-line bg-white hover:border-crimson hover:bg-sand",
                    )}
                  >
                    <span className="block text-sm">{formatTime(slot.startTime)}</span>
                    <span className={clsx("mt-1 block text-[11px]", active ? "text-cream/70" : "text-muted")}>
                      to {formatTime(end)} · {Math.min(slot.remaining, 2)} {slot.remaining === 1 ? "spot" : "spots"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 border-t border-line pt-8">
            <StepHeader number="03" title="Your details" />
            <div className="flex flex-col gap-4">
              <Field label="Full name" error={fieldErrors.name}>
                <input
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="h-[52px] w-full border border-line bg-white px-3.5 text-base outline-none transition-colors focus:border-crimson"
                />
              </Field>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Email address" error={fieldErrors.email}>
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="name@email.com"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="h-[52px] w-full border border-line bg-white px-3.5 text-base outline-none transition-colors focus:border-crimson"
                  />
                </Field>
                <Field label="Phone number" error={fieldErrors.phone}>
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="(000) 000-0000"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="h-[52px] w-full border border-line bg-white px-3.5 text-base outline-none transition-colors focus:border-crimson"
                  />
                </Field>
              </div>
              <Field label="Shoot notes" hint="Optional">
                <textarea
                  rows={3}
                  placeholder="Tell us what you plan to photograph or anything we should know."
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  className="w-full resize-none border border-line bg-white px-3.5 py-3 text-base outline-none transition-colors focus:border-crimson"
                />
              </Field>
            </div>
          </div>

          <div className="mt-7 border border-line bg-sand p-5">
            <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-sm">
              <dt className="text-muted">Session</dt>
              <dd className="text-right text-bark">{packageInfo?.label ?? "Professional photographer access"}</dd>
              <dt className="text-muted">Date</dt>
              <dd className="text-right text-bark">{activeDay ? dateParts(activeDay.date).long : "Select a date"}</dd>
              <dt className="text-muted">Time</dt>
              <dd className="text-right text-bark">
                {activeSlot ? `${formatTime(activeSlot.startTime)} – ${formatTime(activeSlot.endTime ?? addMinutes(activeSlot.startTime, duration))}` : "Select an hour"}
              </dd>
              <dt className="mt-3 border-t border-line2 pt-3 text-[11px] uppercase tracking-[0.18em] text-muted">Total</dt>
              <dd className="mt-3 border-t border-line2 pt-3 text-right font-display text-3xl leading-none text-ink">
                {packageInfo ? usd(packageInfo.priceCents) : "$75"}
              </dd>
            </dl>
          </div>

          <label className="mt-5 flex items-start gap-3 text-sm leading-5 text-muted">
            <input
              type="checkbox"
              checked={form.terms}
              onChange={(e) => setForm((f) => ({ ...f, terms: e.target.checked }))}
              className="mt-0.5 accent-crimson"
            />
            <span>I understand that setup and breakdown are included in my one-hour reservation.</span>
          </label>
          {fieldErrors.terms ? <p className="mt-1 text-[13px] text-crimson">{fieldErrors.terms}</p> : null}

          {submitError ? (
            <div role="alert" className="mt-5 rounded-xl border border-crimson bg-white px-4 py-3 text-sm text-crimson">
              {submitError}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting || !activeSlot}
            className="mt-6 flex min-h-[54px] w-full items-center justify-center gap-2 bg-ink text-[13px] font-bold uppercase tracking-[0.16em] text-cream transition-colors hover:bg-crimson disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? "Preparing secure checkout…" : "Reserve this hour →"}
          </button>
          <p className="mt-3 text-center text-[13px] text-muted">Secure payment · Your slot is confirmed after checkout</p>
        </form>
      ) : null}

      {done ? (
        <div className="flex flex-col items-center gap-3 p-8 text-center">
          <div aria-hidden className="flex size-[72px] animate-pop items-center justify-center rounded-full bg-crimson text-[32px] text-cream">
            ✓
          </div>
          <div className="font-display text-[28px] italic leading-none text-crimson">You&apos;re booked!</div>
          <p className="text-base text-muted">Your confirmation and receipt are on their way by email.</p>
        </div>
      ) : null}
    </div>
  );
}

function StepHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="grid size-7 place-items-center rounded-full bg-crimson text-[10px] font-bold text-cream">{number}</span>
      <h4 className="eyebrow !text-[11px] text-ink">{title}</h4>
    </div>
  );
}

function PagerButton({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-8 place-items-center border border-line text-base transition-colors hover:border-crimson hover:bg-sand disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] text-bark">
        {label}
        {hint ? <span className="ml-1 text-[11px] font-normal normal-case tracking-normal text-muted">({hint})</span> : null}
      </span>
      {children}
      {error ? <span className="mt-1 block text-[13px] text-crimson">{error}</span> : null}
    </label>
  );
}
