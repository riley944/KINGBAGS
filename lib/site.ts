// Site-wide constants: contact paths, calls to action, and client proof.
// Change a value here and every page follows.

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.kingbags.co";
export const CONTACT_EMAIL = "hello@kingbags.co";

// Booking link for "Talk to a specialist". Set NEXT_PUBLIC_CALENDLY_URL in
// Vercel (e.g. https://calendly.com/kingbags/15min). Until it is set, the
// Talk page falls back to email.
export const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || "";

export const SAMPLE_PRICE = 35;

export const CTA = {
  primary: "Design & Price Your Bag",
  primaryShort: "Design & Price",
  sample: `Get a $${SAMPLE_PRICE} Sample`,
  talk: "Talk to a Specialist",
  reassurance: "All-in delivered pricing · Free proof · Nothing charged until you approve",
};

// Programs produced by King Universal, the team behind KINGBAGS. Each logo
// lives in public/clients/<file>. Add an entry per brand that has cleared
// logo use. The marquee renders nothing while this list is empty.
export type ClientLogo = { name: string; file: string; width?: number };
export const CLIENT_LOGOS: ClientLogo[] = [
  { name: "Warner Bros.", file: "warner-bros.svg", width: 73 },
  { name: "Pepsi", file: "pepsi.svg", width: 62 },
  { name: "Buc-ee's", file: "bucees.png", width: 78 },
  { name: "The Ritz-Carlton", file: "ritz-carlton.png", width: 169 },
  { name: "Marriott International", file: "marriott.svg", width: 195 },
  { name: "Coca-Cola", file: "coca-cola.svg", width: 195 },
  { name: "Kohl's", file: "kohls.svg", width: 195 },
  { name: "LEGO", file: "lego.svg", width: 62 },
  { name: "Cracker Barrel", file: "cracker-barrel.svg", width: 104 },
  { name: "SOMOS", file: "somos.svg", width: 195 },
  { name: "NBCUniversal", file: "nbcuniversal.svg", width: 273 },
  { name: "Smithsonian", file: "smithsonian.svg", width: 143 },
  { name: "YMCA", file: "ymca.svg", width: 83 },
  { name: "johnnie-O", file: "johnnie-o.svg", width: 221 },
];
