import type { StaticImageData } from "next/image";
import { IMAGES } from "./images";

/** The eight holiday sets. 01–04 are named; 05–08 are shown with working titles until the studio names them. */
export interface SetInfo {
  num: string;
  name: string;
  note: string;
  image?: StaticImageData;
  alt?: string;
  position?: string;
}

export const SETS: SetInfo[] = [
  { num: "01", name: "Elegant winter whites", note: "Snow, frost and soft light", image: IMAGES.whiteArch, alt: "A woman in a faux-fur jacket under a white winter floral arch", position: "50% 35%" },
  { num: "02", name: "Glamorous holiday décor", note: "A red velvet staircase and a nutcracker", image: IMAGES.nutcrackerStair, alt: "A woman in black beside a nutcracker on a red velvet staircase", position: "50% 36%" },
  { num: "03", name: "Bold seasonal color", note: "Candy-red carpet, garland and gold", image: IMAGES.santaStair, alt: "A candy-red carpeted staircase dressed in garland", position: "45% 40%" },
  { num: "04", name: "Whimsical settings", note: "Gingerbread, peppermint and glowing mushrooms", image: IMAGES.gingerbread, alt: "A father and son in emerald suits before a gingerbread house", position: "50% 32%" },
  { num: "05", name: "Name to come", note: "The holiday bakery", image: IMAGES.bakeryFamily, alt: "A family baking a strawberry cake in a holiday kitchen", position: "50% 40%" },
  { num: "06", name: "Name to come", note: "The snow lodge", image: IMAGES.winterTree, alt: "A woman beside a flocked tree in a snowy lodge", position: "50% 40%" },
  { num: "07", name: "Name to come", note: "Black and gold", image: IMAGES.noirSweaters, alt: "A family in holiday sweaters before a black and gold tree", position: "50% 28%" },
  { num: "08", name: "Name to come", note: "Photo to come" },
];

export const HOME_STEPS = [
  { title: "Pick your experience", body: "Photos with Santa, the Portrait Studio, or both." },
  { title: "Choose your date", body: "Eight Santa dates. The studio every day from November 27." },
  { title: "Pay with Square", body: "Secure checkout, and your confirmation arrives by email." },
];

export const HOME_FAQ = [
  { q: "Do I need a time slot to see Santa?", a: "No. Choose your date, then arrive any time between 11 AM and 7 PM. The whole family is welcome." },
  { q: "What comes with Photos with Santa?", a: "Two 4×6 prints and every digital image from your visit, for $34.99 per child." },
  { q: "How does the Portrait Studio work?", a: "Choose a session, a date and an hourly slot between 11 AM and 6 PM. You get one hour with all eight holiday sets." },
  { q: "Which dates are available?", a: "Santa visits on November 27 and 28, and December 5, 6, 12, 13, 19 and 20. The studio is open every day from November 27 to December 20." },
  { q: "How do I pay?", a: "At the end of booking you are taken to Square's secure checkout. We never see your card details." },
  { q: "Where are you?", a: "77–79 Washington Street, Bloomfield, NJ." },
];

export const SANTA_FAQ = [
  { q: "Do we need a time slot?", a: "No. Your booking holds your date. Santa is here from 11 AM to 7 PM, so arrive whenever suits your family." },
  { q: "What is included?", a: "Two 4×6 prints and all of your digital images, for $34.99 per child." },
  { q: "Can the whole family be in the photo?", a: "Yes. Parents, grandparents and siblings are all welcome in the sitting. The price is per child." },
  { q: "Which dates does Santa visit?", a: "November 27 and 28, and December 5, 6, 12, 13, 19 and 20." },
  { q: "What if we need to change our date?", a: "Email info@theselfiestudioexeprience.com or call 973-695-8381 and we will help you move it." },
];

export const STUDIO_FAQ = [
  { q: "How long is a session?", a: "One hour, with access to all eight holiday sets." },
  { q: "What is Selfie Studio Access?", a: "You and your guests take your own photos on your own phones, with the whole studio to yourselves for an hour. Children aged 3 and under are free." },
  { q: "How does the family four-pack work?", a: "Four guests for $150, and $30 for each additional guest. It is applied automatically whenever it costs less than paying per person." },
  { q: "What does the Professional Portrait Session include?", a: "A session with our photographer, edited images and every digital photo delivered to you, for $200." },
  { q: "Can I bring my own photographer?", a: "Yes. A private hour with all eight sets is $100." },
  { q: "Which times can I book?", a: "Hourly sessions from 11 AM to 6 PM, every day from November 27 to December 20." },
];

export const VISIT = {
  address: "77–79 Washington Street, Bloomfield, NJ 07003",
  mapQuery: "77-79 Washington St, Bloomfield, NJ 07003",
  santa: "Photos with Santa: 11 AM to 7 PM on the eight Santa dates",
  studio: "Portrait Studio: hourly sessions, 11 AM to 6 PM, every day from November 27",
};
