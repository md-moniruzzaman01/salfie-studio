"use client";

import { SANTA_PACKAGES } from "@/lib/content";
import { formatMoney, isEarlyBird } from "@/lib/pricing";
import { useNow } from "@/lib/use-now";

/** "From $X" for Santa — the early bird price only while it's on. */
export function SantaFromPrice() {
  const now = useNow();
  const one = SANTA_PACKAGES[0];
  const early = now !== null && isEarlyBird(now);
  return <>From {formatMoney(early && one.earlyBirdPrice ? one.earlyBirdPrice : one.price)}</>;
}

/** The early-bird note, rendered only while the offer is on. */
export function EarlyBirdNote({ className }: { className?: string }) {
  const now = useNow();
  if (now === null || !isEarlyBird(now)) return null;
  const one = SANTA_PACKAGES[0];
  return <span className={className}>Early bird {formatMoney(one.earlyBirdPrice ?? one.price)} when purchased Oct 15–31</span>;
}

/** Santa's three prices; the first cell shows the early bird only while it's actually on. */
export function SantaPriceStrip({ className }: { className?: string }) {
  const now = useNow();
  const early = now !== null && isEarlyBird(now);
  const [one, two, family] = SANTA_PACKAGES;

  const cells = [
    early
      ? { label: "Early bird", price: formatMoney(one.earlyBirdPrice ?? one.price), note: `until Oct 31 · reg. ${formatMoney(one.price)}` }
      : { label: "1 child", price: formatMoney(one.price), note: "1 sitting" },
    { label: "2 kids", price: formatMoney(two.price), note: "1 sitting" },
    { label: "Family", price: formatMoney(family.price), note: "up to 6 people" },
  ];

  return (
    <dl className={`m-0 grid grid-cols-3 border border-cream/25 ${className ?? ""}`}>
      {cells.map((c, i) => (
        <div key={c.label} className={`flex flex-col gap-1 px-3 py-3.5 sm:px-5 sm:py-4 ${i < cells.length - 1 ? "border-r border-cream/25" : ""}`}>
          <dt className="eyebrow !text-[10px] !tracking-[0.16em] text-gold sm:!text-[11px]">{c.label}</dt>
          <dd className="m-0 flex flex-col gap-0.5">
            <span className="font-display text-[22px] font-bold leading-none tabular-nums sm:text-[30px]">{c.price}</span>
            <span className="text-[11px] leading-snug text-parchment/85 sm:text-[13px]">{c.note}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
