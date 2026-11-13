import type { MetadataRoute } from "next";
import { abs } from "@/lib/seo";

/**
 * Public, indexable pages only. Booking confirmations and the partner booking step are excluded.
 * `lastModified` is the date the page's content last really changed (YYYY-MM-DD). Update it when
 * you edit a page; leave it out when unknown rather than claiming a date.
 */
const PAGES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; image?: string; lastModified?: string }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly", image: "/og-home.jpg", lastModified: "2026-11-13" },
  { path: "/santa", priority: 0.9, changeFrequency: "weekly", image: "/og-santa.jpg", lastModified: "2026-11-13" },
  { path: "/portrait-studio", priority: 0.9, changeFrequency: "weekly", image: "/og-portrait-studio.jpg", lastModified: "2026-11-13" },
  { path: "/photographers", priority: 0.6, changeFrequency: "monthly", image: "/og-photographers.jpg" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly", lastModified: "2026-11-13" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((p) => ({
    url: abs(p.path),
    ...(p.lastModified ? { lastModified: p.lastModified } : {}),
    changeFrequency: p.changeFrequency,
    priority: p.priority,
    ...(p.image ? { images: [abs(p.image)] } : {}),
  }));
}
