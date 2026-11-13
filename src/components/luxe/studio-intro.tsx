import Link from "next/link";
import { Fragment } from "react";
import { Script, SectionHeading } from "@/components/luxe/home-sections";
import { PRICES } from "@/lib/booking";
import { VISIT } from "@/lib/copy";

const SERVICES = [
  {
    href: "/santa",
    title: "Photos with Santa",
    body: `Two 4×6 prints and every digital image for $${PRICES.santaPerChild} per child, on eight dates. No time slot: arrive any time from 11 AM to 7 PM on your date.`,
    cta: "Book Photos with Santa",
  },
  {
    href: "/portrait-studio",
    title: "Holiday Portrait Studio",
    body: `One hour in eight styled holiday sets, every day from November 27. Take your own photos with Selfie Studio Access, book a $${PRICES.professional} Professional Portrait Session, or bring your own photographer.`,
    cta: "Explore the Portrait Studio",
  },
  {
    href: "/photographers",
    title: "For professional photographers",
    body: "Approved photographers can rent the holiday sets for their own client sessions through our Photographer Partner Program.",
    cta: "Studio access for photographers",
  },
];

/**
 * A plain-language summary of who we are and where: the one place on the home
 * page that names every service and the location together. Server-rendered.
 */
export function StudioIntro() {
  return (
    <section aria-labelledby="about-studio" className="bg-ivory px-6 py-[clamp(80px,12vw,176px)] sm:px-10 lg:px-16">
      <div className="mx-auto grid w-full max-w-[1360px] gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <div className="flex flex-col gap-8">
          <div id="about-studio">
            <SectionHeading eyebrow="About the studio" lines={["A holiday photo studio", <Fragment key="s">in <Script>Bloomfield.</Script></Fragment>]} />
          </div>
          <p className="m-0 max-w-[46ch] text-[18px] leading-relaxed text-bark">
            The Selfie Studio Experience is a holiday photography studio at {VISIT.address}, in Essex County. For one season, November 27 to
            December 20, we open our doors for Christmas family photos, photos with Santa and holiday portraits for individuals, couples, families,
            friends and groups.
          </p>
        </div>

        <ul className="m-0 flex list-none flex-col p-0">
          {SERVICES.map((s) => (
            <li key={s.href} className="border-t border-line2 py-8 last:border-b">
              <h3 className="m-0 text-[clamp(22px,2.2vw,28px)] font-extrabold leading-tight tracking-[-0.01em]">{s.title}</h3>
              <p className="m-0 mt-3 max-w-[54ch] text-[17px] leading-relaxed text-muted">{s.body}</p>
              <Link href={s.href} className="link-grow mt-4 inline-block text-[16px] font-bold text-crimson">
                {s.cta}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
