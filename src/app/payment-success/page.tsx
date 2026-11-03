import type { Metadata } from "next";
import Link from "next/link";
import { BookedCelebration } from "@/components/booked-celebration";
import { BRAND } from "@/lib/content";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "You're booked!",
  robots: { index: false },
};

/**
 * Square redirects here after a successful payment:
 *   ?booking=<id>&kind=holiday
 *
 * The booking ID is in the URL but we don't need to fetch it — the customer's
 * confirmation email (sent by the backend webhook) has all the details.
 */
export default function PaymentSuccessPage() {
  return (
    <>
      <SiteHeader />
      <main className="overflow-hidden bg-cream px-5 py-[clamp(56px,9vw,110px)]">
        <div className="mx-auto grid max-w-[1100px] items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <BookedCelebration />

          <div className="flex flex-col items-start gap-6 text-left">
            <span className="eyebrow text-crimson">Payment received</span>
            <h1 className="m-0 font-display text-[clamp(40px,6vw,72px)] font-bold leading-[1.02] text-ink">
              See you on <em className="italic text-crimson">set.</em>
            </h1>
            <p className="m-0 max-w-[44ch] font-body text-[clamp(20px,2vw,24px)] leading-snug text-bark">
              Your confirmation and receipt are on their way to your inbox. We can&apos;t wait to see you!
            </p>

            <dl className="m-0 grid w-full gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
              <div className="flex flex-col gap-1 bg-white p-5">
                <dt className="eyebrow text-crimson">Where</dt>
                <dd className="m-0 text-[16px] text-ink">{BRAND.address}</dd>
              </div>
              <div className="flex flex-col gap-1 bg-white p-5">
                <dt className="eyebrow text-crimson">Santa hours</dt>
                <dd className="m-0 text-[16px] text-ink">{BRAND.santaHours} · walk in any time on your date</dd>
              </div>
            </dl>

            <div className="flex flex-wrap gap-3">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(BRAND.address)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[54px] items-center justify-center bg-crimson px-7 text-[13px] font-bold uppercase tracking-[0.14em] text-cream transition-colors hover:bg-signal"
              >
                Get directions
              </a>
              <a
                href={BRAND.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[54px] items-center justify-center border border-crimson px-7 text-[13px] font-bold uppercase tracking-[0.14em] text-crimson transition-colors hover:bg-crimson hover:text-cream"
              >
                Follow on Instagram
              </a>
            </div>

            <Link href="/" className="link-grow text-[15px] text-crimson">
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
