import type { Metadata } from "next";
import Link from "next/link";
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
      <main className="flex min-h-[65vh] flex-col items-center justify-center gap-6 px-5 py-20 text-center">
        <div
          aria-hidden
          className="flex size-[84px] items-center justify-center rounded-full bg-crimson text-[40px] text-cream animate-pop"
        >
          ✓
        </div>

        <div className="font-display text-[clamp(32px,5vw,48px)] italic leading-none text-crimson">
          You&apos;re booked!
        </div>

        <p className="max-w-[480px] text-[21px] text-muted">
          Your confirmation and receipt are on their way to your inbox. We can&apos;t wait to see you!
        </p>

        <div className="flex flex-col gap-1 rounded-2xl bg-velvet px-6 py-4 text-[17px] text-cream">
          <div className="font-display text-xl">{BRAND.name}</div>
          <div>{BRAND.address}</div>
          <div>Santa here {BRAND.santaHours} · walk-in anytime on your date</div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(BRAND.address)}`}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-[54px] items-center justify-center rounded-xl border border-ink bg-white px-6 text-base font-bold transition hover:-translate-y-0.5"
          >
            Get directions
          </a>
          <a
            href={BRAND.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-[54px] items-center justify-center rounded-xl border border-ink bg-white px-6 text-base font-bold transition hover:-translate-y-0.5"
          >
            Follow us on Instagram
          </a>
        </div>

        <Link href="/" className="mt-2 text-base text-crimson hover:underline">
          ← Back to home
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
