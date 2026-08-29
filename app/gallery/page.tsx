import Link from "next/link";
import Reveal from "@/components/Reveal";
import ConceptImage from "@/components/ConceptImage";

export const metadata = {
  title: "The Lookbook | KINGBAGS",
  description:
    "A concept collection showing what fully custom cut-and-sew can do: edge-to-edge print, contrasting gussets, photographic art, and premium construction across our bag lineup.",
};

// Concept collection: fictional brands, real constructions. Drop imagery into
// /public/lookbook/<slug>/front.webp and the card picks it up automatically.
const CONCEPTS = [
  {
    slug: "paloma-beach-club",
    brand: "Paloma Beach Club",
    vertical: "Hospitality",
    construction: "The Beach Bag · extra-heavy canvas",
    note: "Resort identity carried edge to edge, rope handles in a contrast colorway.",
    bag: "beach-bag",
  },
  {
    slug: "lucky-dog-market",
    brand: "Lucky Dog Market",
    vertical: "Retail",
    construction: "The Grocery Tote · laminated non-woven",
    note: "Illustrated pattern wrapping every panel, gussets included.",
    bag: "grocery-tote",
  },
  {
    slug: "sunday-supply-co",
    brand: "Sunday Supply Co.",
    vertical: "DTC Brands",
    construction: "The Canvas Tote · heavyweight cotton",
    note: "Typography-first system with fine line work on natural canvas.",
    bag: "canvas-tote",
  },
  {
    slug: "frankies-pizza",
    brand: "Frankie's Pizza",
    vertical: "Restaurants",
    construction: "The Grocery Tote · laminated non-woven",
    note: "Loud, maximalist print built for the checkout counter.",
    bag: "grocery-tote",
  },
  {
    slug: "hotel-marisol",
    brand: "Hotel Marisol",
    vertical: "Hospitality",
    construction: "The Canvas Tote · heavyweight cotton",
    note: "Quiet luxury: restrained palette, oversized monogram.",
    bag: "canvas-tote",
  },
  {
    slug: "bubbas-fish-shack",
    brand: "Bubba's Fish Shack",
    vertical: "Restaurants",
    construction: "The Beach Bag · extra-heavy canvas",
    note: "Photographic print and bold type on an oversized carryall.",
    bag: "beach-bag",
  },
];

export default function LookbookPage() {
  return (
    <>
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <Reveal>
            <p className="section-label mb-5">The Lookbook</p>
            <h1 className="font-serif font-black text-4xl md:text-6xl text-ink leading-[1.05] mb-6">
              What full custom looks like.
            </h1>
            <p className="text-lg text-ink-soft leading-relaxed">
              A concept collection built on the exact constructions, materials, and print
              methods we run in production — designed to show the range of what your brand
              could carry.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CONCEPTS.map((c, i) => (
              <Reveal key={c.slug} delay={(i % 3) * 100}>
                <div className="group bg-white rounded-2.5xl overflow-hidden border border-ink/10 hover:border-ember/50 hover:shadow-lift transition-all h-full">
                  <ConceptImage slug={c.slug} variant={c.bag} />
                  <div className="p-6">
                    <div className="text-[11px] font-bold tracking-[0.18em] uppercase text-ember mb-2">{c.vertical}</div>
                    <h2 className="font-bold text-ink text-lg mb-1">{c.brand}</h2>
                    <p className="text-[13px] font-semibold text-ink-soft mb-2">{c.construction}</p>
                    <p className="text-sm text-ink-soft leading-relaxed">{c.note}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="text-[13px] text-ink-soft text-center mt-10 max-w-2xl mx-auto">
            Concept artwork shown for illustrative purposes. Constructions, materials,
            printing, and manufacturing shown are our real production capabilities.
          </p>
        </div>
      </section>

      <section className="pb-28">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <Reveal>
            <h2 className="font-serif font-black text-3xl md:text-5xl text-ink leading-tight mb-6">Your brand goes here next.</h2>
            <Link href="/design" className="btn-ember text-lg !px-12 !py-5">Design Your Bag</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
