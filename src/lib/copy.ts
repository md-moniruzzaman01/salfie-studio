import type { StaticImageData } from "next/image";
import { IMAGES } from "./images";

/** The eight holiday sets. 01–04 are named; 05–08 are shown with working titles until the studio names them. */
export interface SetInfo {
  num: string;
  name: string;
  image?: StaticImageData;
  alt?: string;
  position?: string;
}

export const SETS: SetInfo[] = [
  { num: "01", name: "Elegant winter whites",  image: IMAGES.whiteArch, alt: "Elegant winter whites set: a woman in a faux-fur jacket under a white winter floral arch", position: "50% 35%" },
  { num: "02", name: "Glamorous holiday décor",  image: IMAGES.nutcrackerStair, alt: "Glamorous holiday décor set: a woman in black beside a nutcracker on a red velvet staircase", position: "50% 36%" },
  { num: "03", name: "Bold seasonal color",  image: IMAGES.santaStair, alt: "A laughing little girl and her mother in black beside a flocked white Christmas tree", position: "45% 40%" },
  { num: "04", name: "Whimsical settings", image: IMAGES.gingerbread, alt: "Christmas family portrait of a father and son in emerald suits before a gingerbread house", position: "50% 32%" },
  { num: "05", name: "Name to come",  image: IMAGES.bakeryFamily, alt: "A family baking a strawberry cake in the holiday bakery set", position: "50% 40%" },
  { num: "06", name: "Name to come",  image: IMAGES.winterTree, alt: "A woman beside a flocked tree in a snowy winter lodge set", position: "50% 40%" },
  { num: "07", name: "Name to come",  image: IMAGES.noirSweaters, alt: "Holiday family photo in matching sweaters before a black and gold Christmas tree", position: "50% 28%" },
  { num: "08", name: "Name to come" },
];

export const HOME_STEPS = [
  { title: "Pick your experience", body: "Photos with Santa, the Portrait Studio, or both." },
  { title: "Choose your date", body: "Eight Santa dates. The studio every day from November 27." },
  { title: "Confirm", body: "Secure checkout, and your confirmation arrives by email." },
];

export const HOME_FAQ = [
  { q: "Do I need a time slot to see Santa?", a: "No. Choose your date, then arrive any time between 11 AM and 7 PM. The whole family is welcome." },
  { q: "What comes with Photos with Santa?", a: "Two 4×6 prints and every digital image from your visit, for $34.99 per child." },
  { q: "How does the Portrait Studio work?", a: "Choose a session, a date and an hourly slot between 11 AM and 6 PM. You get one hour with all eight holiday sets." },
  { q: "Which dates are available?", a: "Santa visits on November 27 and 28, and December 5, 6, 12, 13, 19 and 20. The studio is open every day from November 27 to December 20." },
  { q: "How much does it cost?", a: "Photos with Santa are $34.99 per child. Selfie Studio Access is regularly $44.99 per person, or $29.99 each when you book four or more guests. A Professional Portrait Session is $200, and bringing your own photographer is $100 for a private hour." },
  { q: "Can the whole family come?", a: "Yes. Parents, grandparents and siblings are welcome in the Santa photo, and the Portrait Studio is made for individuals, couples, families, friends and groups. In the studio, children aged 3 and under are free." },
  { q: "Are professional portrait sessions available?", a: "Yes. A Professional Portrait Session is $200 and includes our photographer, edited images and every digital photo. You can also bring your own photographer for $100 for a private hour." },
  { q: "How do I pay?", a: "At the end of booking you are taken to Square's secure checkout. We never see your card details." },
  { q: "Where is The Selfie Studio Experience?", a: "77–79 Washington Street, Bloomfield, NJ 07003, in Essex County. Directions and hours are under Plan your visit on this page." },
];

export const SANTA_FAQ = [
  { q: "Do we need a time slot?", a: "No. Your booking holds your date. Santa is here from 11 AM to 7 PM, so arrive whenever suits your family." },
  { q: "What is included?", a: "Two 4×6 prints and all of your digital images, for $34.99 per child." },
  { q: "Can the whole family be in the photo?", a: "Yes. Parents, grandparents and siblings are all welcome in the sitting. The price is per child." },
  { q: "Which dates does Santa visit?", a: "November 27 and 28, and December 5, 6, 12, 13, 19 and 20." },
  { q: "Where are the Santa photos taken?", a: "At The Selfie Studio Experience, 77–79 Washington Street, Bloomfield, NJ 07003." },
  { q: "What if we need to change our date?", a: "Email info@theselfiestudioexperience.com or call 973-695-8381 and we will help you move it." },
];

export const STUDIO_FAQ = [
  { q: "How long is a session?", a: "One hour, with access to all eight holiday sets." },
  { q: "What is Selfie Studio Access?", a: "You and your guests take your own photos on your own phones, with the whole studio to yourselves for an hour. Children aged 3 and under are free." },
  { q: "How does the family package work?", a: "When you book four or more guests, every ticket is $29.99. It is applied automatically at checkout." },
  { q: "What does the Professional Portrait Session include?", a: "A session with our photographer, edited images and every digital photo delivered to you, for $200." },
  { q: "Can I bring my own photographer?", a: "Yes. A private hour with all eight sets is $100." },
  { q: "Which times can I book?", a: "Hourly sessions from 11 AM to 7 PM, every day from November 27 to December 20." },
  { q: "Where is the studio?", a: "77–79 Washington Street, Bloomfield, NJ 07003, in Essex County." },
  { q: "I'm a professional photographer. Can I rent the studio for my clients?", a: "Yes, through our Photographer Partner Program: approved photographers can book 60-minute sessions at $75 per hour. See the For photographers page to apply." },
];

export const VISIT = {
  address: "77–79 Washington Street, Bloomfield, NJ 07003",
  mapQuery: "77-79 Washington St, Bloomfield, NJ 07003",
  santa: "Photos with Santa: 11 AM to 7 PM on the eight Santa dates",
  studio: "Portrait Studio: hourly sessions, 11 AM to 7 PM, every day from November 27",
};
