import { BookButton } from "@/components/booking/book-button";
import type { ExperienceId } from "@/lib/types";

interface MobileBookBarProps {
  /** Two buttons on the landing page, one priced button on experience pages. */
  variant: "both" | "single";
  preset?: ExperienceId;
  price?: string;
  note?: string;
  label?: string;
}

/** Sticky bar at the bottom of the screen on phones, inside thumb reach. */
export function MobileBookBar({ variant, preset, price, note, label = "Book now" }: MobileBookBarProps) {
  return (
    <div className="sticky bottom-0 z-40 flex items-center justify-between gap-3 border-t border-line bg-cream px-3 py-2.5 shadow-[0_-8px_24px_rgba(74,10,18,0.12)] md:hidden">
      {variant === "both" ? (
        <>
          <BookButton preset="santa" className="min-h-[52px] flex-1 bg-crimson text-base font-bold text-cream">
            Book Santa
          </BookButton>
          <BookButton preset="selfie" className="min-h-[52px] flex-1 bg-ink text-base font-bold text-cream">
            Book Studio
          </BookButton>
        </>
      ) : (
        <>
          <div className="pl-1.5 leading-tight">
            <div className="font-display text-[22px] font-bold">{price}</div>
            <div className="text-[15px] text-muted">{note}</div>
          </div>
          <BookButton preset={preset} className="min-h-[52px] bg-crimson px-6 text-[17px] font-bold text-cream">
            {label}
          </BookButton>
        </>
      )}
    </div>
  );
}
