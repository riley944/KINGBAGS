import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTS, getProduct, unitPrice, dims, entryPrice, SETUP_PER_COLOR } from "@/lib/products";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  const price = entryPrice(p);
  return {
    title: `${p.name} — Fully Custom${price ? `, from $${price.toFixed(2)}/Bag` : ""} | KINGBAGS`,
    description: `${p.description.slice(0, 150)}...`,
  };
}

const QTYS = [1500, 2500, 5000, 10000, 25000];

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <Link href="/products" className="text-sm text-ember font-semibold hover:underline">← All Bags</Link>
      <div className="grid md:grid-cols-2 gap-12 mt-8 items-start">
        {/* GALLERY: one example per orientation */}
        <div className="md:sticky md:top-24">
          <div className="grid grid-cols-2 gap-3">
            {p.examples.map((ex) => (
              <figure key={ex.src} className="bg-smoke rounded-2.5xl overflow-hidden">
                <div className="aspect-square relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ex.src} alt={`${p.name} in ${ex.orientation} — concept by ${ex.brand}`} className="absolute inset-0 w-full h-full object-contain mix-blend-multiply" />
                </div>
                <figcaption className="px-4 py-3 flex items-baseline justify-between">
                  <span className="font-grotesk font-bold text-[11px] tracking-[0.16em] uppercase text-ink">{ex.orientation}</span>
                  <span className="text-[12px] text-ink-soft">Concept: {ex.brand}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="text-[12px] text-ink-soft mt-3">Concept artwork; the constructions and materials shown are our real production capabilities.</p>
        </div>

        <div>
          <h1 className="font-serif text-4xl md:text-5xl text-ink mb-3">{p.name}</h1>
          <p className="text-lg text-ember font-semibold mb-6">{p.tagline}</p>
          <p className="text-ink-soft text-lg leading-relaxed mb-9">{p.description}</p>

          <div className="mb-9">
            <div className="text-[11px] font-grotesk font-bold tracking-[0.18em] uppercase text-ink-soft mb-3">Orientation</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-ink/10 rounded-xl px-4 py-3">
                <p className="font-semibold text-ink text-[15px]">Landscape</p>
                <p className="text-[13px] text-ink-soft">Wider than tall. The classic grocery shape.</p>
              </div>
              <div className="bg-white border border-ink/10 rounded-xl px-4 py-3">
                <p className="font-semibold text-ink text-[15px]">Portrait</p>
                <p className="text-[13px] text-ink-soft">Taller than wide. The shopper and boutique shape.</p>
              </div>
            </div>
          </div>

          <div className="mb-9">
            <div className="text-[11px] font-grotesk font-bold tracking-[0.18em] uppercase text-ink-soft mb-3">Sizes</div>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {p.sizes.map((s) => (
                <div key={s.code} className="bg-white border border-ink/10 rounded-xl px-4 py-2.5 text-sm">
                  <span className="font-semibold text-ink">{s.label}</span>
                  <span className="block text-[12px] text-ink-soft">{dims(s, "landscape")} landscape · {dims(s, "portrait")} portrait</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-9">
            <div className="text-[11px] font-grotesk font-bold tracking-[0.18em] uppercase text-ink-soft mb-3">Materials & construction</div>
            <p className="font-semibold text-ink mb-2.5">{p.material}</p>
            <ul className="space-y-1.5">
              {p.construction.map((c) => (
                <li key={c} className="flex gap-2.5 text-[15px] text-ink-soft leading-snug">
                  <span className="text-ember font-bold shrink-0">·</span> {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-8 mb-9 text-[15px]">
            <div><span className="font-semibold text-ink">Minimum:</span> <span className="text-ink-soft">{p.minOrder.toLocaleString()} bags</span></div>
            <div><span className="font-semibold text-ink">Lead time:</span> <span className="text-ink-soft">{p.leadTime}</span></div>
          </div>

          {p.pricing === "modeled" ? (
            <div className="bg-white rounded-2.5xl border border-ink/10 overflow-hidden mb-9">
              <div className="bg-charcoal text-white text-[11px] font-grotesk font-bold tracking-[0.18em] uppercase px-6 py-3.5">
                Per-bag pricing, delivered
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[14px] min-w-[420px]">
                  <thead>
                    <tr className="bg-smoke/70 border-b border-ink/10">
                      <th className="text-left px-5 py-2.5 text-[11px] font-grotesk font-bold tracking-[0.12em] uppercase text-ink-soft">Size</th>
                      {QTYS.map((q) => (
                        <th key={q} className="px-3 py-2.5 text-right text-[11px] font-grotesk font-bold tracking-[0.12em] uppercase text-ink-soft">{q.toLocaleString()}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {p.sizes.map((s) => (
                      <tr key={s.code} className="border-b border-ink/5 last:border-0">
                        <td className="px-5 py-3 font-semibold text-ink">{s.label}</td>
                        {QTYS.map((q) => (
                          <td key={q} className="px-3 py-3 text-right font-semibold text-ink tabular-nums">${unitPrice(p, s.code, q)!.toFixed(2)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="px-5 py-3 text-[12px] text-ink-soft border-t border-ink/10">
                Air freight, customs, and duties included. One-time setup ${SETUP_PER_COLOR} per ink color.
              </p>
            </div>
          ) : (
            <div className="bg-smoke rounded-2.5xl p-6 mb-9">
              <p className="font-semibold text-ink mb-1">Quoted per project.</p>
              <p className="text-[14px] text-ink-soft leading-relaxed">
                Canvas weight, dye, and handle style move the number. Design it in the studio and we&apos;ll price it within one business day.
              </p>
            </div>
          )}

          <Link href={`/design?style=${p.slug}`} className="btn-ember w-full text-center !py-4">
            {p.pricing === "modeled" ? "Design & Price This Bag" : "Design & Request a Quote"}
          </Link>
        </div>
      </div>
    </div>
  );
}
