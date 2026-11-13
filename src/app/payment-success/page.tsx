import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/luxe/button";
import { StripeMask } from "@/components/luxe/stripe";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BRAND } from "@/lib/content";

export const metadata: Metadata = {
  title: "You're booked",
  robots: { index: false },
};

/**
 * Square redirects here after a successful payment. The confirmation email
 * (sent by the backend webhook) carries the booking details.
 */
export default function PaymentSuccessPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-soft">
        <StripeMask height={14} />
        <div className="mx-auto flex max-w-[860px] flex-col items-start gap-8 px-6 py-[clamp(72px,12vw,160px)] sm:px-10">
          <p className="eyebrow m-0 text-crimson">Payment received</p>
          <h1 className="m-0 font-heavy text-[clamp(40px,9vw,104px)] uppercase leading-[0.95] tracking-[-0.015em]">
            See you
            <br />
            <span className="font-script text-[1.1em] normal-case leading-[0.95] tracking-normal text-evergreen">on set.</span>
          </h1>
          <p className="m-0 max-w-[44ch] text-[clamp(18px,1.8vw,22px)] leading-relaxed text-bark">
            Your confirmation and receipt are on their way to your inbox. We cannot wait to see you.
          </p>

          <dl className="m-0 grid w-full border-y border-line2 sm:grid-cols-2">
            <div className="flex flex-col gap-1 py-6 sm:pr-8">
              <dt className="eyebrow !tracking-[0.3em] text-crimson">Where</dt>
              <dd className="m-0 text-[17px]">{BRAND.address}</dd>
            </div>
            <div className="flex flex-col gap-1 border-t border-line2 py-6 sm:border-l sm:border-t-0 sm:pl-8">
              <dt className="eyebrow !tracking-[0.3em] text-crimson">Your visit</dt>
              <dd className="m-0 text-[17px]">Your date and time are in your confirmation email.</dd>
            </div>
          </dl>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href={`https://maps.google.com/?q=${encodeURIComponent("77-79 Washington St, Bloomfield, NJ 07003")}`}>Get directions</Button>
            <Button href={BRAND.instagramUrl} variant="outline">
              Follow on Instagram
            </Button>
          </div>
          <Link href="/" className="link-grow text-[16px] text-crimson">
            Back to home
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
