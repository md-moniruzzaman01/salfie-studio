import carousel from "@/assets/photos/snow-sofa-trio.jpeg";
import colorfulBackdropPortrait from "@/assets/photos/nutcracker-stair.jpeg";
import door from "@/assets/photos/white-arch.jpeg";
import familyStudioPortrait from "@/assets/photos/bakery-family.jpeg";
import stairPinkFamily from "@/assets/photos/stair-pink-family.jpeg";
import heroBokehAmber from "@/assets/hero-bokeh-amber.jpg";
import heroBokehRosegold from "@/assets/hero-bokeh-rosegold.jpg";
import heroCamera from "@/assets/hero-camera.jpg";
import logo from "@/assets/brand/logo-mark.jpg";
import logoHoliday from "@/assets/brand/logo-holiday.jpg";
import logoFlyer from "@/assets/brand/logo-flyer.jpg";
import mailbox from "@/assets/photos/bakery-boy.jpeg";
import santaMailbox from "@/assets/photos/santa-stair.jpeg";
import santaSack from "@/assets/photos/gingerbread.jpeg";
import studioSoftboxGold from "@/assets/studio-softbox-gold.jpg";
import coupleNoir from "@/assets/photos/couple-noir.jpeg";
import coupleSnow from "@/assets/photos/couple-snow.jpeg";
import noirSweaters from "@/assets/photos/noir-sweaters.jpeg";
import winterTree from "@/assets/photos/winter-tree.jpeg";

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
  santaMailbox: "Santa with a mother and daughter in red on a candy-red carpeted staircase",
  santaSack: "A father and son in emerald suits and red bow ties in front of a gingerbread house",
  heroCamera: "A cream-white instant camera, studio product shot",
  studioSoftboxGold: "Studio softbox light beside a gold reflector",
  familyStudioPortrait: "A family baking a strawberry cake together in the holiday bakery set",
  colorfulBackdropPortrait: "A woman in black beside a nutcracker on a red velvet staircase",
} as const;
