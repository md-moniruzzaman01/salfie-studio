"use client";

import { clsx } from "clsx";
import { useId, type ReactNode } from "react";
import { Button } from "@/components/luxe/button";
import { dateParts, type Quote } from "@/lib/booking";
import { formatMoney, formatTime } from "@/lib/pricing";

/** Everything in the booking flow is a plain, instant control: no layout animation. */

// ── Step heading ─────────────────────────────────────────────────────────────

export function StepTitle({ n, title, hint }: { n?: number; title: string; hint?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      {n ? <p className="eyebrow m-0 text-crimson">Step {n}</p> : null}
      <h3 className="m-0 text-[clamp(22px,2.4vw,30px)] font-extrabold tracking-[-0.015em]">{title}</h3>
      {hint ? <p className="m-0 text-[16px] text-muted">{hint}</p> : null}
    </div>
  );
}

// ── Date chip ────────────────────────────────────────────────────────────────

interface DateChipProps {
  iso: string;
  selected: boolean;
  disabled?: boolean;
  onSelect: (iso: string) => void;
}

/** About 76 × 88. Month, a large day number, weekday. */
export function DateChip({ iso, selected, disabled, onSelect }: DateChipProps) {
  const d = dateParts(iso);
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={`${d.dow} ${d.month} ${d.day}${disabled ? ", unavailable" : ""}`}
      disabled={disabled}
      onClick={() => onSelect(iso)}
      className={clsx(
        "relative flex h-[88px] w-full min-w-0 flex-col items-center justify-center gap-0.5 overflow-hidden border transition-colors duration-300",
        selected ? "border-crimson bg-crimson text-ivory" : "border-line2 bg-ivory text-onyx hover:border-onyx",
        disabled && "pointer-events-none opacity-45",
      )}
    >
      <span className="font-caps text-[11px] uppercase tracking-[0.22em]">{d.month}</span>
      <span className="font-heavy text-[30px] leading-none">{d.day}</span>
      <span className="font-caps text-[11px] uppercase tracking-[0.22em]">{d.dow}</span>
      {disabled ? <span aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top_right,transparent_calc(50%-0.75px),currentColor_calc(50%-0.75px),currentColor_calc(50%+0.75px),transparent_calc(50%+0.75px))] opacity-60" /> : null}
    </button>
  );
}

export function DateRow({ children, label, showLegend }: { children: ReactNode; label: string; showLegend?: boolean }) {
  // Every date is visible at once and tappable: no hidden sideways swipe on phones.
  return (
    <>
    <div role="radiogroup" aria-label={label} className="grid grid-cols-[repeat(auto-fill,minmax(68px,1fr))] gap-2.5">
      {children}
    </div>
    {showLegend ? <p className="m-0 mt-4 text-[14px] text-muted">Crossed-out dates are fully booked or closed.</p> : null}
    </>
  );
}

// ── Time slot ────────────────────────────────────────────────────────────────

export function TimeSlot({ time, selected, disabled, onSelect }: { time: string; selected: boolean; disabled?: boolean; onSelect: (t: string) => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={() => onSelect(time)}
      className={clsx(
        "min-h-[52px] border px-4 text-[16px] font-bold tabular-nums transition-colors duration-300",
        selected ? "border-crimson bg-crimson text-ivory" : "border-line2 bg-ivory text-onyx hover:border-onyx",
        disabled && "pointer-events-none line-through opacity-35",
      )}
    >
      {formatTime(time)}
    </button>
  );
}

// ── Stepper ──────────────────────────────────────────────────────────────────

interface StepperProps {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}

export function Stepper({ label, hint, value, min, max, onChange }: StepperProps) {
  const id = useId();
  const btn = "grid size-12 place-items-center border border-line2 bg-ivory text-[24px] leading-none transition-colors duration-300 hover:border-onyx hover:bg-onyx hover:text-ivory disabled:pointer-events-none disabled:opacity-35";
  return (
    <div className="flex items-center justify-between gap-6 border-t border-line2 py-5 first:border-t-0 first:pt-0">
      <div className="flex flex-col">
        <span id={id} className="text-[18px] font-bold text-onyx">{label}</span>
        {hint ? <span className="text-[15px] text-muted">{hint}</span> : null}
      </div>
      <div role="group" aria-labelledby={id} className="flex items-center gap-1">
        <button type="button" aria-label={`Fewer: ${label}`} disabled={value <= min} onClick={() => onChange(value - 1)} className={btn}>
          −
        </button>
        <output aria-live="polite" className="grid h-12 w-12 place-items-center font-heavy text-[22px] tabular-nums">{value}</output>
        <button type="button" aria-label={`More: ${label}`} disabled={value >= max} onClick={() => onChange(value + 1)} className={btn}>
          +
        </button>
      </div>
    </div>
  );
}

