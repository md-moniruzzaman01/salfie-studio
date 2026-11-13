import type { Metadata } from "next";
import { StripeMask } from "@/components/luxe/stripe";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { UnsubscribePanel } from "@/components/unsubscribe-panel";

// Every token is different and the page is never linked from the site, so it
// needs no instant-navigation shell (the shared layout reads the URL).
export const instant = false;

export const metadata: Metadata = {
  title: "Email preferences",
  // Personal, token-based page: keep it out of search engines and don't leak
  // the token to other sites through the Referer header.
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

/**
 * Campaign emails link here: /unsubscribe/<signed token>. Opening the page
 * only shows the current state (mail scanners pre-fetch links, so a visit must
 * never unsubscribe anyone); the guest confirms with a button.
 */
export default async function UnsubscribePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return (
    <>
      <SiteHeader />
      <main className="bg-soft">
        <StripeMask height={14} />
        <div className="mx-auto flex max-w-[860px] flex-col items-start gap-8 px-6 py-[clamp(72px,12vw,160px)] sm:px-10">
          <UnsubscribePanel token={token} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
