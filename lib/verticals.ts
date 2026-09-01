// Vertical landing pages — one per audience the homepage chips name.
// These are the destinations for paid traffic: "custom bags for breweries"
// should land on the brewery page, not a generic gallery.

export type Vertical = {
  slug: string;
  label: string;
  color: string;
  onDark: string; // readable accent on charcoal
  headline: string;
  sub: string;
  moments: { t: string; d: string }[];
  bestBags: string[];   // product slugs, in pitch order
  concepts: string[];   // lookbook slugs to feature
};

export const VERTICALS: Vertical[] = [
  {
    slug: "dtc-brands",
    label: "DTC Brands",
    color: "#14532D",
    onDark: "#4CA173",
    headline: "Custom bags for DTC brands.",
    sub: "Your unboxing moment shouldn't end at the box. A fully custom tote turns every order into merch your customers actually wear out of the house.",
    moments: [
      { t: "The launch drop", d: "A limited tote with the collection — the piece that gets photographed for the grid." },
      { t: "The order threshold", d: "Free bag over $100. Average order value goes up; the bag advertises for years." },
      { t: "The pop-up", d: "Nothing moves product at a market stall like a beautiful bag on every arm at the event." },
    ],
    bestBags: ["canvas-tote", "grocery-tote", "beach-bag"],
    concepts: ["sunday-supply-co", "lucky-dog-market"],
  },
  {
    slug: "restaurants",
    label: "Restaurants",
    color: "#B45309",
    onDark: "#E9A13B",
    headline: "Custom bags for restaurants.",
    sub: "The takeout bag is the last thing your guest touches and the first thing their neighbors see. Make it the bag that ends up doing the groceries.",
    moments: [
      { t: "Takeout & delivery", d: "A structured, wipeable tote that carries flat and looks good on every doorstep photo." },
      { t: "The country store", d: "Heritage brands sell the bag next to the sauce — a margin line that markets itself." },
      { t: "Catering drops", d: "Show up to every office lunch with your name on the handles." },
    ],
    bestBags: ["grocery-tote", "canvas-tote", "beach-bag"],
    concepts: ["frankies-pizza", "bubbas-fish-shack"],
  },
  {
    slug: "gyms-studios",
    label: "Gyms & Studios",
    color: "#1E40AF",
    onDark: "#7C9BF2",
    headline: "Custom bags for gyms & studios.",
    sub: "Your members already carry a bag to you three times a week. It should have your name on it, not a competitor's.",
    moments: [
      { t: "New-member kit", d: "A joining gift that gets carried to work, the grocery store, and back to you." },
      { t: "The retail shelf", d: "Sell it next to the shaker bottles — members buy identity, not just equipment." },
      { t: "Challenge rewards", d: "Finish the program, earn the bag everyone else asks about." },
    ],
    bestBags: ["canvas-tote", "beach-bag", "grocery-tote"],
    concepts: ["sunday-supply-co", "hotel-marisol"],
  },
  {
    slug: "breweries",
    label: "Breweries",
    color: "#7C2231",
    onDark: "#D4808D",
    headline: "Custom bags for breweries.",
    sub: "Your fans wear your merch. Give the taproom a bag worth carrying — four-pack in one hand, your brand on the other shoulder.",
    moments: [
      { t: "The merch wall", d: "A heavyweight tote next to the tees and glassware — the piece that travels farthest." },
      { t: "To-go sales", d: "Crowlers and four-packs leave in a bag built for the weight, printed edge to edge." },
      { t: "Festival season", d: "Your bag on a thousand shoulders at every beer fest you pour at." },
    ],
    bestBags: ["beach-bag", "grocery-tote", "canvas-tote"],
    concepts: ["bubbas-fish-shack", "frankies-pizza"],
  },
  {
    slug: "retail",
    label: "Retail",
    color: "#0F766E",
    onDark: "#5EB8B0",
    headline: "Custom bags for retail.",
    sub: "The bag is the one piece of your store that walks around the neighborhood all week. National chains treat it as media. So should you.",
    moments: [
      { t: "At the register", d: "Sell it for a few dollars — shoppers pay to advertise stores they love." },
      { t: "The seasonal drop", d: "New artwork every season becomes a reason to come back and collect." },
      { t: "Loyalty tiers", d: "The bag as the visible badge of your best customers." },
    ],
    bestBags: ["grocery-tote", "canvas-tote", "beach-bag"],
    concepts: ["lucky-dog-market", "hotel-marisol"],
  },
  {
    slug: "events",
    label: "Events",
    color: "#6B21A8",
    onDark: "#B98AE0",
    headline: "Custom bags for events.",
    sub: "Welcome bags, swag bags, VIP kits — the bag outlives the lanyard by years. Make it the souvenir, not the packaging.",
    moments: [
      { t: "The welcome kit", d: "Attendees carry it all weekend — your sponsors' favorite piece of real estate." },
      { t: "VIP & speaker gifts", d: "A custom-dimensioned bag that feels made for the occasion, because it was." },
      { t: "The after-life", d: "Conference ends; the bag starts its real job at farmers markets everywhere." },
    ],
    bestBags: ["canvas-tote", "grocery-tote", "beach-bag"],
    concepts: ["paloma-beach-club", "hotel-marisol"],
  },
];

export function getVertical(slug: string) {
  return VERTICALS.find((v) => v.slug === slug);
}
