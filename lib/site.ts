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
export const CLIENT_LOGOS: ClientLogo[] = [];
