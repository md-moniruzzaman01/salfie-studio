"use client";

import { useSelfiePrice } from "@/lib/use-selfie-pricing";

/**
 * Selfie Studio Access per-person price right now, as the backend will charge
 * it: the early-bird price through its last day, the regular price after.
 * Hidden until the price is known, so it never flashes the wrong number.
 */
export function StudioPrice() {
  const { ready, unit } = useSelfiePrice();
  return <span className={ready ? undefined : "opacity-0"}>${unit.toFixed(2)}</span>;
}

export function StudioPriceNote() {
  const { ready, early, endLabel } = useSelfiePrice();
  return <span className={ready ? undefined : "opacity-0"}>{early ? `per person · through ${endLabel}` : "per person"}</span>;
}
