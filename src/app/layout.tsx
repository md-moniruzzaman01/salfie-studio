import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@fontsource/archivo-black/400.css";
import "@fontsource/yellowtail/400.css";
import "@fontsource-variable/josefin-sans/wght.css";
import "@fontsource-variable/manrope/wght.css";
import "./globals.css";
import { BookingModalProvider } from "@/components/luxe/booking-modal";
import { SiteProviders } from "@/components/luxe/providers";

export const metadata: Metadata = {
  title: {
    default: "The Holiday Experience · The Selfie Studio Experience",
    template: "%s · The Selfie Studio Experience",
  },
  description: "Photos with Santa and eight styled holiday sets in Bloomfield, NJ. Two experiences, one magical season, November 27 to December 20.",
  metadataBase: new URL("https://theselfiestudioexperience.com"),
  openGraph: {
    title: "The Holiday Experience",
    description: "Two experiences. One magical season. Photos with Santa and eight holiday sets in Bloomfield, NJ.",
    type: "website",
    url: "/",
    siteName: "The Selfie Studio Experience",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "The Selfie Studio Experience, Holiday Edition" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Holiday Experience",
    description: "Photos with Santa and eight holiday sets in Bloomfield, NJ.",
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen overflow-x-clip">
        {/* Runs before first paint: skip the intro for repeat visits and reduced motion. */}
        <Script id="intro-flag" strategy="beforeInteractive">
          {`try{var d=document.documentElement;d.classList.add('js');if(sessionStorage.getItem('sse-intro-seen')==='1'||matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('no-intro')}}catch(e){document.documentElement.classList.add('no-intro')}`}
        </Script>
        <SiteProviders>
          <BookingModalProvider>
            {children}
          </BookingModalProvider>
        </SiteProviders>
      </body>
    </html>
  );
}
