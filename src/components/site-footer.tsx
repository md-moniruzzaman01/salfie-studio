import Image from "next/image";
import Link from "next/link";
import { StripeMask } from "@/components/luxe/stripe";
import { BRAND } from "@/lib/content";
import { IMAGES } from "@/lib/images";

const LINKS = [
  { href: "/santa", label: "Photos with Santa" },
  { href: "/portrait-studio", label: "Portrait Studio" },
  { href: "/#visit", label: "Plan your visit" },
  { href: "/photographers", label: "For photographers" },
];

export function SiteFooter() {
  return (
    <footer className="bg-sand text-onyx">
      <StripeMask height={72} />
      <div className="mx-auto grid max-w-[1360px] gap-14 px-6 pb-14 pt-[clamp(56px,8vw,104px)] sm:px-10 lg:grid-cols-[1.1fr_1fr_1fr_1fr] lg:gap-10 lg:px-16">
        <div className="flex flex-col gap-6">
          <Image src={IMAGES.logoHoliday} alt="The Selfie Studio Experience, Holiday Edition" sizes="280px" className="h-auto w-[min(280px,72vw)] border border-line2" />
          <p className="m-0 max-w-[30ch] text-[16px] leading-relaxed text-muted">{BRAND.tagline}</p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="eyebrow m-0 text-crimson">Visit</h2>
          <address className="not-italic text-[16px] leading-relaxed text-bark">
            77–79 Washington Street
            <br />
            Bloomfield, NJ 07003
          </address>
          <p className="m-0 text-[16px] text-bark">
            {BRAND.season}
            <br />
            Santa {BRAND.santaHours}
          </p>
          <a href={`https://maps.google.com/?q=${encodeURIComponent("77-79 Washington St, Bloomfield, NJ 07003")}`} target="_blank" rel="noreferrer" className="link-grow w-fit text-[16px]">
            Get directions
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="eyebrow m-0 text-crimson">Contact</h2>
          <a href={`tel:${BRAND.phone.replace(/-/g, "")}`} className="link-grow w-fit text-[16px] text-bark">
            {BRAND.phone}
          </a>
          <a href={`mailto:${BRAND.email}`} className="link-grow w-fit break-all text-[16px] text-bark">
            {BRAND.email}
          </a>
          <a href={BRAND.instagramUrl} target="_blank" rel="noreferrer" className="link-grow w-fit text-[16px] text-bark">
            {BRAND.instagram}
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="eyebrow m-0 text-crimson">Explore</h2>
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-grow inline-block py-1 text-[16px] text-bark">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line2">
        <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-x-8 gap-y-4 px-6 py-6 text-[14px] text-muted sm:px-10 lg:px-16">
          <span>© 2026 {BRAND.name}</span>
          <span className="inline-flex items-center gap-2.5 border border-line2 bg-ivory px-3 py-1.5 text-bark">
            <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <rect x="9.5" y="9.5" width="5" height="5" rx="0.5" />
            </svg>
            Payments secured by Square
          </span>
          <span className="flex gap-5">
            <Link href="/terms" className="link-grow">
              Terms
            </Link>
            <Link href="/privacy" className="link-grow">
              Privacy
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
