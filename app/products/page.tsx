import Link from "next/link";
import { PRODUCTS } from "@/lib/products";

export const metadata = {
  title: "Custom Reusable Bag Styles | KINGBAGS",
  description:
    "Six proven custom bag styles: grocery totes, insulated coolers, canvas totes, drawstrings, wine bags, and produce bags. 500 unit minimums with instant pricing.",
};

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16">
      <p className="section-label mb-3">Products</p>
      <h1 className="font-serif font-bold text-4xl text-navy mb-3">Six styles. Zero compromises.</h1>
      <p className="text-ink/60 max-w-2xl mb-12">
        Every style below runs on the same factories and QC process we use for national brand programs.
        Pick a style to see materials, colors, and full quantity pricing.
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PRODUCTS.map((p) => (
          <Link key={p.slug} href={`/products/${p.slug}`} className="group bg-white rounded-xl overflow-hidden border border-navy/5 hover:shadow-lg transition-shadow">
            <div className="aspect-[4/3] bg-navy/5 flex items-center justify-center">
              <span className="font-serif italic text-navy/20">[ {p.shortName} photo ]</span>
            </div>
            <div className="p-6">
              <h2 className="font-bold text-navy text-lg group-hover:text-gold-dark transition-colors">{p.name}</h2>
              <p className="text-sm text-ink/60 mt-1 mb-4">{p.tagline}</p>
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-gold-dark">From ${p.tiers[p.tiers.length - 1].unitPrice.toFixed(2)}/unit</span>
                <span className="text-ink/40">Min {p.minOrder.toLocaleString()}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
