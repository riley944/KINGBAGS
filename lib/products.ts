export type PricingTier = { minQty: number; unitPrice: number };
export type SizeOption = { code: string; label: string; dims: string };

export type Product = {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  sizes: SizeOption[];
  minOrder: number;
  leadTime: string;
  tiers: PricingTier[];
  featured?: boolean;
};

export const MIN_ORDER = 2000;

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
    minOrder: MIN_ORDER,
    leadTime: "4–6 weeks",
    tiers: [
      { minQty: 2000, unitPrice: 1.35 },
      { minQty: 2500, unitPrice: 1.25 },
      { minQty: 5000, unitPrice: 1.05 },
      { minQty: 10000, unitPrice: 0.92 },
      { minQty: 25000, unitPrice: 0.79 },
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
    minOrder: MIN_ORDER,
    leadTime: "5–7 weeks",
    tiers: [
      { minQty: 2000, unitPrice: 2.45 },
      { minQty: 2500, unitPrice: 2.25 },
      { minQty: 5000, unitPrice: 1.95 },
      { minQty: 10000, unitPrice: 1.72 },
      { minQty: 25000, unitPrice: 1.55 },
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
    minOrder: MIN_ORDER,
    leadTime: "5–7 weeks",
    tiers: [
      { minQty: 2000, unitPrice: 3.15 },
      { minQty: 2500, unitPrice: 2.95 },
      { minQty: 5000, unitPrice: 2.55 },
      { minQty: 10000, unitPrice: 2.25 },
      { minQty: 25000, unitPrice: 1.98 },
    ],
    featured: true,
  },
  // Cooler bag — ready to enable when you decide:
  // {
  //   slug: "cooler-bag",
  //   name: "The Cooler Bag",
  //   shortName: "Cooler Bag",
  //   tagline: "Insulated, zippered, printed edge to edge.",
  //   description: "One size, foil-lined, full-color exterior.",
  //   sizes: [{ code: "OS", label: "One Size", dims: '13" × 15" × 9"' }],
  //   minOrder: MIN_ORDER,
  //   leadTime: "5–7 weeks",
  //   tiers: [
  //     { minQty: 2000, unitPrice: 2.85 },
  //     { minQty: 5000, unitPrice: 2.35 },
  //     { minQty: 10000, unitPrice: 2.05 },
  //   ],
  // },
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
