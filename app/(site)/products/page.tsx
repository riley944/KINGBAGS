import Link from "next/link";
import Reveal from "@/components/Reveal";
import { PRODUCTS, entryPrice } from "@/lib/products";

export const metadata = {
  title: "The Bags | KINGBAGS",
  description:
    "Two fully custom cut-and-sew bags with edge-to-edge printing — the laminated Grocery Tote and the premium Canvas Tote — in every size, landscape or portrait. From 1,500 bags.",
};

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <Reveal>
        <p className="section-label mb-4">The Lineup</p>
        <h1 className="font-serif text-4xl md:text-6xl text-ink leading-[1.05] mb-4">Two bags. Every size. Both orientations.</h1>
        <p className="text-ink-soft text-lg max-w-2xl mb-14">
          Every bag is cut and sewn from scratch with your art edge to edge — the same construction we run for national brand programs. Landscape or portrait, your call.
        </p>
      </Reveal>
      <div className="grid md:grid-cols-2 gap-6">
        {PRODUCTS.map((p, i) => {
          const price = entryPrice(p);
          return (
            <Reveal key={p.slug} delay={i * 100}>
              <Link href={`/products/${p.slug}`} className="group block bg-white rounded-2.5xl overflow-hidden border border-ink/10 hover:border-ember/50 hover:shadow-lift transition-all h-full">
                <div className="aspect-square bg-smoke relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.examples[0].src} alt={`${p.name} — concept by ${p.examples[0].brand}`} className="absolute inset-0 w-full h-full object-contain mix-blend-multiply" />
                </div>
                <div className="p-7">
                  <h2 className="font-serif text-2xl text-ink group-hover:text-ember transition-colors">{p.name}</h2>
                  <p className="text-[15px] text-ink-soft mt-1.5 mb-4">{p.tagline}</p>
                  <div className="flex justify-between items-center text-[15px]">
                    <span className="font-bold text-ember">
                      {price ? `From $${price.toFixed(2)}/bag at ${p.minOrder.toLocaleString()} · freight & duties in` : "Quoted per project"}
                    </span>
                    <span className="text-ink-soft/70">{p.sizes.length} sizes · 2 orientations</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
      <p className="text-[12px] text-ink-soft mt-6">Concept artwork shown; constructions and materials are our real production capabilities.</p>
    </div>
  );
}
