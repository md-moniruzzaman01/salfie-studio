"use client";

import { clsx } from "clsx";
import type { DayAvailability } from "@/lib/types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const utc = (iso: string) => new Date(`${iso}T00:00:00Z`);
const isoOf = (d: Date) => d.toISOString().slice(0, 10);
const monthShort = (iso: string) => utc(iso).toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });

/** "Fri, Nov 27" for any ISO date. */
export function formatDayLabel(iso: string): string {
  return utc(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
}

interface Cell {
  iso: string;
  day: number;
  month: string;
  /** Show the month label on this cell (first shown day, and the 1st of a month). */
  showMonth: boolean;
  info?: DayAvailability;
}

/**
 * Month-style calendar for the studio, which is open every day rather than on
 * a short list of dates. Draws every day between the first and last date the
 * backend reports; days it doesn't list are greyed out and not selectable.
 */
export function StudioCalendar({
  days,
  selected,
  loading,
  onSelect,
}: {
  days: DayAvailability[] | null;
  selected?: string;
  loading: boolean;
  onSelect: (iso: string) => void;
}) {
  if (!days) {
    return (
      <p role="status" className="rounded-2xl bg-sand px-3.5 py-3 text-[17px]">
        Loading open days…
      </p>
    );
  }
  if (days.length === 0) {
    return <p className="rounded-2xl bg-sand px-3.5 py-3 text-[17px]">No days are open right now. Please check back soon.</p>;
  }

  const byDate = new Map(days.map((d) => [d.date, d]));
  const sorted = [...byDate.keys()].sort();
  const first = utc(sorted[0] as string);
  const last = utc(sorted[sorted.length - 1] as string);

  const cells: (Cell | null)[] = Array.from({ length: first.getUTCDay() }, () => null);
  let previousMonth = "";
  for (let t = first.getTime(); t <= last.getTime(); t += 86_400_000) {
    const d = new Date(t);
    const iso = isoOf(d);
    const month = monthShort(iso);
    cells.push({ iso, day: d.getUTCDate(), month, showMonth: month !== previousMonth, info: byDate.get(iso) });
    previousMonth = month;
  }

  return (
    <div aria-busy={loading}>
      <div className="mb-1.5 grid grid-cols-7 gap-1.5 text-center text-xs font-bold uppercase tracking-[0.1em] text-muted">
        {WEEKDAYS.map((w) => (
          <span key={w} aria-hidden>
            {w.slice(0, 3)}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((cell, i) => {
          if (!cell) return <span key={`blank-${i}`} aria-hidden />;
          const listed = !!cell.info;
          const full = listed && !cell.info?.available;
          const disabled = !listed || full || loading;
          const isSelected = selected === cell.iso;
          return (
            <button
              key={cell.iso}
              type="button"
              aria-pressed={isSelected}
              aria-label={`${formatDayLabel(cell.iso)}${full ? ", sold out" : !listed ? ", closed" : ""}`}
              disabled={disabled}
              onClick={() => onSelect(cell.iso)}
              className={clsx(
                "flex min-h-[58px] flex-col items-center justify-center rounded-xl border px-0.5 py-1 leading-none transition-colors",
                isSelected ? "border-crimson bg-crimson text-cream" : "border-line bg-white",
                disabled && "cursor-not-allowed opacity-40",
              )}
            >
              <span className={clsx("text-[11px] font-semibold uppercase tracking-[0.08em]", isSelected ? "text-cream/80" : "text-muted", !cell.showMonth && "invisible")}>
                {cell.month}
              </span>
              <span className="font-display text-[22px]">{cell.day}</span>
              <span className={clsx("text-[10px]", !full && "invisible")}>Full</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
