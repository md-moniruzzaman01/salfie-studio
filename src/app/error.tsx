"use client";

import { Button } from "@/components/luxe/button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BRAND } from "@/lib/content";

/** Shown when a page fails to render. The header and footer stay, so visitors can still navigate or call us. */
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <>
      <SiteHeader />
      <main id="main" className="bg-soft">
        <div className="mx-auto flex max-w-[860px] flex-col items-start gap-8 px-6 py-[clamp(72px,12vw,160px)] sm:px-10">
          <p className="eyebrow m-0 text-crimson">Something went wrong</p>
          <h1 className="m-0 font-heavy text-[clamp(36px,7vw,80px)] uppercase leading-[0.98] tracking-[-0.015em]">We hit a snag on set.</h1>
          <p className="m-0 max-w-[44ch] text-[clamp(18px,1.8vw,22px)] leading-relaxed text-bark">
            This page did not load as expected. Please try again, or reach us at{" "}
            <a href={`tel:${BRAND.phone.replace(/-/g, "")}`} className="font-bold text-crimson underline underline-offset-4">
              {BRAND.phone}
            </a>{" "}
            or{" "}
            <a href={`mailto:${BRAND.email}`} className="font-bold text-crimson underline underline-offset-4">
              {BRAND.email}
            </a>
            .
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-[56px] items-center justify-center bg-crimson px-8 text-[13px] font-bold uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-onyx"
            >
              Try again
            </button>
            <Button href="/" variant="outline">
              Back to home
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
