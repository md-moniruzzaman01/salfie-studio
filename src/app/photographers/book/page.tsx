import type { Metadata } from "next";
import Link from "next/link";
import { PhotographerBookingGate } from "@/components/photographers/photographer-booking-gate";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PHOTOGRAPHER_BOOKING_START, PHOTOGRAPHER_HOURS, PHOTOGRAPHER_TERMS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Book Your Studio Session · Approved Photographers",
  description: "Approved professional photographers can book a 60-minute holiday studio session at $75 per hour.",
  // A members-only booking step — keep it out of search results.
  robots: { index: false, follow: true },
};

export default function PhotographerBookPage() {
  return (
    <>
      <SiteHeader current="/photographers" />
      <main className="bg-cream">
        <section className="bg-velvet px-5 pb-12 pt-10 text-cream sm:px-10 lg:px-16">
          <div className="mx-auto max-w-[1180px]">
            <Link href="/photographers" className="text-[14px] font-medium text-parchment/80 underline-offset-4 hover:text-cream hover:underline">
              Professional Photographer Studio Access
            </Link>
            <h1 className="m-0 mt-3 font-display text-[clamp(34px,4.6vw,54px)] font-bold leading-[1.08]">Book Your Session</h1>
            <p className="m-0 mt-3 max-w-[56ch] font-body text-[21px] leading-snug text-parchment">
              For approved partner photographers. $75 per hour, 60-minute studio session.
            </p>
          </div>
        </section>

        <section className="px-4 py-[clamp(40px,7vw,88px)] sm:px-10 lg:px-16">
          <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-start gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-14">
            <aside className="order-2 flex flex-col gap-8 lg:sticky lg:top-28 lg:order-1">
              <div>
                <h2 className="m-0 font-display text-[24px] text-ink">Studio hours</h2>
                <p className="m-0 mt-1 text-[14px] text-muted">{PHOTOGRAPHER_BOOKING_START}</p>
                <dl className="m-0 mt-4 divide-y divide-line border-y border-line">
                  {PHOTOGRAPHER_HOURS.map((row) => (
                    <div key={row.day} className="flex flex-col gap-0.5 py-3.5 text-[14px] sm:flex-row sm:items-start sm:justify-between sm:gap-5">
                      <dt className="font-medium text-bark">{row.day}</dt>
                      <dd className="m-0 tabular-nums text-muted sm:text-right">
                        {row.hours}
                        {row.sub ? <span className="block">{row.sub}</span> : null}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="m-0 mt-3 text-[13px] leading-relaxed text-muted">Maximum two photographers per hour. Setup and breakdown happen within your session.</p>
              </div>
              <div>
                <h2 className="m-0 font-display text-[24px] text-ink">Please note</h2>
                <ul className="m-0 mt-4 flex list-none flex-col gap-3 p-0">
                  {PHOTOGRAPHER_TERMS.map((term) => (
                    <li key={term} className="relative pl-5 text-[14px] leading-relaxed text-bark">
                      <span aria-hidden className="absolute left-0 top-[0.6em] size-1.5 rounded-full bg-crimson" />
                      {term}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* On phones the booking form comes first; hours and rules follow. */}
            <div className="order-1 lg:order-2">
              <PhotographerBookingGate />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
