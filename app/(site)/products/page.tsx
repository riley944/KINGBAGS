import Link from "next/link";
import Reveal from "@/components/Reveal";
import { PRODUCTS, unitPrice, dims, MIN_ORDER } from "@/lib/products";

export const metadata = {
  title: "The Grocery Tote | KINGBAGS",
  description:
    "One fully custom cut-and-sew bag with edge-to-edge printing, in four sizes, landscape or portrait. Laminated, glossy, built to the spec of national brand programs. From 1,500 bags.",
};

export default function ProductsPage() {
  const p = PRODUCTS[0];
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <Reveal>
        <p className="section-label mb-4">The Bag</p>
        <h1 className="font-serif text-4xl md:text-6xl text-ink leading-[1.05] mb-4">One bag. Four sizes. Both orientations.</h1>
        <p className="text-ink-soft text-lg max-w-2xl mb-14">
          {p.description}
        </p>
      </Reveal>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {p.sizes.map((sz, i) => {
          const ex = p.examples[i % p.examples.length];
          return (
            <Reveal key={sz.code} delay={i * 90}>
              <Link href={`/custom-bags?size=${sz.code}`} className="group block bg-white rounded-2.5xl overflow-hidden border border-ink/10 hover:border-ink/40 hover:shadow-lift transition-all h-full">
                <div className="aspect-square bg-smoke relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ex.src} alt={`${p.name}, ${sz.label}, concept by ${ex.brand}`} className="absolute inset-0 w-full h-full object-contain mix-blend-multiply p-4" />
                  <span className="absolute top-3 left-3 bg-ink text-white text-[11px] font-grotesk font-bold tracking-[0.14em] uppercase px-2.5 py-1 rounded-full">{sz.label}</span>
                </div>
                <div className="p-5">
                  <p className="font-bold text-ink text-[17px] leading-tight">{dims(sz, "landscape")}</p>
                  <p className="text-[12.5px] text-ink-soft mt-1">or {dims(sz, "portrait")} portrait</p>
                  <p className="text-[14px] font-bold text-ink mt-3">${unitPrice(p, sz.code, MIN_ORDER)!.toFixed(2)}/bag <span className="font-medium text-ink-soft">at {MIN_ORDER.toLocaleString()}, delivered</span></p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/products/grocery-tote" className="btn-ink !py-3 !px-7 !text-sm">Full spec and price chart</Link>
        <Link href="/custom-bags" className="btn-outline !py-3 !px-7 !text-sm">Get Your Price</Link>
      </div>
      <p className="text-[12px] text-ink-soft mt-6">Concept artwork shown; the construction and material are our real production capability.</p>
    </div>
  );
}
