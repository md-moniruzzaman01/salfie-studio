// Photo filenames are descriptive on purpose: the name appears in the optimized
// image URL that search engines index. Keep new photos in the same style.
import carousel from "@/assets/photos/holiday-selfie-studio-snow-sofa-set-bloomfield-nj.jpg";
import colorfulBackdropPortrait from "@/assets/photos/holiday-portrait-nutcracker-red-velvet-staircase-set.jpg";
import door from "@/assets/photos/holiday-photo-studio-white-winter-floral-arch-bloomfield-nj.jpg";
import familyStudioPortrait from "@/assets/photos/holiday-family-photos-bakery-set-new-jersey.jpg";
import stairPinkFamily from "@/assets/photos/family-holiday-portrait-garland-staircase.jpg";
import heroBokehAmber from "@/assets/hero-bokeh-amber.jpg";
import heroBokehRosegold from "@/assets/hero-bokeh-rosegold.jpg";
import heroCamera from "@/assets/hero-camera.jpg";
import logo from "@/assets/brand/logo-mark.jpg";
import logoHoliday from "@/assets/brand/logo-holiday.jpg";
import logoFlyer from "@/assets/brand/logo-flyer.jpg";
import mailbox from "@/assets/photos/holiday-bakery-set-child-decorating-cake.jpg";
import santaMailbox from "@/assets/photos/mother-daughter-christmas-photo-flocked-tree-set.jpg";
import santaReading from "@/assets/photos/photos-with-santa-bloomfield-nj.jpg";
import santaSack from "@/assets/photos/christmas-family-portrait-gingerbread-house-set.jpg";
import studioSoftboxGold from "@/assets/studio-softbox-gold.jpg";
import coupleNoir from "@/assets/photos/couple-holiday-portrait-black-gold-set.jpg";
import coupleSnow from "@/assets/photos/couple-holiday-photo-snow-sofa-set.jpg";
import noirSweaters from "@/assets/photos/family-holiday-sweaters-black-gold-christmas-tree.jpg";
import winterTree from "@/assets/photos/winter-lodge-flocked-tree-holiday-photo-set.jpg";

/**
 * Brand photos: the studio's own sets, shot in Bloomfield, plus the three logo
 * lockups. Some older keys (door, carousel, mailbox…) are kept so every page
 * picks up the real photography without code changes; the names describe the
 * legacy slot, the files are the new photos.
 */
export const IMAGES = {
  logo,
  logoHoliday,
  logoFlyer,
  door,
  carousel,
  mailbox,
  santaMailbox,
  santaReading,
  santaSack,
  heroCamera,
  heroBokehRosegold,
  heroBokehAmber,
  studioSoftboxGold,
  familyStudioPortrait,
  colorfulBackdropPortrait,
  // Named sets
  stairPinkFamily,
  nutcrackerStair: colorfulBackdropPortrait,
  gingerbread: santaSack,
  bakeryFamily: familyStudioPortrait,
  bakeryBoy: mailbox,
  winterTree,
  whiteArch: door,
  snowSofaTrio: carousel,
  noirSweaters,
  coupleNoir,
  coupleSnow,
  santaStair: santaMailbox,
};

export const IMAGE_ALT = {
  door: "A woman in a faux-fur jacket reaching up through a white winter floral arch",
  carousel: "Three guests in holiday sweaters on a cream sofa in a snow-covered set",
  mailbox: "A little boy decorating a strawberry cake in the holiday bakery set",
  santaMailbox: "A laughing little girl and her mother in black beside a flocked white Christmas tree",
  santaSack: "A father and son in emerald suits and red bow ties in front of a gingerbread house",
  heroCamera: "A cream-white instant camera, studio product shot",
  studioSoftboxGold: "Studio softbox light beside a gold reflector",
  familyStudioPortrait: "A family baking a strawberry cake together in the holiday bakery set",
  colorfulBackdropPortrait: "A woman in black beside a nutcracker on a red velvet staircase",
} as const;
