import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /payment-success and /photographers/book are kept out of results with a
        // `noindex` meta tag instead of a Disallow: a blocked page can't be crawled,
        // so Google would never see its noindex and could still list the bare URL.
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
