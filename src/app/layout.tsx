import type { Metadata, Viewport } from "next";
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/400-italic.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/700.css";
import "@fontsource/cormorant-garamond/600-italic.css";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "./globals.css";
import { BookingProvider } from "@/components/booking/booking-provider";

export const metadata: Metadata = {
  title: {
    default: "The Holiday Experience · The Selfie Studio Experience",
    template: "%s · The Selfie Studio Experience",
  },
  description:
    "Photos with Santa and eight holiday portrait backdrops in Bloomfield, NJ. Nov 27 – Dec 20. Book in under a minute.",
  metadataBase: new URL("https://theselfiestudioexperience.com"),
  openGraph: {
    title: "The Holiday Experience",
    description: "Photos with Santa and 8 holiday backdrops in Bloomfield, NJ. Bigger. Better. More magical.",
    type: "website",
    url: "/",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "The Selfie Studio Experience — Photos with Santa and 8 holiday backdrops" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Holiday Experience",
    description: "Photos with Santa and 8 holiday backdrops in Bloomfield, NJ.",
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#B23D6E",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="min-h-screen overflow-x-clip">
        <BookingProvider>{children}</BookingProvider>
      </body>
    </html>
  );
}
