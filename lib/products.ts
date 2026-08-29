export type PricingTier = { minQty: number; unitPrice: number };
export type SizeOption = { code: string; label: string; dims: string };

export type Product = {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  sizes: SizeOption[];
  material: string;
  construction: string[];
  minOrder: number;
  leadTime: string;
  tiers: PricingTier[];
  featured?: boolean;
};

export const MIN_ORDER = 1500;
export const MAX_SLIDER = 50000;

export const PRODUCTS: Product[] = [
  {
    slug: "grocery-tote",
    name: "The Grocery Tote",
    shortName: "Grocery Tote",
    tagline: "Edge-to-edge print. Your art is the entire bag.",
    description:
      "Fully custom cut and sew. Your artwork covers every panel — front, back, gussets, base. Reinforced handles, structured bottom, built to the same spec as the national programs we run.",
    sizes: [
      { code: "S", label: "Small", dims: '12" × 13" × 7"' },
      { code: "M", label: "Medium", dims: '14" × 15" × 8"' },
      { code: "L", label: "Large", dims: '16" × 16" × 9"' },
      { code: "XL", label: "X-Large", dims: '19" × 17" × 10"' },
    ],
    material: "100% non-woven polypropylene, laminated",
    construction: [
      "Full-color laminated print across every panel",
      "Reinforced sewn handles, cross-stitched at stress points",
      "Structured board bottom",
      "Wipes clean; built for years of grocery runs",
    ],
    minOrder: MIN_ORDER,
    leadTime: "4–6 weeks",
    tiers: [
      { minQty: 1500, unitPrice: 1.85 },
      { minQty: 2500, unitPrice: 1.72 },
      { minQty: 5000, unitPrice: 1.52 },
      { minQty: 10000, unitPrice: 1.35 },
      { minQty: 25000, unitPrice: 1.20 },
      { minQty: 50000, unitPrice: 1.10 },
    ],
    featured: true,
  },
  {
    slug: "canvas-tote",
    name: "The Canvas Tote",
    shortName: "Canvas Tote",
    tagline: "Heavyweight canvas, cut and sewn to your design.",
    description:
      "Real canvas construction — your dimensions, your handles, your art across the full surface. The tote people keep for years, built at the quality level of the best retail brands.",
    sizes: [
      { code: "S", label: "Small", dims: '13" × 13" × 5"' },
      { code: "M", label: "Medium", dims: '15" × 15" × 6"' },
      { code: "L", label: "Large", dims: '18" × 16" × 7"' },
    ],
    material: "Heavyweight cotton canvas",
    construction: [
      "Edge-to-edge print, cut and sewn to your design",
      "Long self-fabric straps, bar-tacked",
      "Interior seams bound and finished",
      "The tote people keep for years",
    ],
    minOrder: MIN_ORDER,
    leadTime: "5–7 weeks",
    tiers: [
      { minQty: 1500, unitPrice: 2.95 },
      { minQty: 2500, unitPrice: 2.78 },
      { minQty: 5000, unitPrice: 2.48 },
      { minQty: 10000, unitPrice: 2.22 },
      { minQty: 25000, unitPrice: 2.02 },
      { minQty: 50000, unitPrice: 1.88 },
    ],
    featured: true,
  },
  {
    slug: "beach-bag",
    name: "The Beach Bag",
    shortName: "Beach Bag",
    tagline: "Heavy-duty, flat-bottom, made for the long haul.",
    description:
      "One size, seriously built. Extra-heavy canvas, wide flat bottom that stands on its own, rope-grade handles, and your art edge to edge. The oversized carryall your customers will use every weekend for a decade.",
    sizes: [{ code: "OS", label: "One Size", dims: '22" × 15" × 8"' }],
    material: "Extra-heavy cotton canvas",
    construction: [
      "Wide flat woven base that stands on its own",
      "Rope-grade handles, anchored through the body",
      "Edge-to-edge print on every panel",
      "Built for a decade of weekends",
    ],
    minOrder: MIN_ORDER,
    leadTime: "5–7 weeks",
    tiers: [
      { minQty: 1500, unitPrice: 3.65 },
      { minQty: 2500, unitPrice: 3.45 },
      { minQty: 5000, unitPrice: 3.10 },
      { minQty: 10000, unitPrice: 2.80 },
      { minQty: 25000, unitPrice: 2.55 },
      { minQty: 50000, unitPrice: 2.35 },
    ],
    featured: true,
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
