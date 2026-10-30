import { Hero } from "@/components/hero";
import { MobileBookBar } from "@/components/mobile-book-bar";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { ClosingCta, ExperiencePanels, Faq, Gallery, HowItWorks, Marquee, Pricing, Reviews } from "@/components/sections";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { HOME_FAQ } from "@/lib/content";

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <SiteHeader />
      <main>
        <Hero />
        <ExperiencePanels />
        <Marquee />
        <Gallery />
        <HowItWorks />
        <Pricing />
        <Reviews />
        <Faq items={HOME_FAQ} title="Questions, answered" />
        <ClosingCta />
      </main>
      <SiteFooter />
      <MobileBookBar variant="both" />
    </>
  );
}
