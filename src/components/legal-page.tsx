import Link from "next/link";
import type { ReactNode } from "react";
import { StripeMask } from "@/components/luxe/stripe";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BRAND } from "@/lib/content";

export interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

/** Shared layout for the Terms and Privacy pages: one readable column with a table of contents. */
export function LegalPage({ eyebrow, title, updated, intro, sections }: { eyebrow: string; title: string; updated: string; intro: ReactNode; sections: LegalSection[] }) {
  return (
    <>
      <SiteHeader />
      <main className="bg-soft">
        <StripeMask height={14} />
        <article className="mx-auto max-w-[820px] px-6 py-[clamp(56px,9vw,120px)] sm:px-10">
          <p className="eyebrow m-0 text-crimson">{eyebrow}</p>
          <h1 className="m-0 mt-4 font-heavy text-[clamp(36px,6vw,72px)] uppercase leading-[0.98] tracking-[-0.015em]">{title}</h1>
          <p className="m-0 mt-4 text-[15px] text-muted">Last updated {updated}</p>
          <div className="mt-8 text-[18px] leading-relaxed text-bark [&_p]:m-0">{intro}</div>

          <nav aria-label="On this page" className="mt-10 border-y border-line2 py-6">
            <h2 className="eyebrow m-0 !tracking-[0.3em] text-muted">On this page</h2>
            <ol className="m-0 mt-4 grid list-decimal gap-x-10 gap-y-2 pl-5 text-[16px] sm:grid-cols-2">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="link-grow text-bark">
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {sections.map((s, i) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-24 border-b border-line2 py-10">
              <h2 id={`${s.id}-h`} className="m-0 text-[clamp(22px,2.4vw,28px)] font-extrabold leading-tight tracking-[-0.01em]">
                {i + 1}. {s.title}
              </h2>
              <div className="mt-4 flex flex-col gap-4 text-[17px] leading-relaxed text-bark [&_a]:font-semibold [&_a]:text-crimson [&_a]:underline [&_a]:underline-offset-4 [&_li]:mt-2 [&_p]:m-0 [&_ul]:m-0 [&_ul]:list-disc [&_ul]:pl-6">
                {s.body}
              </div>
            </section>
          ))}

          <p className="m-0 mt-10 text-[16px] text-muted">
            Questions? Email <a href={`mailto:${BRAND.email}`} className="font-semibold text-crimson underline underline-offset-4">{BRAND.email}</a> or call{" "}
            <a href={`tel:${BRAND.phone.replace(/-/g, "")}`} className="font-semibold text-crimson underline underline-offset-4">{BRAND.phone}</a>.{" "}
            <Link href="/" className="link-grow text-crimson">
              Back to home
            </Link>
          </p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