// ── Session card ─────────────────────────────────────────────────────────────

interface SessionCardProps {
  title: string;
  price: ReactNode;
  priceNote: string;
  body: string;
  selected: boolean;
  onSelect: () => void;
  badge?: string;
  /** Phone sheet: a tighter card that shows its description only while selected. */
  compact?: boolean;
}

export function SessionCard({ title, price, priceNote, body, selected, onSelect, badge, compact }: SessionCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={clsx(
        "group relative flex min-h-[48px] w-full flex-col border text-left transition-colors duration-300",
        compact ? "gap-2.5 p-5" : "gap-4 p-6 sm:p-7",
        selected ? "border-onyx bg-ivory" : "border-line2 bg-ivory/60 hover:border-onyx",
      )}
    >
      <span aria-hidden className={clsx("absolute right-5 top-5 grid size-6 place-items-center rounded-full border transition-colors duration-300", selected ? "border-crimson bg-crimson" : "border-line2")}>
        <span className={clsx("size-2 rounded-full bg-ivory transition-opacity", selected ? "opacity-100" : "opacity-0")} />
      </span>
      {badge ? <span className="eyebrow !tracking-[0.3em] text-crimson">{badge}</span> : null}
      <span className="pr-8 text-[clamp(20px,2vw,24px)] font-extrabold leading-tight tracking-[-0.01em] text-onyx">{title}</span>
      <span className="flex flex-col">
        <span className={clsx("font-heavy leading-none text-onyx", compact ? "text-[30px]" : "text-[clamp(34px,3.6vw,46px)]")}>{price}</span>
        <span className="mt-1.5 text-[15px] text-muted">{priceNote}</span>
      </span>
      {compact && !selected ? null : <span className="text-[16px] leading-relaxed text-muted">{body}</span>}
    </button>
  );
}

// ── Ticket-style summary ─────────────────────────────────────────────────────

interface TicketProps {
  title: string;
  rows: [string, string][];
  quote: Quote;
}

export function Ticket({ title, rows, quote }: TicketProps) {
  return (
    <div className="border border-onyx bg-ivory">
      <div className="flex items-center justify-between gap-4 border-b border-dashed border-line2 px-6 py-5 sm:px-8">
        <p className="eyebrow m-0 text-crimson">Admit</p>
        <p className="m-0 text-right text-[18px] font-extrabold text-onyx">{title}</p>
      </div>
      <dl className="m-0 flex flex-col gap-3 px-6 py-6 sm:px-8">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-6 text-[16px]">
            <dt className="text-muted">{k}</dt>
            <dd className="m-0 text-right font-bold text-onyx">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="border-t border-dashed border-line2 px-6 py-6 sm:px-8">
        {quote.lines.map((l) => (
          <div key={l.label} className="flex justify-between gap-6 text-[16px] text-bark">
            <span>{l.label}</span>
            <span className="tabular-nums">{formatMoney(l.amount)}</span>
          </div>
        ))}
        {quote.savings > 0 && quote.savingsLabel ? (
          <div className="mt-2 flex justify-between gap-6 text-[15px] font-bold text-crimson">
            <span>{quote.savingsLabel}</span>
            <span className="tabular-nums">saves {formatMoney(quote.savings)}</span>
          </div>
        ) : null}
        <div className="mt-5 flex items-baseline justify-between gap-6 border-t border-onyx pt-5">
          <span className="eyebrow !tracking-[0.3em]">Total</span>
          <span className="font-heavy text-[clamp(34px,4vw,48px)] leading-none tabular-nums">{formatMoney(quote.total)}</span>
        </div>
      </div>
    </div>
  );
}

// ── Contact fields ───────────────────────────────────────────────────────────

