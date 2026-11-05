"use client";

import { useEffect, useState } from "react";
import { getSelfiePricing, type SelfiePricing } from "./api";
import { PRICES, dateParts, isEarlyBirdAt, selfieUnitPrice } from "./booking";
import { useNow } from "./use-now";

export interface SelfiePrice {
  /** False until we know which price applies, so UI never flashes the wrong number. */
  ready: boolean;
  /** The early-bird price is in force right now. */
  early: boolean;
  /** Per-person price in dollars right now. */
  unit: number;
  /** List price in dollars (what it costs once early bird ends). */
  regular: number;
  /** Last early-bird day, e.g. "Nov 26". */
  endLabel: string;
}

const FALLBACK_END = "2026-11-26";

const label = (iso: string) => {
  const p = dateParts(iso);
  return `${p.month} ${p.day}`;
};

/**
 * Selfie Studio Access price. The backend decides early bird vs regular (by
 * purchase date in the event's timezone) and is what checkout charges, so we
 * show its answer. If it can't be reached (demo mode, offline) we fall back to
 * the local constants and the browser clock.
 */
export function useSelfiePrice(): SelfiePrice {
  const now = useNow();
  const [server, setServer] = useState<SelfiePricing | null>(null);

  useEffect(() => {
    let live = true;
    void getSelfiePricing().then((p) => live && setServer(p));
    return () => {
      live = false;
    };
  }, []);

  if (server) {
    return {
      ready: true,
      early: server.unitCents < server.regularCents,
      unit: server.unitCents / 100,
      regular: server.regularCents / 100,
      endLabel: label(server.earlyBirdEndDate ?? FALLBACK_END),
    };
  }

  const early = isEarlyBirdAt(now);
  return {
    ready: now !== null,
    early,
    unit: selfieUnitPrice(early),
    regular: PRICES.selfieRegular,
    endLabel: label(FALLBACK_END),
  };
}
