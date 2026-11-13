import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/luxe/button";
import { StripeMask } from "@/components/luxe/stripe";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

const LINKS = [
  { href: "/santa", label: "Photos with Santa" },
  { href: "/portrait-studio", label: "Holiday Portrait Studio" },
  { href: "/photographers", label: "Studio access for photographers" },
  { href: "/#visit", label: "Plan your visit" },
];

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="bg-soft">
        <StripeMask height={14} />
        <div className="mx-auto flex max-w-[860px] flex-col items-start gap-8 px-6 py-[clamp(72px,12vw,160px)] sm:px-10">
          <p className="eyebrow m-0 text-crimson">404</p>
          <h1 className="m-0 font-heavy text-[clamp(36px,7vw,80px)] uppercase leading-[0.98] tracking-[-0.015em]">This page is not on set.</h1>
          <p className="m-0 max-w-[44ch] text-[clamp(18px,1.8vw,22px)] leading-relaxed text-bark">
            The page may have moved. Here is where to find our holiday experiences in Bloomfield, NJ.
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button href="/santa#book">Book Photos with Santa</Button>
            <Button href="/portrait-studio#book" variant="outline">
              Book the Portrait Studio
            </Button>
          </div>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-grow text-[18px] text-crimson">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
