import { BRAND } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="bg-velvet px-5 pb-28 pt-[clamp(48px,7vw,72px)] text-cream md:pb-[clamp(48px,7vw,72px)]">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8">
        <div className="flex flex-col leading-[0.95]">
          <span className="font-display text-[clamp(34px,6vw,64px)] font-bold italic tracking-wide">The Selfie Studio</span>
          <span className="eyebrow mt-2 !tracking-[0.4em] text-gold">Experience</span>
          <span className="mt-3 font-display text-[clamp(20px,2.4vw,28px)] italic text-parchment">{BRAND.tagline}</span>
        </div>
        <span aria-hidden className="h-px w-full bg-cream/20" />
        <div className="grid gap-8 text-[15px] leading-relaxed sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="eyebrow mb-1.5 !text-xs text-gold">Visit</div>
            {BRAND.address}
            <br />
            <a href={`https://maps.google.com/?q=${encodeURIComponent(BRAND.address)}`} target="_blank" rel="noreferrer" className="link-grow">
              Get directions →
            </a>
          </div>
          <div>
            <div className="eyebrow mb-1.5 !text-xs text-gold">Season</div>
            {BRAND.season}
            <br />
            Santa {BRAND.santaHours}
          </div>
          <div>
            <div className="eyebrow mb-1.5 !text-xs text-gold">Contact</div>
            <a href={`tel:${BRAND.phone.replace(/-/g, "")}`} className="link-grow">
              {BRAND.phone}
            </a>
            <br />
            <a href={`mailto:${BRAND.email}`} className="link-grow">
              {BRAND.email}
            </a>
          </div>
          <div>
            <div className="eyebrow mb-1.5 !text-xs text-gold">Follow</div>
            <a href={BRAND.instagramUrl} target="_blank" rel="noreferrer" className="link-grow">
              {BRAND.instagram}
            </a>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-3 border-t border-cream/15 pt-4 text-[15px] text-parchment">
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
