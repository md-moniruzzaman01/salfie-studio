import { Button } from "@/components/luxe/button";
import { SectionHeading, Script } from "@/components/luxe/home-sections";
import { Fade } from "@/components/luxe/motion";
import { StudioPrice } from "@/components/luxe/studio-price";

const SERIF = { fontFamily: '"Playfair Display", Georgia, serif' } as const;

const STEPS = [
  { title: "Book your hour", body: "Pick a session, a date and a start time between 11 AM and 7 PM. You pay at a secure checkout and your confirmation arrives by email." },
  { title: "Step into the sets", body: "Arrive at your start time. For one full hour, all eight holiday sets are yours." },
  { title: "Take it home", body: "Shoot on your own phone, or leave with edited digital photos from our photographer." },
];

/** Three-step overview between the gallery and the booking form: the one place this page explains the visit. */
export function StudioHow() {
  return (
    <section aria-label="How it works" className="bg-sand px-6 py-[clamp(72px,10vw,144px)] sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
        <div className="flex flex-col items-start gap-8 lg:sticky lg:top-28 lg:self-start">
          <SectionHeading eyebrow="How it works" lines={["Your hour,", <Script key="s">start to finish.</Script>]} />
          <p className="m-0 max-w-[36ch] text-[17px] leading-relaxed text-muted">Three ways to book, one simple visit. Selfie Studio Access starts at <StudioPrice /> per person.</p>
          <div className="hidden md:block">
            <Button href="#book" modal="studio">Book a session</Button>
          </div>
        </div>

        <ol className="m-0 flex list-none flex-col p-0">
          {STEPS.map((s, i) => (
            <li key={s.title} className="border-t border-line2 last:border-b">
              <Fade delay={i * 0.08} y={20}>
                <div className="grid grid-cols-[3.5rem_1fr] items-baseline gap-4 py-8 sm:grid-cols-[5.5rem_1fr] sm:gap-8 sm:py-10">
                  <span aria-hidden className="text-[clamp(44px,6vw,76px)] font-bold italic leading-none text-crimson" style={SERIF}>
                    {i + 1}
                  </span>
                  <div className="flex flex-col gap-3">
                    <h3 className="m-0 text-[clamp(22px,2.4vw,30px)] font-bold leading-tight tracking-[-0.01em] text-onyx">{s.title}</h3>
                    <p className="m-0 max-w-[48ch] text-[17px] leading-relaxed text-bark">{s.body}</p>
                  </div>
                </div>
              </Fade>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
