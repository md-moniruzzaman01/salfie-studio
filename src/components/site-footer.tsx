import Image from "next/image";
import { IMAGES } from "@/lib/images";
import { BRAND } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="bg-sand pb-28 text-ink md:pb-[clamp(48px,7vw,72px)]">
      <div aria-hidden className="stripe-rule" />
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-5 pt-[clamp(40px,6vw,64px)]">
        <Image src={IMAGES.logoHoliday} alt="The Selfie Studio Experience, Holiday Edition" sizes="320px" className="h-auto w-[min(320px,70vw)] border border-line2" />
        <div className="flex flex-col leading-[0.95]">
          <span className="font-display text-[clamp(20px,2.4vw,28px)] italic text-bark">{BRAND.tagline}</span>
        </div>
        <span aria-hidden className="h-px w-full bg-line2" />
        <div className="grid gap-8 text-[15px] leading-relaxed sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="eyebrow mb-1.5 !text-xs text-crimson">Visit</div>
            {BRAND.address}
            <br />
            <a href={`https://maps.google.com/?q=${encodeURIComponent(BRAND.address)}`} target="_blank" rel="noreferrer" className="link-grow">
              Get directions →
            </a>
          </div>
          <div>
            <div className="eyebrow mb-1.5 !text-xs text-crimson">Season</div>
            {BRAND.season}
            <br />
            Santa {BRAND.santaHours}
          </div>
          <div>
            <div className="eyebrow mb-1.5 !text-xs text-crimson">Contact</div>
            <a href={`tel:${BRAND.phone.replace(/-/g, "")}`} className="link-grow">
              {BRAND.phone}
            </a>
            <br />
            <a href={`mailto:${BRAND.email}`} className="link-grow">
              {BRAND.email}
            </a>
          </div>
          <div>
            <div className="eyebrow mb-1.5 !text-xs text-crimson">Follow</div>
            <a href={BRAND.instagramUrl} target="_blank" rel="noreferrer" className="link-grow">
              {BRAND.instagram}
            </a>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-3 border-t border-line2 pt-4 text-[15px] text-muted">
          <span>© {BRAND.name}. All rights reserved.</span>
          <span>
            <a href="/terms" className="link-grow">
              Terms
            </a>{" "}
            ·{" "}
            <a href="/privacy" className="link-grow">
              Privacy
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
