"use client";

import { daysLeftInEarlyBird, isEarlyBird } from "@/lib/pricing";
import { useNow } from "@/lib/use-now";

/** "Ends in N days" for the early bird. Renders nothing until the browser knows the time. */
export function EarlyBirdCountdown({ className }: { className?: string }) {
  const now = useNow();
  if (now === null) return null;
  if (!isEarlyBird(now)) return <span className={className}>Early bird has ended</span>;
  const days = daysLeftInEarlyBird(now);
  return <span className={className}>Ends in {days} {days === 1 ? "day" : "days"}</span>;
}
