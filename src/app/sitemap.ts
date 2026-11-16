import type { MetadataRoute } from "next";
import type { StaticImageData } from "next/image";
import { abs } from "@/lib/seo";
import { IMAGES } from "@/lib/images";
import { SETS } from "@/lib/copy";
import bakeryKids from "@/assets/photos/three-generations-holiday-bakery-set-photo.jpg";
import blackGoldGroup from "@/assets/photos/friends-holiday-photo-black-gold-christmas-tree.jpg";
import cabinCrew from "@/assets/photos/large-family-christmas-photo-holiday-bakery-set.jpg";
import noirCouple from "@/assets/photos/couple-holiday-photo-shoot-black-gold-set.jpg";
import pinkFamily from "@/assets/photos/large-family-holiday-photo-pink-garland-staircase.jpg";

/** Built photo URLs keep their descriptive filenames, so the sitemap points Google at keyword-rich image URLs. */
const photo = (i: StaticImageData) => abs(i.src);
const setPhotos = SETS.flatMap((s) => (s.image ? [photo(s.image)] : []));

/**
 * Public, indexable pages only. Booking confirmations and the partner booking step are excluded.
 * `lastModified` is the date the page's content last really changed (YYYY-MM-DD). Update it when
 * you edit a page; leave it out when unknown rather than claiming a date.
 * `images` lists the photographs that actually appear on that page (social card first).
 */
const PAGES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; images?: string[]; lastModified?: string }[] = [
  {
    path: "/",
    priority: 1,
    changeFrequency: "weekly",
    images: [abs("/og-home.jpg"), photo(IMAGES.santaReading), photo(IMAGES.santaStair), photo(IMAGES.snowSofaTrio), photo(IMAGES.winterTree)],
    lastModified: "2026-11-16",
  },
  {
    path: "/santa",
    priority: 0.9,
    changeFrequency: "weekly",
    images: [abs("/og-santa.jpg"), photo(IMAGES.santaStair), photo(IMAGES.gingerbread)],
    lastModified: "2026-11-16",
  },
  {
    path: "/portrait-studio",
    priority: 0.9,
    changeFrequency: "weekly",
    images: [
      abs("/og-portrait-studio.jpg"),
      photo(IMAGES.snowSofaTrio),
      ...setPhotos,
      photo(bakeryKids),
      photo(pinkFamily),
      photo(blackGoldGroup),
      photo(noirCouple),
      photo(cabinCrew),
      photo(IMAGES.stairPinkFamily),
    ],
    lastModified: "2026-11-16",
  },
  {
    path: "/photographers",
    priority: 0.6,
    changeFrequency: "monthly",
    images: [abs("/og-photographers.jpg"), photo(IMAGES.door), photo(IMAGES.coupleSnow), photo(IMAGES.nutcrackerStair)],
    lastModified: "2026-11-16",
  },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly", lastModified: "2026-11-16" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((p) => ({
    url: abs(p.path),
    ...(p.lastModified ? { lastModified: p.lastModified } : {}),
    changeFrequency: p.changeFrequency,
    priority: p.priority,
    ...(p.images ? { images: [...new Set(p.images)] } : {}),
  }));
}
