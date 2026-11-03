import { clsx } from "clsx";
import { useId } from "react";

/**
 * The logo's signature: diagonal, rounded "pill" stripes in two reds, running
 * top-left to bottom-right. Used for transitions, the footer and accents,
 * never behind body text.
 */
export function StripeMask({ className, height = 56 }: { className?: string; height?: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg aria-hidden role="presentation" className={clsx("block w-full", className)} height={height} preserveAspectRatio="none">
      <defs>
        <pattern id={id} width="240" height="76" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect x="6" y="8" width="170" height="26" rx="13" fill="#ed1c24" />
          <rect x="66" y="42" width="168" height="26" rx="13" fill="#a50c14" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
