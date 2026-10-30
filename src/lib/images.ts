import carousel from "@/assets/carousel.jpg";
import door from "@/assets/door.jpg";
import logo from "@/assets/logo.jpg";
import mailbox from "@/assets/mailbox.jpg";
import santaMailbox from "@/assets/santa1.jpg";
import santaSack from "@/assets/santa2.jpg";

/**
 * Brand photos. These are crops of the client's flyers and are low resolution.
 * Replace the files in src/assets with the original photos (same names) for sharp results.
 */
export const IMAGES = {
  logo,
  door,
  carousel,
  mailbox,
  santaMailbox,
  santaSack,
};

export const IMAGE_ALT = {
  door: "Golden doorway with a giant satin bow between flocked Christmas trees",
  carousel: "White carousel horse in front of a cream flower wall",
  mailbox: "Red Letters for Santa mailbox",
  santaMailbox: "Santa at the Letters for Santa mailbox by the North Pole sign",
  santaSack: "Santa carrying his gift sack, finger to his lips",
} as const;
