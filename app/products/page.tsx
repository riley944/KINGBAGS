import Link from "next/link";
import { PRODUCTS } from "@/lib/products";

export const metadata = {
  title: "Custom Bag Styles | KINGBAGS",
  description:
    "Fully custom cut-and-sew bags with edge-to-edge printing. Grocery totes, canvas totes, and beach bags. 2,000 unit minimums with instant pricing.",
};

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <p className="section-label mb-3">The Lineup</p>
      <h1 className="font-serif font-black text-4xl md:text-5xl text-ink mb-3">Three formats. Fully yours.</h1>
      <p className="text-ink-soft max-w-2xl mb-12">
        Every bag is cut and sewn from scratch with your art edge to edge — the same construction we run for national brand programs.
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        {PRODUCTS.map((p) => (
          <Link key={p.slug} href={`/products/${p.slug}`} className="group bg-white rounded-2.5xl overflow-hidden shadow-soft hover:shadow-lift transition-all hover:-translate-y-1">
            <div className="aspect-square bg-sand flex items-center justify-center">
              <span className="font-serif italic text-ink/15">[ {p.shortName} ]</span>
            </div>
            <div className="p-7">
              <h2 className="font-bold text-ink text-lg group-hover:text-forest transition-colors">{p.name}</h2>
              <p className="text-sm text-ink-soft mt-1 mb-4">{p.tagline}</p>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-forest">From ${p.tiers[p.tiers.length - 1].unitPrice.toFixed(2)}/bag</span>
                <span className="text-ink-soft/60">{p.sizes.length} {p.sizes.length === 1 ? "size" : "sizes"}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
