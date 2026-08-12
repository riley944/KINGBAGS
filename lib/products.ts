export type PricingTier = { minQty: number; unitPrice: number };

export type Product = {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  materials: string[];
  colors: string[];
  minOrder: number;
  leadTime: string;
  bestFor: string[];
  tiers: PricingTier[];
  featured?: boolean;
};

export const PRODUCTS: Product[] = [
  {
    slug: "grocery-tote",
    name: "Signature Grocery Tote",
    shortName: "Grocery Tote",
    tagline: "Full-color, edge-to-edge print. Built like the national programs we run.",
    description:
      "Fully custom cut and sew — not a blank with a logo slapped on. Full-color edge-to-edge printing, reinforced handles built to your spec, custom gussets and structured base. This is the same construction we produce for national grocery and destination retail programs, made to your exact design.",
    materials: ["Laminated Non-Woven PP (full-color)", "RPET (Recycled Bottles)", "Non-Woven Polypropylene"],
    colors: ["Full-Color Custom Print", "Any PMS Match", "Edge-to-Edge Artwork"],
    minOrder: 500,
    leadTime: "4–5 weeks",
    bestFor: ["Grocery & Markets", "Retail", "Events"],
    tiers: [
      { minQty: 500, unitPrice: 2.29 },
      { minQty: 1000, unitPrice: 1.89 },
      { minQty: 2500, unitPrice: 1.49 },
      { minQty: 5000, unitPrice: 1.25 },
      { minQty: 10000, unitPrice: 1.05 },
    ],
    featured: true,
  },
  {
    slug: "insulated-cooler",
    name: "Premium Insulated Cooler",
    shortName: "Cooler Bag",
    tagline: "Custom-built insulation. Full-color exterior. Zero shortcuts.",
    description:
      "Fully custom cut and sew insulated bag — zippered, foil-lined, with your exterior printed in full color across every panel. Custom sizing, custom handle configurations, custom interior layouts. The format destination retailers sell at checkout by the hundreds of thousands, built to your brand's spec.",
    materials: ["Insulated Foil-Lined with Full-Color Laminated Exterior", "Custom Interior Configurations"],
    colors: ["Full-Color Custom Print", "Any PMS Match"],
    minOrder: 500,
    leadTime: "5–6 weeks",
    bestFor: ["Grocery", "Delivery", "Outdoor Brands"],
    tiers: [
      { minQty: 500, unitPrice: 4.29 },
      { minQty: 1000, unitPrice: 3.59 },
      { minQty: 2500, unitPrice: 2.95 },
      { minQty: 5000, unitPrice: 2.49 },
      { minQty: 10000, unitPrice: 2.15 },
    ],
    featured: true,
  },
  {
    slug: "canvas-tote",
    name: "Bespoke Canvas Tote",
    shortName: "Canvas Tote",
    tagline: "Cut and sewn to your spec. The tote people keep for years.",
    description:
      "Heavyweight canvas, fully custom: your dimensions, your handle length, your pocket layout, your hardware. Full-color printing or classic screen print. This is the boutique and lifestyle-brand format done at the level your brand deserves — no catalog blanks, ever.",
    materials: ["10oz Natural Canvas", "12oz Heavy Canvas", "Organic Cotton", "Custom Dyed Fabric"],
    colors: ["Full-Color Print", "Custom Dyed Body", "Any PMS Match"],
    minOrder: 500,
    leadTime: "5–6 weeks",
    bestFor: ["Boutiques", "Bookstores", "Lifestyle Brands"],
    tiers: [
      { minQty: 500, unitPrice: 3.95 },
      { minQty: 1000, unitPrice: 3.29 },
      { minQty: 2500, unitPrice: 2.69 },
      { minQty: 5000, unitPrice: 2.29 },
      { minQty: 10000, unitPrice: 1.99 },
    ],
    featured: true,
  },
  {
    slug: "drawstring",
    name: "Custom Drawstring Bag",
    shortName: "Drawstring",
    tagline: "Full-surface print. Your art is the entire bag.",
    description:
      "Edge-to-edge full-color printing across the entire surface — front, back, everything. Custom cord colors, custom sizing, reinforced corners. Built for fitness studios, teams, schools, and events that want a bag that looks designed, not decorated.",
    materials: ["210D Polyester (full-color sublimation)", "RPET", "Non-Woven PP"],
    colors: ["Full-Surface Custom Print", "Any PMS Match Cords"],
    minOrder: 500,
    leadTime: "4–5 weeks",
    bestFor: ["Gyms & Fitness", "Teams & Schools", "Events"],
    tiers: [
      { minQty: 500, unitPrice: 1.99 },
      { minQty: 1000, unitPrice: 1.65 },
      { minQty: 2500, unitPrice: 1.35 },
      { minQty: 5000, unitPrice: 1.15 },
      { minQty: 10000, unitPrice: 0.95 },
    ],
  },
  {
    slug: "wine-bag",
    name: "Custom Wine & Bottle Carrier",
    shortName: "Wine Bag",
    tagline: "1 to 6 bottles. Custom dividers. Full-color everything.",
    description:
      "Custom cut and sew bottle carriers with reinforced dividers built for full bottles. Full-color exterior printing, custom formats from single-bottle gift bags to six-bottle carriers, and premium material options including jute and laminated finishes.",
    materials: ["Laminated Non-Woven (full-color)", "Jute with Custom Panels", "Non-Woven PP with Dividers"],
    colors: ["Full-Color Custom Print", "Any PMS Match"],
    minOrder: 500,
    leadTime: "4–5 weeks",
    bestFor: ["Wineries & Breweries", "Liquor Retail", "Gifting"],
    tiers: [
      { minQty: 500, unitPrice: 2.69 },
      { minQty: 1000, unitPrice: 2.25 },
      { minQty: 2500, unitPrice: 1.85 },
      { minQty: 5000, unitPrice: 1.55 },
      { minQty: 10000, unitPrice: 1.35 },
    ],
  },
  {
    slug: "produce-bag",
    name: "Custom Mesh Produce Set",
    shortName: "Produce Bags",
    tagline: "The premium plastic-replacement your customers are asking for.",
    description:
      "Washable mesh produce bags in branded multi-pack sets with full-color printed carry pouches. Custom set configurations, custom sizing, RPET or organic cotton mesh. The zero-waste retail item natural grocers can't keep in stock.",
    materials: ["RPET Mesh", "Organic Cotton Mesh", "Full-Color Printed Pouch"],
    colors: ["Natural", "White", "Custom Trim & Pouch Print"],
    minOrder: 1000,
    leadTime: "4–5 weeks",
    bestFor: ["Grocery & Markets", "Natural Foods", "Zero-Waste Retail"],
    tiers: [
      { minQty: 1000, unitPrice: 1.25 },
      { minQty: 2500, unitPrice: 0.99 },
      { minQty: 5000, unitPrice: 0.82 },
      { minQty: 10000, unitPrice: 0.69 },
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function priceFor(product: Product, qty: number): number {
  let price = product.tiers[0].unitPrice;
  for (const t of product.tiers) {
    if (qty >= t.minQty) price = t.unitPrice;
  }
  return price;
}
