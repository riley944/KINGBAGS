import Link from "next/link";
import Reveal from "@/components/Reveal";
import { PRODUCTS, unitPrice, dims, MIN_ORDER } from "@/lib/products";

// The Grocery Tote in its four sizes, landscape renders only, each card
// opening the calculator with that size preselected.
export default function SizeCards({ note = true }: { note?: boolean }) {
  const p = PRODUCTS[0];
  const landscape = p.examples.filter((e) => e.orientation === "landscape");
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {p.sizes.map((sz, i) => {
          const ex = landscape[i % landscape.length];
          return (
            <Reveal key={sz.code} delay={i * 90}>
              <Link href={`/custom-bags?size=${sz.code}#price`} className="group block bg-white rounded-2.5xl overflow-hidden border border-ink/10 hover:border-ink/40 hover:shadow-lift transition-all h-full">
                <div className="aspect-square bg-smoke relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ex.src} alt={`${p.name}, ${sz.label}, concept by ${ex.brand}`} className="absolute inset-0 w-full h-full object-contain mix-blend-multiply p-4" />
                  <span className="absolute top-3 left-3 bg-ink text-white text-[11px] font-grotesk font-bold tracking-[0.14em] uppercase px-2.5 py-1 rounded-full">{sz.label}</span>
                </div>
                <div className="p-5">
                  <p className="font-bold text-ink text-[17px] leading-tight">{dims(sz, "landscape")}</p>
                  <p className="text-[12.5px] text-ink-soft mt-1">landscape, shown · {dims(sz, "portrait")} portrait</p>
                  <p className="text-[14px] font-bold text-ink mt-3">${unitPrice(p, sz.code, MIN_ORDER)!.toFixed(2)}/bag <span className="font-medium text-ink-soft">at {MIN_ORDER.toLocaleString()}, delivered</span></p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
      {note && (
        <p className="text-[13px] text-ink-soft text-center mt-6">All four shown in landscape (wider than tall). Every size is also made in portrait, same construction, same price.</p>
      )}
    </>
  );
}