export function Field({ label, error, ...props }: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="eyebrow !tracking-[0.28em] text-muted">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-e` : undefined}
        className={clsx("min-h-[52px] border bg-ivory px-4 text-[17px] text-onyx placeholder:text-muted/60", error ? "border-crimson" : "border-line2 focus:border-onyx")}
        {...props}
      />
      {error ? (
        <p id={`${id}-e`} className="m-0 text-[14px] font-bold text-crimson">
          {error}
        </p>
      ) : null}
    </div>
  );
}

// ── Sticky bar: choice, live total, continue ────────────────────────────────

interface BookingBarProps {
  visible: boolean;
  label: string;
  total: number | null;
  cta: string;
  disabled: boolean;
  busy?: boolean;
  onClick: () => void;
  onBack?: () => void;
  /** `sticky` pins to the bottom of its scroll container (the phone sheet). */
  placement?: "fixed" | "sticky";
}

export function BookingBar({ visible, label, total, cta, disabled, busy, onClick, onBack, placement = "fixed" }: BookingBarProps) {
  return (
    <div
      inert={!visible}
      className={clsx(
        "bottom-0 z-40 border-t border-line2 bg-soft/95 text-onyx backdrop-blur-md transition-transform duration-500 ease-out",
        placement === "fixed" ? "fixed inset-x-0" : "sticky mt-auto",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-4 px-5 pb-[max(14px,env(safe-area-inset-bottom))] pt-3.5 sm:px-10 lg:px-16">
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-caps text-[12px] uppercase tracking-[0.22em] text-muted">{label}</span>
          <span className="flex items-baseline gap-2">
            <span className="font-heavy text-[26px] leading-tight tabular-nums">{total === null ? "—" : formatMoney(total)}</span>
            {onBack ? (
              <button type="button" onClick={onBack} className="link-grow ml-3 min-h-12 px-1 text-[14px] text-muted hover:text-onyx">
                Back
              </button>
            ) : null}
          </span>
        </div>
        <Button magnetic={false} disabled={disabled || busy} onClick={onClick} className="min-w-[10.5rem] shrink-0 sm:min-w-[14rem]">
          {busy ? "One moment…" : cta}
        </Button>
      </div>
    </div>
  );
}


// ── Wizard progress (phone sheet) ───────────────────────────────────────────

/** "Step 2 of 4" with a segmented bar: shows where you are and how little is left. */
export function WizardProgress({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex flex-col gap-3" role="group" aria-label={`Step ${current + 1} of ${steps.length}: ${steps[current]}`}>
      <div className="flex items-baseline justify-between gap-4">
        <p className="eyebrow m-0 text-crimson">
          Step {current + 1} of {steps.length}
        </p>
        <p className="m-0 text-[14px] text-muted">{steps[current]}</p>
      </div>
      <div aria-hidden className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}>
        {steps.map((s, i) => (
          <span key={s} className="relative h-[3px] overflow-hidden rounded-full bg-line2">
            <span className={clsx("absolute inset-0 origin-left rounded-full bg-crimson transition-transform duration-700 ease-[var(--ease-lux)]", i <= current ? "scale-x-100" : "scale-x-0")} />
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Season calendar (phone sheet) ───────────────────────────────────────────

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

/**
 * The whole season as four compact weeks, Monday to Sunday, instead of
 * twenty-four large tiles. Fits one phone screen next to the time slots.
 */
export function SeasonCalendar({ dates, selected, isOpen, onSelect }: { dates: string[]; selected?: string; isOpen: (iso: string) => boolean; onSelect: (iso: string) => void }) {
  const first = dateParts(dates[0]);
  // Monday-first offset of the first date, so the weeks line up.
  const lead = (["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const).indexOf(first.dow as "Mon");
  const cells: (string | null)[] = [...Array(Math.max(lead, 0)).fill(null), ...dates];
  while (cells.length % 7) cells.push(null);
  return (
    <div role="radiogroup" aria-label="Studio dates" className="flex flex-col gap-2">
      <div aria-hidden className="grid grid-cols-7 gap-1.5 text-center font-caps text-[11px] tracking-[0.2em] text-muted">
        {WEEKDAYS.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((iso, i) => {
          if (!iso) return <span key={`e${i}`} aria-hidden />;
          const d = dateParts(iso);
          const showMonth = iso === dates[0] || d.day === "1";
          const on = selected === iso;
          const off = !isOpen(iso);
          return (
            <button
              key={iso}
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={`${d.dow} ${d.month} ${d.day}${off ? ", unavailable" : ""}`}
              disabled={off}
              onClick={() => onSelect(iso)}
              className={clsx(
                "relative grid h-[56px] w-full place-items-center border transition-colors duration-300",
                on ? "border-crimson bg-crimson text-ivory" : "border-line2 bg-ivory text-onyx active:border-onyx",
                off && "pointer-events-none line-through opacity-35",
              )}
            >
              {showMonth ? <span className="absolute left-0 right-0 top-1 text-center font-caps text-[9px] uppercase tracking-[0.18em] opacity-70">{d.month}</span> : null}
              <span className={clsx("font-heavy text-[19px] leading-none tabular-nums", showMonth && "mt-2.5")}>{d.day}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
