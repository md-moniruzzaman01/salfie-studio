import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/** matchMedia condition for anything that moves on its own. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
/** Pinned / horizontal scenes only run where there is room for them. */
export const DESKTOP = "(min-width: 1024px)";

export { gsap, ScrollTrigger, SplitText, useGSAP };
