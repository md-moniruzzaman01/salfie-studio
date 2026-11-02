import carousel from "@/assets/carousel.jpg";
import colorfulBackdropPortrait from "@/assets/colorful-backdrop-portrait.jpg";
import door from "@/assets/door.jpg";
import familyStudioPortrait from "@/assets/family-studio-portrait.jpg";
import heroBokehAmber from "@/assets/hero-bokeh-amber.jpg";
import heroBokehRosegold from "@/assets/hero-bokeh-rosegold.jpg";
import heroCamera from "@/assets/hero-camera.jpg";
import logo from "@/assets/logo.jpg";
import mailbox from "@/assets/mailbox.jpg";
import santaMailbox from "@/assets/santa1.jpg";
import santaSack from "@/assets/santa2.jpg";
import studioSoftboxGold from "@/assets/studio-softbox-gold.jpg";

/**
 * Brand photos. These are crops of the client's flyers and are low resolution.
 * Replace the files in src/assets with the original photos (same names) for sharp results.
 *
 * Unsplash photos (licensed, free to use — see unsplash.com/license) were added for the
 * floating hero treatment: heroCamera (John Cardamone / Rodion Kutsaiev), heroBokehRosegold
 * (Vitalii Khodzinskyi), heroBokehAmber, studioSoftboxGold, familyStudioPortrait and
 * colorfulBackdropPortrait.
 */
export const IMAGES = {
  logo,
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
};

export const IMAGE_ALT = {
  door: "Golden doorway with a giant satin bow between flocked Christmas trees",
  carousel: "White carousel horse in front of a cream flower wall",
  mailbox: "Red Letters for Santa mailbox",
  santaMailbox: "Santa at the Letters for Santa mailbox by the North Pole sign",
  santaSack: "Santa carrying his gift sack, finger to his lips",
  heroCamera: "A cream-white instant camera, studio product shot",
  studioSoftboxGold: "Studio softbox light beside a gold reflector",
  familyStudioPortrait: "A family of five posed for a studio portrait",
  colorfulBackdropPortrait: "A woman laughing in front of a vivid striped backdrop",
} as const;
