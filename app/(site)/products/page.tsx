import Link from "next/link";
import Reveal from "@/components/Reveal";
import BagArt from "@/components/BagArt";
import { PRODUCTS } from "@/lib/products";

export const metadata = {
  title: "The Bags | KINGBAGS",
  description:
    "Three fully custom cut-and-sew bags with edge-to-edge printing: the Grocery Tote, the Canvas Tote, and the Beach Bag. From 1,500 bags.",
};

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <Reveal>
        <p className="section-label mb-4">The Lineup</p>
        <h1 className="font-serif font-black text-4xl md:text-6xl text-ink leading-[1.05] mb-4">Three bags. Zero blanks.</h1>
        <p className="text-ink-soft text-lg max-w-2xl mb-14">
          Every bag is cut and sewn from scratch with your art edge to edge — the same construction we run for national brand programs.
        </p>
      </Reveal>
      <div className="grid md:grid-cols-3 gap-6">
        {PRODUCTS.map((p, i) => (
          <Reveal key={p.slug} delay={i * 100}>
            <Link href={`/products/${p.slug}`} className="group block bg-white rounded-2.5xl overflow-hidden border border-ink/10 hover:border-ember/50 hover:shadow-lift transition-all h-full">
              <div className="aspect-square bg-smoke flex items-center justify-center">
                <BagArt variant={p.slug} className="w-3/5 text-ink/30 group-hover:text-ember/60 transition-colors" />
              </div>
              <div className="p-7">
                <h2 className="font-bold text-ink text-xl group-hover:text-ember transition-colors">{p.name}</h2>
                <p className="text-[15px] text-ink-soft mt-1.5 mb-4">{p.tagline}</p>
                <div className="flex justify-between items-center text-[15px]">
                  <span className="font-bold text-ember">${p.tiers[0].unitPrice.toFixed(2)}/bag at {p.minOrder.toLocaleString()}</span>
                  <span className="text-ink-soft/70">{p.sizes.length} {p.sizes.length === 1 ? "size" : "sizes"}</span>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
