import Image from "next/image";
import Link from "next/link";
import { BookButton } from "@/components/booking/book-button";
import { IMAGES } from "@/lib/images";
import type { ExperienceId } from "@/lib/types";

const NAV = [
  { href: "/santa", label: "Photos with Santa" },
  { href: "/studio", label: "Portrait Studio" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

interface SiteHeaderProps {
  current?: "/santa" | "/studio";
  bookPreset?: ExperienceId;
  bookLabel?: string;
}

export function SiteHeader({ current, bookPreset, bookLabel = "Book now" }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/90 backdrop-blur-md">
      {/* Desktop + tablet row */}
      <div className="flex items-center justify-between gap-3 px-4 py-2 sm:gap-4 sm:px-[clamp(20px,4vw,64px)] sm:py-3">
        <Link href="/" aria-label="The Selfie Studio Experience home" className="block leading-none">
          <Image src={IMAGES.logo} alt="Selfie Studios Experience" height={54} className="h-9 w-auto mix-blend-multiply sm:h-[54px]" fetchPriority="high" />
        </Link>
        <nav aria-label="Main" className="hidden gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={current === item.href ? "page" : undefined}
              className={`eyebrow link-grow cursor-pointer ${current === item.href ? "text-crimson" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <BookButton
          preset={bookPreset}
          className="group inline-flex min-h-10 cursor-pointer items-center gap-2 bg-ink px-4 text-[11px] font-bold uppercase tracking-[0.14em] text-cream transition-colors hover:bg-crimson sm:min-h-12 sm:gap-2.5 sm:px-6 sm:text-[12px] sm:tracking-[0.16em]"
        >
          {bookLabel}
          <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </BookButton>
      </div>

      {/* Mobile-only secondary nav row — short labels so cells don't wrap */}
      <nav aria-label="Mobile navigation" className="flex items-center gap-0.5 border-t border-line/50 px-2 py-1 md:hidden">
        {[
          { href: "/santa", label: "Santa" },
          { href: "/studio", label: "Studio" },
          { href: "/#pricing", label: "Pricing" },
          { href: "/#faq", label: "FAQ" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={current === item.href ? "page" : undefined}
            className={`flex-1 cursor-pointer rounded-md px-2 py-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors ${
              current === item.href ? "bg-crimson/10 text-crimson" : "text-muted hover:text-ink"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
