// Product catalog and the pricing engine.
//
// Pricing is modeled from factory cost, not hard-coded tiers:
//   landed cost = EXW (by quantity, scaled by size) + air freight
//   price       = landed cost / (1 − target margin by quantity)
// Costs and targets below are the business inputs; change them here and
// every price on the site follows.

export type Orientation = "landscape" | "portrait";

// Dimensions are inches for the LANDSCAPE orientation (width × height ×
// depth). Portrait is the same panel set rotated: height and width swap.
export type SizeOption = { code: string; label: string; w: number; h: number; d: number };

export type ExampleImage = { src: string; brand: string; orientation: Orientation };

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
  pricing: "modeled" | "quote"; // "quote" until factory costs are in
  examples: ExampleImage[];      // Lookbook renders used as product photography
};

export const MIN_ORDER = 1500;
export const MAX_SLIDER = 50000;
export const ORIENTATIONS: { code: Orientation; label: string; hint: string }[] = [
  { code: "landscape", label: "Landscape", hint: "Wider than tall — the classic grocery shape" },
  { code: "portrait", label: "Portrait", hint: "Taller than wide — the shopper / boutique shape" },
];

// --- Cost inputs (grocery tote, laminated non-woven, 140 GSM, glossy) ----
// EXW per bag at the reference size (XL: 40 × 35 × 15 cm), by quantity.
const EXW_CURVE: [number, number][] = [
  [1500, 0.55], [3000, 0.45], [5000, 0.40], [10000, 0.34], [25000, 0.29], [50000, 0.25],
];
const EXW_FLOOR = 0.25;                       // never model a cost below this
const SIZE_FACTOR: Record<string, number> = { XL: 1.0, L: 0.9, M: 0.8, S: 0.7 };
const AIR_FREIGHT = 0.75;                     // per bag, any size, conservative
// Target gross margin by quantity (share of sell price). Set a few points
// above the goal so that absorbing the plate-fee difference (~$55/color)
// still lands at 55–60% on small runs and never below 40%.
const MARGIN_CURVE: [number, number][] = [
  [1500, 0.63], [2500, 0.61], [5000, 0.58], [10000, 0.48], [25000, 0.42], [50000, 0.40],
];
export const MARGIN_FLOOR = 0.40;
// Plates: factory charges ~$105 per print color; the customer pays a flat
// setup per color and the difference comes out of margin.
export const SETUP_PER_COLOR = 50;
export const PLATE_COST_PER_COLOR = 105;
export const COLOR_OPTIONS = [1, 2, 3, 4, 5, 6];
export const DEFAULT_COLORS = 4; // full-color (CMYK) art

function interp(curve: [number, number][], q: number): number {
  if (q <= curve[0][0]) return curve[0][1];
  for (let i = 1; i < curve.length; i++) {
    const [q0, v0] = curve[i - 1];
    const [q1, v1] = curve[i];
    if (q <= q1) return v0 + ((v1 - v0) * (q - q0)) / (q1 - q0);
  }
  return curve[curve.length - 1][1];
}

// Landed cost per bag (EXW scaled for size, plus air freight).
export function landedCost(sizeCode: string, qty: number): number {
  const exw = Math.max(interp(EXW_CURVE, qty) * (SIZE_FACTOR[sizeCode] ?? 1), EXW_FLOOR);
  return exw + AIR_FREIGHT;
}

// Customer price per bag, rounded up to the nearest 5¢. Null when the
// product is quote-only.
export function unitPrice(product: Product, sizeCode: string, qty: number): number | null {
  if (product.pricing !== "modeled") return null;
  const margin = Math.max(interp(MARGIN_CURVE, qty), MARGIN_FLOOR);
  const price = landedCost(sizeCode, qty) / (1 - margin);
  return Math.ceil(price * 20) / 20;
}

export function setupFee(colors: number): number {
  return colors * SETUP_PER_COLOR;
}

// Lowest advertised price: smallest size at the minimum run.
export function entryPrice(product: Product): number | null {
  return unitPrice(product, product.sizes[0].code, MIN_ORDER);
}

export function dims(size: SizeOption, orientation: Orientation): string {
  const f = (n: number) => (Number.isInteger(n) ? `${n}` : n.toFixed(2).replace(/0+$/, "").replace(/\.$/, ""));
  const [w, h] = orientation === "landscape" ? [size.w, size.h] : [size.h, size.w];
  return `${f(w)}" × ${f(h)}" × ${f(size.d)}"`;
}

export const PRODUCTS: Product[] = [
  {
    slug: "grocery-tote",
    name: "The Grocery Tote",
    shortName: "Grocery Tote",
    tagline: "Edge-to-edge print. Your art is the entire bag.",
    description:
      "Fully custom cut and sew in laminated non-woven — your artwork covers every panel, front, back, gussets, and base, under a glossy finish that wipes clean. Reinforced handles and a structured bottom, built to the same spec as the national programs we run.",
    // Reference: XL = 40 × 35 × 15 cm factory template; each size down
    // steps the panel set ~8%.
    sizes: [
      { code: "S", label: "Small", w: 12, h: 10.5, d: 4.75 },
      { code: "M", label: "Medium", w: 13.5, h: 11.5, d: 5 },
      { code: "L", label: "Large", w: 14.5, h: 12.5, d: 5.5 },
      { code: "XL", label: "X-Large", w: 16, h: 14, d: 6 },
    ],
    material: "140 GSM laminated non-woven polypropylene, glossy finish",
    construction: [
      "Full-color print across every panel, sealed under gloss lamination",
      "Reinforced sewn handles, cross-stitched at stress points",
      "Structured board bottom",
      "Landscape or portrait — same construction, your call",
    ],
    minOrder: MIN_ORDER,
    leadTime: "5–6 weeks",
    pricing: "modeled",
    examples: [
      { src: "/lookbook/lucky-dog/front.webp", brand: "Lucky Dog", orientation: "landscape" },
      { src: "/lookbook/olive-market/front.webp", brand: "Market", orientation: "portrait" },
    ],
  },
  {
    slug: "canvas-tote",
    name: "The Canvas Tote",
    shortName: "Canvas Tote",
    tagline: "Premium canvas, cut and sewn to your design.",
    description:
      "Real canvas construction — your dimensions, your handles, your art across the full surface. Natural or piece-dyed, landscape or portrait. The tote people keep for years, built at the quality level of the best retail brands.",
    sizes: [
      { code: "S", label: "Small", w: 13, h: 13, d: 5 },
      { code: "M", label: "Medium", w: 15, h: 15, d: 6 },
      { code: "L", label: "Large", w: 18, h: 16, d: 7 },
    ],
    material: "Premium cotton canvas",
    construction: [
      "Edge-to-edge print or dyed body, cut and sewn to your design",
      "Long self-fabric straps, bar-tacked",
      "Interior seams bound and finished",
      "Landscape or portrait",
    ],
    minOrder: MIN_ORDER,
    leadTime: "6–8 weeks",
    pricing: "quote",
    examples: [
      { src: "/lookbook/parker/front.webp", brand: "Parker", orientation: "landscape" },
      { src: "/lookbook/sunday-supply-co/front.webp", brand: "Sunday Supply Co.", orientation: "portrait" },
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
