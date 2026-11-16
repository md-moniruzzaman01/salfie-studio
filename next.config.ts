import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// Square checkout + Turnstile are the only third parties the browser talks to.
const apiOrigin = (() => {
  try {
    return process.env.NEXT_PUBLIC_API_BASE_URL ? new URL(process.env.NEXT_PUBLIC_API_BASE_URL).origin : "";
  } catch {
    return "";
  }
})();

const csp = [
  "default-src 'self'",
  // Next.js injects inline bootstrap scripts; Turnstile loads from Cloudflare.
  `script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com${isProd ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "font-src 'self' data:",
  `connect-src 'self' ${apiOrigin} https://challenges.cloudflare.com`.trim(),
  // Google Maps powers the "Plan your visit" map on the home page.
  "frame-src https://challenges.cloudflare.com https://www.google.com https://maps.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  cacheComponents: true,
  // AVIF first (smaller), WebP for browsers without it. Optimized files are cached for 30 days.
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75],
    minimumCacheTTL: 2_592_000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  async redirects() {
    return [{ source: "/studio", destination: "/portrait-studio", permanent: true }];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...(isProd ? [{ key: "Content-Security-Policy", value: csp }] : []),
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
        ],
      },
      // Token and members-only pages must never be stored by shared caches.
      { source: "/unsubscribe/:path*", headers: [{ key: "Cache-Control", value: "no-store" }] },
      { source: "/photographers/book", headers: [{ key: "Cache-Control", value: "no-store" }] },
      // Studio clips are large and rarely change: let browsers and CDNs keep them for a day, then refresh in the background.
      { source: "/videos/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }] },
    ];
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
